import { useState, useEffect, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export interface PwaReadinessReport {
  isHttps: boolean;
  hasManifest: boolean;
  hasServiceWorker: boolean;
  isInIframe: boolean;
  isStandalone: boolean;
  canPromptDirectly: boolean;
  platform: 'android' | 'ios' | 'desktop';
}

// Module-level global deferred prompt with fallback to window.__pwaDeferredPrompt captured in index.html head
let globalDeferredPrompt: BeforeInstallPromptEvent | null =
  typeof window !== 'undefined' && (window as any).__pwaDeferredPrompt
    ? ((window as any).__pwaDeferredPrompt as BeforeInstallPromptEvent)
    : null;

const listeners = new Set<() => void>();

function notifyPromptListeners() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {}
  });
}

if (typeof window !== 'undefined') {
  // Check if index.html already captured the prompt
  if ((window as any).__pwaDeferredPrompt) {
    globalDeferredPrompt = (window as any).__pwaDeferredPrompt;
  }

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    (window as any).__pwaDeferredPrompt = globalDeferredPrompt;
    notifyPromptListeners();
  });

  window.addEventListener('jjf-pwa-prompt-ready', () => {
    if ((window as any).__pwaDeferredPrompt) {
      globalDeferredPrompt = (window as any).__pwaDeferredPrompt;
      notifyPromptListeners();
    }
  });

  window.addEventListener('appinstalled', () => {
    globalDeferredPrompt = null;
    (window as any).__pwaDeferredPrompt = null;
    notifyPromptListeners();
  });

  window.addEventListener('jjf-pwa-installed', () => {
    globalDeferredPrompt = null;
    (window as any).__pwaDeferredPrompt = null;
    notifyPromptListeners();
  });
}

export interface PWAInstallResult {
  outcome: 'accepted' | 'dismissed' | 'no_prompt';
  success: boolean;
  message?: string;
}

function detectPlatform() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isIOS: false,
      isAndroid: false,
      isDesktop: true,
      isInIframe: false,
      isWebView: false
    };
  }
  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/.test(ua);
  const isDesktop = !isIOS && !isAndroid;
  const isWebView =
    /wv|fbav|instagram|line|micromessenger|snapchat|pinterest|whatsapp/i.test(ua) ||
    (isAndroid && /version\/[0-9\.]+/i.test(ua) && !/chrome\/[0-9\.]+/i.test(ua)) ||
    (typeof window !== 'undefined' && (window as any).Android !== undefined);
  const isInIframe = window.self !== window.top;

  return { isIOS, isAndroid, isDesktop, isInIframe, isWebView };
}

