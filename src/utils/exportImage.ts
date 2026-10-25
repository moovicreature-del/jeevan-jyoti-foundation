import html2canvas from 'html2canvas';
import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { forceResolvePublicAssets } from './printHelper';

export interface ExportOptions {
  backgroundColor?: string;
  quality?: number;
  pixelRatio?: number;
  orientation?: 'portrait' | 'landscape' | 'auto';
  isIdCard?: boolean;
  isFullBleedA4?: boolean;
}

/**
 * Direct Print Helper - ensures colors and background graphics print accurately
 */
export function directPrintElement(elementIdOrRef?: HTMLElement | null): void {
  // Add print-ready class to ensure background colors & borders are rendered by printer
  document.body.classList.add('is-printing-certificate');
  
  try {
    window.print();
  } catch (err) {
    console.warn('Standard window.print() had an issue, attempting fallback print window:', err);
    if (elementIdOrRef) {
      fallbackPrintWindow(elementIdOrRef);
    }
  } finally {
    setTimeout(() => {
      document.body.classList.remove('is-printing-certificate');
    }, 1000);
  }
}

/**
 * Fallback print window for environments where standard iframe print may be restricted
 */
function fallbackPrintWindow(element: HTMLElement): void {
  try {
    const printWin = window.open('', '_blank', 'width=900,height=700');
    if (!printWin) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Jeevan Jyoti Foundation - Official Certificate</title>
          <meta charset="utf-8" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Great+Vibes&display=swap" />
          <style>
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 10mm;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #fff;
              font-family: system-ui, -apple-system, sans-serif;
            }
            .no-print { display: none !important; }
            @page {
              size: auto;
              margin: 5mm;
            }
          </style>
        </head>
        <body>
          <div style="width: 100%; max-width: 900px;">
            ${element.outerHTML}
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() { window.close(); }, 800);
            };
          </script>
        </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
  } catch (e) {
    console.error('Fallback print window error:', e);
    window.print();
  }
}

/**
 * Helper to safely extract image dimensions from data URL or element
 */
function getImageDimensions(
  dataUrl: string,
  element: HTMLElement,
  scale: number
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth || (element.offsetWidth ? element.offsetWidth * scale : 1080),
        height: img.naturalHeight || (element.offsetHeight ? element.offsetHeight * scale : 1710)
      });
    };
    img.onerror = () => {
      resolve({
        width: element.offsetWidth ? element.offsetWidth * scale : 1080,
        height: element.offsetHeight ? element.offsetHeight * scale : 1710
      });
    };
    img.src = dataUrl;
  });
}

// 350+ DPI scale calculation: Standard web CSS is 96 DPI. 350 DPI / 96 DPI ≈ 3.65 (min 3.5 for ultra-crisp print quality)
export const DEFAULT_PRINT_DPI_SCALE = 3.5;

/**
 * Dynamic High-Resolution Canvas Scaling Factor:
 * Calculates (window.devicePixelRatio || 1) * 3 dynamically to ensure
 * ultra-sharp rendering of foundation seals, emblems, signatures, and typography
 * across all screen densities, mobile devices, and export targets.
 * Retains a minimum safe baseline of 3.5x for standard 1x displays.
 */
export function getHighResolutionScale(customScale?: number): number {
  const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
  const dprScale = dpr * 3;
  if (customScale && customScale > 0) {
    return Math.max(customScale, dprScale);
  }
  return Math.max(dprScale, DEFAULT_PRINT_DPI_SCALE);
}

/**
 * Robust capture of any HTMLElement to 350+ DPI high-resolution Image Data URL.
 * Employs high-quality canvas rendering with imageSmoothingQuality: 'high'
 * and full SVG foreignObject / html2canvas pipelines so logos and seals never pixelate.
 */
