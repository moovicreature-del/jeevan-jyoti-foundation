// ============================================================================
// JEEVAN JYOTI FOUNDATION - HOME CONTENT REALTIME CONTEXT
// होम पेज सामग्री और नोटिस बोर्ड का लाइव रियल-टाइम स्टेट मैनेजर
// ============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppHomeContent, NoticeItem } from '../types';
import {
  DEFAULT_HOME_CONTENT,
  subscribeToHomeContent,
  subscribeToNotices,
  applyDynamicAppThumbnail
} from '../services/adminService';

interface HomeContentContextType {
  content: AppHomeContent;
  notices: NoticeItem[];
  activeNotices: NoticeItem[];
  isLoading: boolean;
}

const HomeContentContext = createContext<HomeContentContextType>({
  content: DEFAULT_HOME_CONTENT,
  notices: [],
  activeNotices: [],
  isLoading: true
});

export const HomeContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<AppHomeContent>(() => {
    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('jjf_home_content');
        if (local) {
          const parsed = JSON.parse(local);

          // Purge stale or corrupted media paths
          if (parsed.appThumbnailUrl && (parsed.appThumbnailUrl.includes('1791445209912') || parsed.appThumbnailUrl.includes('1791445272050') || parsed.appThumbnailUrl.includes('old'))) {
            parsed.appThumbnailUrl = '';
            localStorage.removeItem('jjf_custom_thumbnail');
          }
          if (parsed.appLogoUrl && (parsed.appLogoUrl.includes('1791445209912') || parsed.appLogoUrl.includes('1791445272050') || parsed.appLogoUrl.includes('old'))) {
            parsed.appLogoUrl = '';
            localStorage.removeItem('jjf_custom_logo');
          }

          if (parsed.appLogoUrl && !parsed.appLogoUrl.includes('ngo_logo.png')) {
            localStorage.removeItem('jjf_logo_permanently_deleted');
            try {
              localStorage.setItem('jjf_custom_logo', parsed.appLogoUrl);
            } catch {}
          } else {
            const isLogoDeleted = localStorage.getItem('jjf_logo_permanently_deleted') === 'true';
            const customLogo = isLogoDeleted ? '' : (localStorage.getItem('jjf_custom_logo') || '');
            if (customLogo && !customLogo.includes('1791445209912') && !customLogo.includes('1791445272050') && !customLogo.includes('ngo_logo.png')) {
              parsed.appLogoUrl = customLogo;
              localStorage.removeItem('jjf_logo_permanently_deleted');
            } else {
              parsed.appLogoUrl = '';
            }
          }

          if (parsed.appThumbnailUrl && parsed.appThumbnailUrl !== '/pwa-icon-512.png' && !parsed.appThumbnailUrl.includes('ngo_logo.png')) {
            localStorage.removeItem('jjf_thumb_permanently_deleted');
            try {
              localStorage.setItem('jjf_custom_thumbnail', parsed.appThumbnailUrl);
            } catch {}
          } else {
            const isThumbDeleted = localStorage.getItem('jjf_thumb_permanently_deleted') === 'true';
            const customThumb = isThumbDeleted ? '' : (localStorage.getItem('jjf_custom_thumbnail') || '');
            if (customThumb && customThumb !== '/pwa-icon-512.png' && !customThumb.includes('1791445209912') && !customThumb.includes('1791445272050') && !customThumb.includes('ngo_logo.png')) {
              parsed.appThumbnailUrl = customThumb;
              localStorage.removeItem('jjf_thumb_permanently_deleted');
            } else {
              parsed.appThumbnailUrl = '';
            }
          }
          if (parsed.certificateSealUrl && !parsed.certificateSealUrl.includes('old') && !parsed.certificateSealUrl.includes('76347e15')) {
            localStorage.removeItem('jjf_seal_permanently_deleted');
          } else {
            const isSealDeleted = typeof window !== 'undefined' && localStorage.getItem('jjf_seal_permanently_deleted') === 'true';
            const customSeal = isSealDeleted ? '' : (localStorage.getItem('jjf_custom_certificate_seal') || '');
            if (customSeal && !customSeal.includes('old') && !customSeal.includes('76347e15')) {
              parsed.certificateSealUrl = customSeal.trim();
              localStorage.removeItem('jjf_seal_permanently_deleted');
            } else if (isSealDeleted) {
              parsed.certificateSealUrl = '';
            }
          }
          const customSealVariant = localStorage.getItem('jjf_custom_certificate_seal_variant');
          if (customSealVariant) parsed.certificateSealVariant = customSealVariant as any;

          // Restore photo sections from dedicated backup storage if custom photos exist
          const restoreSectionPhotos = (currentList: any[], key: string) => {
            try {
              const stored = localStorage.getItem(key);
              if (stored) {
                const arr = JSON.parse(stored);
                if (Array.isArray(arr) && arr.length > 0) {
                  const hasCustom = arr.some((item) =>
                    item &&
                    (item.id?.startsWith('photo-') ||
                     item.id?.startsWith('url-photo-') ||
                     item.url?.startsWith('data:') ||
                     (item.url?.startsWith('/uploads/') &&
                      !item.id?.startsWith('hero-slide-') &&
                      !item.id?.startsWith('camp-slide-') &&
                      !item.id?.startsWith('event-slide-') &&
                      !item.id?.startsWith('rural-slide-')))
                  );
                  if (hasCustom) return arr;
                }
              }
            } catch {}
            return currentList;
          };

          parsed.sliderPhotos = restoreSectionPhotos(parsed.sliderPhotos || [], 'jjf_custom_slider_photos');
          parsed.campaignGalleryPhotos = restoreSectionPhotos(parsed.campaignGalleryPhotos || [], 'jjf_custom_campaign_photos');
          parsed.recentEventsPhotos = restoreSectionPhotos(parsed.recentEventsPhotos || [], 'jjf_custom_recent_photos');
          parsed.ruralWorkPhotos = restoreSectionPhotos(parsed.ruralWorkPhotos || [], 'jjf_custom_rural_photos');
          if (parsed.sliderPhotos && parsed.sliderPhotos.length > 0) {
            parsed.bannerImages = parsed.sliderPhotos.map((p: any) => p.url);
            parsed.bannerImageUrl = parsed.sliderPhotos[0]?.url || parsed.bannerImageUrl;
          }

          return parsed;
        }
        const customLogo = localStorage.getItem('jjf_custom_logo') || '';
        const isLogoDeleted = localStorage.getItem('jjf_logo_permanently_deleted') === 'true';
        const validLogo = !isLogoDeleted && customLogo && !customLogo.includes('ngo_logo.png') && !customLogo.includes('1791445209912') && !customLogo.includes('1791445272050') ? customLogo.trim() : '';
        const customThumb = localStorage.getItem('jjf_custom_thumbnail') || '';
        const isThumbDeleted = localStorage.getItem('jjf_thumb_permanently_deleted') === 'true';
        const validThumb = !isThumbDeleted && customThumb && customThumb !== '/pwa-icon-512.png' && !customThumb.includes('ngo_logo.png') && !customThumb.includes('1791445209912') && !customThumb.includes('1791445272050') ? customThumb.trim() : '';
        const customSealStored = localStorage.getItem('jjf_custom_certificate_seal');
        const isSealDeleted = localStorage.getItem('jjf_seal_permanently_deleted') === 'true';
        const validSeal = !isSealDeleted && customSealStored && !customSealStored.includes('old') && !customSealStored.includes('76347e15') ? customSealStored.trim() : '';
        const customSealVariant = localStorage.getItem('jjf_custom_certificate_seal_variant');
        
        const restoreListFallback = (key: string, def: any[]) => {
          try {
            const s = localStorage.getItem(key);
            if (s) {
              const a = JSON.parse(s);
              if (Array.isArray(a) && a.length > 0) return a;
            }
          } catch {}
          return def;
        };

        const fallbackSlider = restoreListFallback('jjf_custom_slider_photos', DEFAULT_HOME_CONTENT.sliderPhotos || []);
        const fallbackCampaign = restoreListFallback('jjf_custom_campaign_photos', DEFAULT_HOME_CONTENT.campaignGalleryPhotos || []);
        const fallbackRecent = restoreListFallback('jjf_custom_recent_photos', DEFAULT_HOME_CONTENT.recentEventsPhotos || []);
        const fallbackRural = restoreListFallback('jjf_custom_rural_photos', DEFAULT_HOME_CONTENT.ruralWorkPhotos || []);

        if (validLogo || validThumb || validSeal || fallbackSlider !== DEFAULT_HOME_CONTENT.sliderPhotos) {
          return {
            ...DEFAULT_HOME_CONTENT,
            appLogoUrl: validLogo,
            appThumbnailUrl: validThumb,
            certificateSealUrl: validSeal || '/uploads/official_seal.png',
            certificateSealVariant: (customSealVariant as any) || 'gold-crimson',
            sliderPhotos: fallbackSlider,
            campaignGalleryPhotos: fallbackCampaign,
            recentEventsPhotos: fallbackRecent,
            ruralWorkPhotos: fallbackRural,
            bannerImages: fallbackSlider.map((p: any) => p.url),
            bannerImageUrl: fallbackSlider[0]?.url || ''
          };
        }
      } catch {
        // Ignore
      }
    }
    return DEFAULT_HOME_CONTENT;
  });
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Ensure meta tags sync on startup with any custom thumbnail
    if (content?.appThumbnailUrl) {
      applyDynamicAppThumbnail(content.appThumbnailUrl);
    }

    // 1. होम पेज कंटेंट का रियल-टाइम लिसनर
    const unsubContent = subscribeToHomeContent((updatedContent) => {
      setContent(updatedContent);
      if (updatedContent?.appThumbnailUrl) {
        applyDynamicAppThumbnail(updatedContent.appThumbnailUrl);
      }
      setIsLoading(false);
    });

    // 2. नोटिस बोर्ड का रियल-टाइम लिसनर
    const unsubNotices = subscribeToNotices((updatedNotices) => {
      setNotices(updatedNotices);
    });

    // 3. रियल-टाइम लोगो चेंज इवेंट लिसनर
    const handleLogoChanged = (e: CustomEvent<string>) => {
      const newLogo = typeof e.detail === 'string' ? e.detail : '';
      if (typeof window !== 'undefined') {
        try {
          if (newLogo) {
            localStorage.removeItem('jjf_logo_permanently_deleted');
            localStorage.setItem('jjf_custom_logo', newLogo);
          } else {
            localStorage.removeItem('jjf_custom_logo');
            localStorage.setItem('jjf_logo_permanently_deleted', 'true');
          }
        } catch {}
      }
      setContent((prev) => ({
        ...prev,
        appLogoUrl: newLogo
      }));
    };

    // 4. रियल-टाइम थंबनेल चेंज इवेंट लिसनर
    const handleThumbnailChanged = (e: CustomEvent<string>) => {
      const newThumb = typeof e.detail === 'string' ? e.detail : '';
      if (typeof window !== 'undefined') {
        try {
          if (newThumb && newThumb !== '/pwa-icon-512.png') {
            localStorage.removeItem('jjf_thumb_permanently_deleted');
            localStorage.setItem('jjf_custom_thumbnail', newThumb);
          } else {
            localStorage.removeItem('jjf_custom_thumbnail');
            localStorage.setItem('jjf_thumb_permanently_deleted', 'true');
          }
        } catch {}
      }
      setContent((prev) => ({
        ...prev,
        appThumbnailUrl: newThumb
      }));
      applyDynamicAppThumbnail(newThumb);
    };

    // 5. रियल-टाइम सर्टिफिकेट मुहर (Official Seal) चेंज इवेंट लिसनर
    const handleSealChanged = (e: CustomEvent<any>) => {
      const detail = e.detail;
      let newSeal = '';
      let newVariant: any = undefined;
      if (typeof detail === 'string') {
        newSeal = detail.trim();
      } else if (detail && typeof detail === 'object') {
        if (detail.sealUrl !== undefined) newSeal = (detail.sealUrl || '').trim();
        if (detail.sealVariant) newVariant = detail.sealVariant;
      }
      if (typeof window !== 'undefined') {
        try {
          if (newSeal) {
            localStorage.removeItem('jjf_seal_permanently_deleted');
            localStorage.setItem('jjf_custom_certificate_seal', newSeal);
          } else {
            localStorage.removeItem('jjf_custom_certificate_seal');
            localStorage.setItem('jjf_seal_permanently_deleted', 'true');
          }
          if (newVariant) {
            localStorage.setItem('jjf_custom_certificate_seal_variant', newVariant);
          }
        } catch {}
      }
      setContent((prev) => ({
        ...prev,
        certificateSealUrl: newSeal,
        ...(newVariant ? { certificateSealVariant: newVariant } : {})
      }));
    };

    // 6. रियल-टाइम होम पेज समग्र कंटेंट (फ़ोटो गैलरी, टेक्स्ट व सेटिंग्स) चेंज इवेंट लिसनर
    const handleContentUpdated = (e: CustomEvent<AppHomeContent>) => {
      if (e.detail && typeof e.detail === 'object') {
        setContent(e.detail);
        if (e.detail.appThumbnailUrl) {
          applyDynamicAppThumbnail(e.detail.appThumbnailUrl);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('jjf-logo-changed' as any, handleLogoChanged);
      window.addEventListener('jjf-thumbnail-changed' as any, handleThumbnailChanged);
      window.addEventListener('jjf-seal-changed' as any, handleSealChanged);
      window.addEventListener('jjf-content-updated' as any, handleContentUpdated);
    }

    return () => {
      try {
        if (typeof unsubContent === 'function') unsubContent();
      } catch (err) {
        console.warn('Unsub content notice:', err);
      }
      try {
        if (typeof unsubNotices === 'function') unsubNotices();
      } catch (err) {
        console.warn('Unsub notices notice:', err);
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('jjf-logo-changed' as any, handleLogoChanged);
        window.removeEventListener('jjf-thumbnail-changed' as any, handleThumbnailChanged);
        window.removeEventListener('jjf-seal-changed' as any, handleSealChanged);
        window.removeEventListener('jjf-content-updated' as any, handleContentUpdated);
      }
    };
  }, []);

  const activeNotices = notices.filter((n) => n.isActive);

  return (
    <HomeContentContext.Provider
      value={{
        content,
        notices,
        activeNotices,
        isLoading
      }}
    >
      {children}
    </HomeContentContext.Provider>
  );
};

export const useHomeContent = () => {
  const context = useContext(HomeContentContext);
  return context;
};