export function usePWAInstall() {
  const [, setTick] = useState(0);

  const checkIsStandalone = () => {
    if (typeof window === 'undefined') return false;
    // Strictly check for true standalone installed app mode, avoiding false positives from mobile browser UI states
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  };

  const [initialPlatform] = useState(detectPlatform);
  const [isInstalled, setIsInstalled] = useState<boolean>(checkIsStandalone);
  const [isIOS, setIsIOS] = useState<boolean>(initialPlatform.isIOS);
  const [isAndroid, setIsAndroid] = useState<boolean>(initialPlatform.isAndroid);
  const [isDesktop, setIsDesktop] = useState<boolean>(initialPlatform.isDesktop);
  const [isInIframe, setIsInIframe] = useState<boolean>(initialPlatform.isInIframe);
  const [isWebView, setIsWebView] = useState<boolean>(initialPlatform.isWebView);
  const [isSwRegistered, setIsSwRegistered] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return 'serviceWorker' in navigator && !!navigator.serviceWorker.controller;
  });

  useEffect(() => {
    const onPromptChange = () => setTick((t) => t + 1);
    listeners.add(onPromptChange);

    // If window.__pwaDeferredPrompt arrived earlier, grab it
    if (typeof window !== 'undefined' && (window as any).__pwaDeferredPrompt && !globalDeferredPrompt) {
      globalDeferredPrompt = (window as any).__pwaDeferredPrompt;
      onPromptChange();
    }

    // Check standalone mode strictly without false positive from android-app:// referrers
    setIsInstalled(checkIsStandalone());

    // Refresh device detection in case user resized or changed modes
    const currentPlatform = detectPlatform();
    setIsIOS(currentPlatform.isIOS);
    setIsAndroid(currentPlatform.isAndroid);
    setIsDesktop(currentPlatform.isDesktop);
    setIsInIframe(currentPlatform.isInIframe);
    setIsWebView(currentPlatform.isWebView);

    // Service worker check
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) setIsSwRegistered(true);
      }).catch(() => {});
    }

    const handleSwReady = () => setIsSwRegistered(true);
    window.addEventListener('jjf-sw-ready', handleSwReady);

    const matchMediaStandalone = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        globalDeferredPrompt = null;
        notifyPromptListeners();
      }
    };

    try {
      matchMediaStandalone.addEventListener('change', handleDisplayModeChange);
    } catch {}

    const handleAppInstalled = () => {
      setIsInstalled(true);
      globalDeferredPrompt = null;
      notifyPromptListeners();
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Auto-prompt trigger on ?install=true when user first interacts with page
    if (typeof window !== 'undefined' && window.location.search.includes('install=true')) {
      const autoPromptOnTouch = async () => {
        const p = globalDeferredPrompt || (window as any).__pwaDeferredPrompt;
        if (p) {
          window.removeEventListener('click', autoPromptOnTouch);
          window.removeEventListener('touchstart', autoPromptOnTouch);
          try {
            await p.prompt();
          } catch {}
        }
      };
      window.addEventListener('click', autoPromptOnTouch, { once: true });
      window.addEventListener('touchstart', autoPromptOnTouch, { once: true });
    }

    return () => {
      listeners.delete(onPromptChange);
      window.removeEventListener('jjf-sw-ready', handleSwReady);
      try {
        matchMediaStandalone.removeEventListener('change', handleDisplayModeChange);
      } catch {}
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async (): Promise<PWAInstallResult> => {
    let promptEvent = globalDeferredPrompt || (typeof window !== 'undefined' ? (window as any).__pwaDeferredPrompt : null);

    // If deferredPrompt is not ready immediately, wait briefly (up to 800ms) for beforeinstallprompt event
    if (!promptEvent && typeof window !== 'undefined') {
      promptEvent = await new Promise<BeforeInstallPromptEvent | null>((resolve) => {
        let timer: any;
        const handler = () => {
          clearTimeout(timer);
          window.removeEventListener('jjf-pwa-prompt-ready', handler);
          resolve(globalDeferredPrompt || (window as any).__pwaDeferredPrompt || null);
        };
        window.addEventListener('jjf-pwa-prompt-ready', handler, { once: true });
        timer = setTimeout(() => {
          window.removeEventListener('jjf-pwa-prompt-ready', handler);
          resolve(globalDeferredPrompt || (window as any).__pwaDeferredPrompt || null);
        }, 800);
      });
    }

    if (!promptEvent) {
      return {
        outcome: 'no_prompt',
        success: false,
        message: 'ब्राउज़र ने स्वचालित पॉपअप उपलब्ध नहीं कराया। कृपया ऊपर 3 डॉट्स (⋮) से "Install app" चुनें।'
      };
    }

    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice && choice.outcome === 'accepted') {
        globalDeferredPrompt = null;
        if (typeof window !== 'undefined') {
          (window as any).__pwaDeferredPrompt = null;
        }
        setIsInstalled(true);
        notifyPromptListeners();
        return {
          outcome: 'accepted',
          success: true,
          message: 'ऐप सफलतापूर्वक इंस्टॉल हो रहा है!'
        };
      }
      return {
        outcome: 'dismissed',
        success: false,
        message: 'ऐप इंस्टॉलेशन रद्द किया गया।'
      };
    } catch (err: any) {
      console.debug('[PWA] Error prompting installation:', err);
      return {
        outcome: 'no_prompt',
        success: false,
        message: err?.message || 'इंस्टॉलेशन में समस्या'
      };
    }
  }, []);

  const getReadinessReport = useCallback((): PwaReadinessReport => {
    const isHttps = typeof window !== 'undefined' && (
      window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    );
    const hasManifest = typeof document !== 'undefined' && !!document.querySelector('link[rel="manifest"]');
    const hasServiceWorker = typeof window !== 'undefined' && 'serviceWorker' in navigator;
    const platform: 'android' | 'ios' | 'desktop' = isIOS ? 'ios' : isAndroid ? 'android' : 'desktop';

    return {
      isHttps,
      hasManifest,
      hasServiceWorker: isSwRegistered || hasServiceWorker,
      isInIframe,
      isStandalone: isInstalled,
      canPromptDirectly: !!globalDeferredPrompt && !isInstalled,
      platform
    };
  }, [isIOS, isAndroid, isSwRegistered, isInIframe, isInstalled]);

  return {
    isInstallable: !!globalDeferredPrompt && !isInstalled,
    isInstalled,
    isIOS,
    isAndroid,
    isDesktop,
    isInIframe,
    isWebView,
    isSwRegistered,
    install,
    forceResetInstalledStatus: () => setIsInstalled(false),
    hasDeferredPrompt: !!globalDeferredPrompt,
    getReadinessReport
  };
}