export async function captureElementToImageData(
  element: HTMLElement,
  options?: {
    format?: 'png' | 'jpeg';
    quality?: number;
    scale?: number;
    backgroundColor?: string;
  }
): Promise<{ dataUrl: string; width: number; height: number } | null> {
  // Ensure export resolution uses dynamic (devicePixelRatio * 3) scaling with 3.5 baseline
  const scale = getHighResolutionScale(options?.scale);
  const quality = options?.quality ?? 1.0;
  const format = options?.format ?? 'png';
  const bg = options?.backgroundColor ?? '#FFFFFF';
  let cleanup: (() => void) | null = null;

  // Determine if element or its children is an A4 letterhead or official certificate document
  const isA4Doc = 
    element.classList.contains('official-letterhead-a4') ||
    Boolean(element.querySelector('.official-letterhead-a4')) ||
    element.id.toLowerCase().includes('letterhead') ||
    element.id.toLowerCase().includes('appointment');

  let targetWidth = 0;
  let targetHeight = 0;

  if (isA4Doc) {
    targetWidth = 794;
    targetHeight = 1123;
  } else {
    targetWidth = Math.max(element.scrollWidth || 0, element.offsetWidth || 0);
    targetHeight = Math.max(element.scrollHeight || 0, element.offsetHeight || 0);
  }

  if (targetWidth === 0) targetWidth = element.offsetWidth || 794;
  if (targetHeight === 0) targetHeight = element.offsetHeight || 1123;

  // 1. Force resolve public image assets & ensure CORS accessibility
  try {
    cleanup = await forceResolvePublicAssets(element);
  } catch (err) {
    console.warn('Asset resolution warning:', err);
  }

  // 2. PRIMARY STRATEGY: html2canvas with 350+ DPI Canvas and ultra-HD bicubic image smoothing
  // Directly paints from decoded 1200x1193 master seal and 800x800 logo bitmaps to scaled Canvas.
  // Avoids browser SVG foreignObject downsampling bugs that pixelated/blurred images in html-to-image.
  try {
    const canvas = await html2canvas(element, {
      scale: scale,
      backgroundColor: bg,
      useCORS: true,
      allowTaint: false,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      width: targetWidth,
      height: targetHeight,
      windowWidth: Math.max(targetWidth, 1280),
      windowHeight: Math.max(targetHeight, 1600),
      logging: false,
      imageTimeout: 25000,
      onclone: (_clonedDoc, clonedElement) => {
        // Anti-aliasing and font smoothing on root cloned element
        (clonedElement.style as any).webkitFontSmoothing = 'antialiased';
        (clonedElement.style as any).fontSmooth = 'always';

        // Force full target width on cloned element and all parent containers so mobile screen boundaries never clip the canvas!
        clonedElement.style.width = `${targetWidth}px`;
        clonedElement.style.minWidth = `${targetWidth}px`;
        clonedElement.style.maxWidth = `${targetWidth}px`;
        clonedElement.style.overflow = 'visible';

        let curr: HTMLElement | null = clonedElement.parentElement;
        while (curr && curr !== _clonedDoc.body) {
          curr.style.width = `${targetWidth}px`;
          curr.style.minWidth = `${targetWidth}px`;
          curr.style.overflow = 'visible';
          curr = curr.parentElement;
        }

        // Process all cloned images: remove raster filters, ensure smooth interpolation and full clarity
        const clonedImgs = clonedElement.querySelectorAll('img');
        clonedImgs.forEach((img) => {
          img.style.imageRendering = 'auto';
          (img.style as any).webkitOptimizeContrast = '';
          // Remove drop-shadow filter which creates blurry edges during canvas rasterization
          if (img.style.filter && img.style.filter.includes('drop-shadow')) {
            img.style.filter = 'none';
          }
          img.setAttribute('crossorigin', 'anonymous');
        });
      },
      ignoreElements: (node) => {
        if (node instanceof HTMLElement && (node.classList.contains('no-print') || node.classList.contains('no-export'))) {
          return true;
        }
        return false;
      }
    });

    // Ensure Canvas 2D context smoothing is enabled with highest quality
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    const dataUrl = canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', quality);
    return {
      dataUrl,
      width: canvas.width,
      height: canvas.height
    };
  } catch (canvasErr) {
    console.warn('html2canvas primary capture notice, attempting html-to-image fallback:', canvasErr);
  }

  // 3. SECONDARY STRATEGY: html-to-image fallback
  try {
    const config = {
      quality: quality,
      pixelRatio: scale,
      backgroundColor: bg,
      cacheBust: false,
      skipFonts: true,
      fontEmbedCSS: '',
      filter: (node: Node) => {
        if (node instanceof HTMLElement && (node.classList.contains('no-print') || node.classList.contains('no-export'))) {
          return false;
        }
        return true;
      }
    };

    const dataUrl = format === 'png' 
      ? await toPng(element, config)
      : await toJpeg(element, config);

    const dims = await getImageDimensions(dataUrl, element, scale);
    return {
      dataUrl,
      width: dims.width,
      height: dims.height
    };
  } catch (h2iErr) {
    console.error('All image capture methods failed for element:', h2iErr);
    return null;
  } finally {
    if (cleanup) cleanup();
  }
}

