// Official Permanent Certificate Seal Data
// Jeevan Jyoti Foundation - Official Seal & Stamp
// जीवन ज्योति फाउंडेशन ग़ाज़ीपुर - आधिकारिक डिजिटल मुहर

export const DEFAULT_OFFICIAL_SEAL_URL = "/uploads/official_seal.png";
export const BACKUP_OFFICIAL_SEAL_URL = "/official-seal.png";
export const OFFICIAL_SEAL_PNG_URL = "/uploads/official_seal.png";
export const OFFICIAL_SEAL_JPG_URL = "/uploads/official_seal.png";

/**
 * Authentic Official Foundation Seal URL.
 * Transparent, crisp vector/PNG with authentic gold rope border, yogi, sunburst, and ESTD-2018 typography.
 */
export const OFFICIAL_SEAL_SVG_DATA_URL = "/uploads/official_seal.png";
export const OFFICIAL_SEAL_BASE64_DATA_URL = "/uploads/official_seal.png";

/**
 * Returns the active official seal URL.
 * Automatically purges any obsolete legacy links and returns the authentic official foundation seal.
 */
export function getActiveOfficialSealUrl(customUrl?: string): string {
  if (
    customUrl &&
    customUrl.trim() &&
    !customUrl.includes('old') &&
    !customUrl.includes('76347e15') &&
    !customUrl.includes('cloudinary') &&
    !customUrl.includes('imgur')
  ) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('jjf_seal_permanently_deleted');
      } catch {}
    }
    return customUrl.trim();
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('jjf_custom_certificate_seal');
      if (
        stored &&
        stored.trim() &&
        !stored.includes('old') &&
        !stored.includes('76347e15') &&
        !stored.includes('cloudinary') &&
        !stored.includes('imgur')
      ) {
        localStorage.removeItem('jjf_seal_permanently_deleted');
        return stored.trim();
      }

      // If stored value was an old invalid link, clean it up permanently
      if (stored && (stored.includes('old') || stored.includes('76347e15') || stored.includes('cloudinary'))) {
        localStorage.removeItem('jjf_custom_certificate_seal');
      }
    } catch {}
  }

  return DEFAULT_OFFICIAL_SEAL_URL;
}
