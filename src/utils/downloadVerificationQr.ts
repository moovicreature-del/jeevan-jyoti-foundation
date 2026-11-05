import toast from 'react-hot-toast';
import { FOUNDATION_INFO } from '../data/foundationData';

export interface VerificationQrDownloadOptions {
  certificateId: string;
  recipientName?: string;
  categoryTitle?: string;
  issueDate?: string;
  verificationUrl?: string;
  fileName?: string;
}

/**
 * Helper to draw rounded rectangle on canvas
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Downloads a scannable, high-resolution branded QR Code badge as a PNG image for offline sharing.
 * Users can print or share this badge via WhatsApp, flyer, social media, or office display.
 */
export async function downloadVerificationQrBadge(
  options: VerificationQrDownloadOptions
): Promise<boolean> {
  const {
    certificateId,
    recipientName,
    categoryTitle,
    issueDate,
    verificationUrl,
    fileName
  } = options;

  if (!certificateId || !certificateId.trim()) {
    toast.error('सत्यापन हेतु प्रमाण पत्र संख्या उपलब्ध नहीं है।');
    return false;
  }

  const cleanId = certificateId.trim().toUpperCase();
  const baseUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://jeevanjyotifoundation.org';
  const targetUrl =
    verificationUrl || `${baseUrl}/?verify=${encodeURIComponent(cleanId)}`;

  const toastId = toast.loading('सत्यापन QR कोड तैयार किया जा रहा है...');

  try {
    // 1. Locate existing QR canvas or SVG element
    let qrImageSource: CanvasImageSource | null = null;

    // A. Check for pre-rendered canvas
    const existingCanvas = (
      document.getElementById(`qr-canvas-hidden-${cleanId}`) ||
      document.getElementById(`qr-canvas-${cleanId}`) ||
      document.querySelector(`#qr-container-${cleanId} canvas`)
    ) as HTMLCanvasElement | null;

    if (existingCanvas && existingCanvas.width > 0 && existingCanvas.height > 0) {
      qrImageSource = existingCanvas;
    } else {
      // B. Check for rendered SVG element
      const existingSvg = (
        document.getElementById(`qr-svg-${cleanId}`) ||
        document.querySelector(`#qr-container-${cleanId} svg`) ||
        document.querySelector('svg[data-qr="true"]')
      ) as SVGElement | null;

      if (existingSvg) {
        qrImageSource = await loadSvgToImage(existingSvg);
      }
    }

    // C. Fallback: If not found in DOM, mount temporary offscreen QRCodeCanvas or fallback render
    if (!qrImageSource) {
      qrImageSource = await generateOffscreenQrImage(targetUrl);
    }

    if (!qrImageSource) {
      throw new Error('QR कोड इमेज तैयार नहीं हो सकी। कृपया पुनः प्रयास करें।');
    }

    // 2. Set up high-resolution master badge canvas (720 x 980 px)
    const canvas = document.createElement('canvas');
    const width = 720;
    const height = 980;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas 2D context उपलब्ध नहीं है।');
    }

    // Smooth rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Background: Clean white with warm subtle gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#FFFFFF');
    bgGradient.addColorStop(0.5, '#FFFDF7');
    bgGradient.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Outer Royal Maroon Border
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 10;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // Inner Elegant Gold Border
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.strokeRect(26, 26, width - 52, height - 52);

    // Corner decorative accents
    ctx.fillStyle = '#8B0000';
    const cornerSize = 14;
    // Top-left
    ctx.fillRect(23, 23, cornerSize, cornerSize);
    // Top-right
    ctx.fillRect(width - 23 - cornerSize, 23, cornerSize, cornerSize);
    // Bottom-left
    ctx.fillRect(23, height - 23 - cornerSize, cornerSize, cornerSize);
    // Bottom-right
    ctx.fillRect(width - 23 - cornerSize, height - 23 - cornerSize, cornerSize, cornerSize);

    // TOP SECTION: Header
    let currentY = 58;

    // Top Pill: Registered NGO Seal
    ctx.fillStyle = '#065F46'; // Emerald 800
    drawRoundedRect(ctx, width / 2 - 200, currentY, 400, 28, 14);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✓ GOVT. REGISTERED NGO • 100% VERIFIED RECORD', width / 2, currentY + 14);

    currentY += 46;

    // Main Foundation Hindi Name
    ctx.fillStyle = '#8B0000';
    ctx.font = '900 27px "Noto Serif Devanagari", "Martel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(FOUNDATION_INFO.nameHindi, width / 2, currentY);

    currentY += 22;

    // Foundation English Name
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(FOUNDATION_INFO.nameEnglish, width / 2, currentY);

    currentY += 18;

    // Registration and NITI Aayog Info
    ctx.fillStyle = '#475569';
    ctx.font = '600 11.5px monospace, system-ui, sans-serif';
    ctx.fillText(
      `Reg. No: ${FOUNDATION_INFO.regNo}  |  NITI Aayog: ${FOUNDATION_INFO.nitiAayogUid}`,
      width / 2,
      currentY
    );

    currentY += 12;

    // Decorative Separator Line with Diamond
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(70, currentY);
    ctx.lineTo(width / 2 - 20, currentY);
    ctx.moveTo(width / 2 + 20, currentY);
    ctx.lineTo(width - 70, currentY);
    ctx.stroke();

    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(width / 2, currentY, 5, 0, Math.PI * 2);
    ctx.fill();

    currentY += 24;

    // QR CODE CARD CONTAINER
    const qrCardSize = 400;
    const qrCardX = (width - qrCardSize) / 2;
    const qrCardY = currentY;

    // Outer QR card box with soft shadow & gold border
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = '#FFFFFF';
    drawRoundedRect(ctx, qrCardX, qrCardY, qrCardSize, qrCardSize, 20);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, qrCardX, qrCardY, qrCardSize, qrCardSize, 20);
    ctx.stroke();

    // Draw the QR Code image inside with quiet zone
    const qrSize = 340;
    const qrX = qrCardX + (qrCardSize - qrSize) / 2;
    const qrY = qrCardY + (qrCardSize - qrSize) / 2;
    ctx.drawImage(qrImageSource, qrX, qrY, qrSize, qrSize);

    currentY = qrCardY + qrCardSize + 22;

    // CERTIFICATE IDENTIFIER BOX
    const idBoxWidth = 560;
    const idBoxHeight = recipientName ? 82 : 62;
    const idBoxX = (width - idBoxWidth) / 2;

    ctx.fillStyle = '#FFFBEB'; // Amber 50
    drawRoundedRect(ctx, idBoxX, currentY, idBoxWidth, idBoxHeight, 14);
    ctx.fill();

    ctx.strokeStyle = '#FCD34D'; // Amber 300
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, idBoxX, currentY, idBoxWidth, idBoxHeight, 14);
    ctx.stroke();

    // Box Header Label
    ctx.fillStyle = '#92400E'; // Amber 800
    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('प्रमाण पत्र / रसीद संख्या (OFFICIAL CERTIFICATE ID)', width / 2, currentY + 10);

    // Certificate Number
    ctx.fillStyle = '#8B0000';
    ctx.font = 'bold 22px monospace, system-ui, sans-serif';
    ctx.fillText(cleanId, width / 2, currentY + 28);

    // Optional Recipient Name & Category
    if (recipientName) {
      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      const detailStr = categoryTitle
        ? `धारक: ${recipientName} • ${categoryTitle}`
        : `धारक: ${recipientName}`;
      ctx.fillText(detailStr, width / 2, currentY + 58);
    }

    currentY += idBoxHeight + 20;

    // INSTRUCTIONS SECTION FOR OFFLINE SHARING
    ctx.fillStyle = '#065F46'; // Emerald 800
    ctx.font = 'bold 13.5px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('📲 स्मार्टफोन कैमरे या Google Lens से स्कैन करें', width / 2, currentY);

    currentY += 18;

    ctx.fillStyle = '#64748B';
    ctx.font = '500 11px system-ui, -apple-system, sans-serif';
    ctx.fillText('Scan with Phone Camera or Google Lens to Verify Authenticity Online', width / 2, currentY);

    currentY += 18;

    // Live URL Box
    ctx.fillStyle = '#0F172A';
    ctx.font = '600 11px monospace, system-ui, sans-serif';
    ctx.fillText(targetUrl, width / 2, currentY);

    currentY += 28;

    // FOOTER SECTION
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, currentY);
    ctx.lineTo(width - 50, currentY);
    ctx.stroke();

    currentY += 18;

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 10.5px system-ui, -apple-system, sans-serif';
    ctx.fillText(`हेल्पलाइन: ${FOUNDATION_INFO.phone}  •  वेबसाइट: jeevanjyotifoundation.org`, width / 2, currentY);

    currentY += 15;

    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 9.5px system-ui, -apple-system, sans-serif';
    ctx.fillText('स्थान: मीरानपुर, ग़ाज़ीपुर, उत्तर प्रदेश - 233001 • जन सेवा व राष्ट्र निर्माण', width / 2, currentY);

    // 3. Export Canvas to Blob & Trigger Download
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/png', 1.0)
    );

    if (!blob) {
      throw new Error('PNG Blob निर्मित नहीं किया जा सका।');
    }

    const downloadUrl = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    const safeName = fileName || `JJF_Verify_QR_${cleanId.replace(/[^A-Za-z0-9_-]/g, '_')}.png`;
    downloadAnchor.download = safeName;
    downloadAnchor.href = downloadUrl;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();

    setTimeout(() => {
      document.body.removeChild(downloadAnchor);
      URL.revokeObjectURL(downloadUrl);
    }, 2000);

    toast.success('सत्यापन QR कोड सफलतापूर्वक डाउनलोड हो गया!', { id: toastId });
    return true;
  } catch (err: any) {
    console.error('Error downloading verification QR badge:', err);
    toast.error(err.message || 'QR कोड डाउनलोड करने में त्रुटि हुई।', { id: toastId });
    return false;
  }
}