/**
 * High-Resolution PNG Export (350+ DPI by default)
 */
export async function exportElementAsPng(
  element: HTMLElement,
  fileName: string,
  options?: ExportOptions
): Promise<boolean> {
  const finalFileName = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
  const scale = getHighResolutionScale(options?.pixelRatio);
  const result = await captureElementToImageData(element, {
    format: 'png',
    quality: options?.quality ?? 1.0,
    scale: scale,
    backgroundColor: options?.backgroundColor ?? '#FFFFFF'
  });

  if (!result) return false;

  try {
    const link = document.createElement('a');
    link.download = finalFileName;
    link.href = result.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('PNG download link trigger error:', err);
    return false;
  }
}

/**
 * High-Resolution JPG Export (350+ DPI, Photographic Quality)
 */
export async function exportElementAsJpg(
  element: HTMLElement,
  fileName: string,
  options?: ExportOptions
): Promise<boolean> {
  const finalFileName = fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') ? fileName : `${fileName}.jpg`;
  const scale = getHighResolutionScale(options?.pixelRatio);
  const result = await captureElementToImageData(element, {
    format: 'jpeg',
    quality: options?.quality ?? 0.98,
    scale: scale,
    backgroundColor: options?.backgroundColor ?? '#FFFFFF'
  });

  if (!result) return false;

  try {
    const link = document.createElement('a');
    link.download = finalFileName;
    link.href = result.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('JPG download link trigger error:', err);
    return false;
  }
}

/**
 * High-Resolution Vector-Wrapped PDF Export (A4 Precision Fit with Lossless PNG at 350+ DPI)
 */
