/**
 * Image Optimizer Utilities
 * Provides fast client-side image compression, responsive sizing, and URL CDN transformations.
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpeg' | 'png';
}

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
}

/**
 * Resolves the absolute application root base URL for any hosting environment.
 * On GitHub Pages (e.g. username.github.io/repo-name/), it automatically detects the repo
 * prefix and returns "/repo-name/" so that image paths NEVER resolve to 404 domain root!
 */
export function getAppBasePath(): string {
  if (typeof window === 'undefined') return '/';

  try {
    const hostname = window.location.hostname || '';
    const pathname = window.location.pathname || '';

    // 1. Detect GitHub Pages (e.g., https://username.github.io/repo-name/ or https://username.github.io/repo-name)
    if (hostname.endsWith('.github.io')) {
      const segments = pathname.split('/').filter(Boolean);
      // If there's a repository path segment (and it's not a root index.html or empty)
      if (segments.length > 0 && !segments[0].includes('.') && segments[0] !== 'index.html') {
        return `/${segments[0]}/`;
      }
    }

    // 2. Check if Vite BASE_URL was passed at build time (e.g., process.env.VITE_BASE_PATH)
    const envBase = (import.meta as any).env?.BASE_URL;
    if (envBase && envBase !== './' && envBase !== '.' && envBase !== '/') {
      return envBase.endsWith('/') ? envBase : `${envBase}/`;
    }
  } catch {}

  return '/';
}

/**
 * Normalizes any relative or local image asset URL with the correct base path.
 */
export function resolveAssetUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed;
  }

  // Strip leading relative notations like './' or leading slashes
  const cleanPath = trimmed.replace(/^(\.\/|\/)+/, '');
  const basePath = getAppBasePath();
  return `${basePath}${cleanPath}`;
}

/**
 * Returns an optimized image URL with CDN scaling/format parameters where supported.
 * Falls back gracefully for local, base64, SVG, or server-proxy paths.
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  options: ImageOptimizationOptions = {}
): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  const { width, height, quality = 80 } = options;

  // 1. Data URLs & SVGs should not be transformed
  if (trimmed.startsWith('data:') || trimmed.includes('.svg') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // 2. Unsplash CDN optimization
  if (trimmed.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(trimmed);
      if (width) urlObj.searchParams.set('w', String(width));
      if (height) urlObj.searchParams.set('h', String(height));
      urlObj.searchParams.set('q', String(quality));
      urlObj.searchParams.set('auto', 'format');
      urlObj.searchParams.set('fit', 'crop');
      return urlObj.toString();
    } catch {
      return trimmed;
    }
  }

  // 3. Cloudinary CDN optimization
  if (trimmed.includes('res.cloudinary.com')) {
    try {
      const transformParts: string[] = ['f_auto', `q_${quality}`];
      if (width) transformParts.push(`w_${width}`);
      if (height) transformParts.push(`h_${height}`, 'c_limit');
      const transformStr = transformParts.join(',');
      return trimmed.replace('/upload/', `/upload/${transformStr}/`);
    } catch {
      return trimmed;
    }
  }

  // 4. Local uploads, assets, or media paths
  // Bulletproof resolution for GitHub Pages (https://user.github.io/repo-name/)
  // Ensures that all images have the correct repository base path and never 404
  if (
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('/assets/') ||
    trimmed.startsWith('/data/') ||
    trimmed.startsWith('uploads/') ||
    trimmed.startsWith('assets/') ||
    trimmed.startsWith('./uploads/') ||
    trimmed.startsWith('./assets/') ||
    trimmed.startsWith('/manager_secretary') ||
    trimmed.startsWith('./manager_secretary') ||
    trimmed.startsWith('manager_secretary') ||
    (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.startsWith('/api/'))
  ) {
    return resolveAssetUrl(trimmed);
  }

  return trimmed;
}

/**
 * Compresses an image File using HTML Canvas in browser memory before network transmission.
 * Preserves EXIF orientation and aspect ratio while reducing payload size significantly.
 */
export async function compressImageFile(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  // If not a raster image or running on server, return original
  if (typeof window === 'undefined' || typeof document === 'undefined') return file;
  if (!file || !file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.85,
    mimeType = 'image/jpeg'
  } = options;

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate scaled dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file);
        }

        // Draw with high smoothing quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // If compression didn't save size, use original
              return resolve(file);
            }
            const extension = mimeType === 'image/webp' ? '.webp' : '.jpg';
            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const compressedFile = new File([blob], `${baseName}${extension}`, {
              type: mimeType,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => resolve(file);
      img.src = event.target?.result as string;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