/**
 * Convert an existing SVG element into an HTMLImageElement
 */
function loadSvgToImage(svgElement: SVGElement): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    try {
      const xml = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(new Error('SVG को इमेज में लोड नहीं किया जा सका।'));
      };
      img.src = url;
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Fallback offscreen QR code generator using dynamically imported qrcode.react
 * or pure canvas rendering if DOM elements are unmounted.
 */
async function generateOffscreenQrImage(url: string): Promise<CanvasImageSource | null> {
  try {
    const React = await import('react');
    const ReactDOM = await import('react-dom/client');
    const { QRCodeCanvas } = await import('qrcode.react');

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.opacity = '0';
    tempContainer.style.pointerEvents = 'none';
    document.body.appendChild(tempContainer);

    const root = ReactDOM.createRoot(tempContainer);

    return await new Promise<CanvasImageSource | null>((resolve) => {
      root.render(
        React.createElement(QRCodeCanvas, {
          value: url,
          size: 400,
          level: 'H',
          includeMargin: true,
          marginSize: 2
        })
      );

      setTimeout(() => {
        const canvas = tempContainer.querySelector('canvas') as HTMLCanvasElement | null;
        if (canvas) {
          // Clone canvas to preserve data before unmounting
          const clonedCanvas = document.createElement('canvas');
          clonedCanvas.width = canvas.width;
          clonedCanvas.height = canvas.height;
          const cloneCtx = clonedCanvas.getContext('2d');
          if (cloneCtx) {
            cloneCtx.drawImage(canvas, 0, 0);
          }
          root.unmount();
          document.body.removeChild(tempContainer);
          resolve(clonedCanvas);
        } else {
          root.unmount();
          document.body.removeChild(tempContainer);
          resolve(null);
        }
      }, 50);
    });
  } catch (err) {
    console.warn('Fallback offscreen QR generation notice:', err);
    return null;
  }
}