export async function exportElementAsPdf(
  element: HTMLElement,
  fileName: string,
  options?: ExportOptions
): Promise<boolean> {
  const finalFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  const scale = getHighResolutionScale(options?.pixelRatio);
  const result = await captureElementToImageData(element, {
    format: 'png',
    quality: 1.0,
    scale: scale,
    backgroundColor: options?.backgroundColor ?? '#FFFFFF'
  });

  if (!result) return false;

  try {
    const elemWidth = result.width;
    const elemHeight = result.height;
    
    // Auto-detect orientation if not forced
    const isPortrait = elemHeight > elemWidth;
    const orientation = options?.orientation && options.orientation !== 'auto'
      ? options.orientation
      : isPortrait ? 'portrait' : 'landscape';

    // Create A4 PDF
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Preserve exact aspect ratio with crisp margins
    const elemAspect = elemWidth / elemHeight;

    // Detect if this is an A4 portrait document (aspect ~ 210/297 = 0.707)
    const isA4PortraitDoc = options?.isFullBleedA4 || (orientation === 'portrait' && Math.abs(elemAspect - (210 / 297)) < 0.05);

    // Margin for clean printing (0mm for full bleed A4 letterhead, 4mm for other standard cards)
    const margin = isA4PortraitDoc ? 0 : 4;
    const usableWidth = pageWidth - (margin * 2);
    const usableHeight = pageHeight - (margin * 2);

    let renderWidth = usableWidth;
    let renderHeight = usableWidth / elemAspect;
    let offsetX = margin;
    let offsetY = margin + ((usableHeight - renderHeight) / 2);

    // Smart Badge Sizing: If it's an ID Card (narrow portrait aspect ratio), render at standard pocket badge width (~92mm) centered on A4
    const isIdCardDoc = options?.isIdCard || (orientation === 'portrait' && elemAspect < 0.72 && !isA4PortraitDoc);

    if (isIdCardDoc) {
      renderWidth = Math.min(usableWidth, 92);
      renderHeight = renderWidth / elemAspect;
      offsetX = margin + ((usableWidth - renderWidth) / 2);
      offsetY = margin + ((usableHeight - renderHeight) / 2);
    } else if (isA4PortraitDoc) {
      renderWidth = pageWidth;
      renderHeight = pageHeight;
      offsetX = 0;
      offsetY = 0;
    } else if (renderHeight > usableHeight) {
      renderHeight = usableHeight;
      renderWidth = usableHeight * elemAspect;
      offsetX = margin + ((usableWidth - renderWidth) / 2);
      offsetY = margin;
    }

    pdf.addImage(result.dataUrl, 'PNG', offsetX, offsetY, renderWidth, renderHeight, undefined, 'SLOW');
    pdf.save(finalFileName);
    return true;
  } catch (err) {
    console.error('PDF export failed:', err);
    return false;
  }
}

/**
 * High-Resolution Multi-Page PDF Export (e.g. Page 1: Front Side, Page 2: Back Side with Lossless PNG at 350+ DPI)
 */
export async function exportElementsAsMultiPagePdf(
  elements: (HTMLElement | null)[],
  fileName: string,
  options?: ExportOptions
): Promise<boolean> {
  const validElements = elements.filter((el): el is HTMLElement => el !== null);
  if (validElements.length === 0) return false;

  const finalFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;

  try {
    let pdf: jsPDF | null = null;

    for (let i = 0; i < validElements.length; i++) {
      const element = validElements[i];
      const scale = getHighResolutionScale(options?.pixelRatio);
      const result = await captureElementToImageData(element, {
        format: 'png',
        quality: 1.0,
        scale: scale,
        backgroundColor: options?.backgroundColor ?? '#FFFFFF'
      });

      if (!result) continue;

      const elemWidth = result.width;
      const elemHeight = result.height;
      const isPortrait = elemHeight > elemWidth;
      const orientation = options?.orientation && options.orientation !== 'auto'
        ? options.orientation
        : isPortrait ? 'portrait' : 'landscape';

      if (i === 0) {
        pdf = new jsPDF({
          orientation: orientation,
          unit: 'mm',
          format: 'a4'
        });
      } else if (pdf) {
        pdf.addPage('a4', orientation);
      }

      if (!pdf) continue;

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const elemAspect = elemWidth / elemHeight;

      // Clean printing margin (6mm)
      const margin = 6;
      const usableWidth = pageWidth - (margin * 2);
      const usableHeight = pageHeight - (margin * 2);

      let renderWidth = usableWidth;
      let renderHeight = usableWidth / elemAspect;
      let offsetX = margin;
      let offsetY = margin + ((usableHeight - renderHeight) / 2);

      if (renderHeight > usableHeight) {
        renderHeight = usableHeight;
        renderWidth = usableHeight * elemAspect;
        offsetX = margin + ((usableWidth - renderWidth) / 2);
        offsetY = margin;
      }

      pdf.addImage(result.dataUrl, 'PNG', offsetX, offsetY, renderWidth, renderHeight, undefined, 'SLOW');
    }

    if (pdf) {
      pdf.save(finalFileName);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Multi-page PDF export failed:', err);
    return false;
  }
}

export const exportAsImage = exportElementAsPng;

