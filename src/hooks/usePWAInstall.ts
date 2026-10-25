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

  const [isInstalled, setIsInstalled] = useState<boolean>(checkIsStandalone);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [isInIframe, setIsInIframe] = useState<boolean>(false);
  const [isWebView, setIsWebView] = useState<boolean>(false);
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

    // Device detection
    const ua = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(ua);
    const androidDevice = /android/.test(ua);
    const desktopDevice = !iosDevice && !androidDevice;
    const webViewDetected =
      /wv|fbav|instagram|line|micromessenger/i.test(ua) ||
      (androidDevice && /version\/[0-9\.]+/i.test(ua) && !/chrome\/[0-9\.]+/i.test(ua));

    setIsIOS(iosDevice);
    setIsAndroid(androidDevice);
    setIsDesktop(desktopDevice);
    setIsInIframe(window.self !== window.top);
    setIsWebView(webViewDetected);

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

  const install = useCallback(async (): Promise<boolean> => {
    let promptEvent = globalDeferredPrompt || (typeof window !== 'undefined' ? (window as any).__pwaDeferredPrompt : null);

    // If deferredPrompt is not ready immediately, wait briefly (up to 1500ms) for beforeinstallprompt event
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
        }, 1500);
      });
    }

    if (!promptEvent) {
      return false;
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
        return true;
      }
      return false;
    } catch (err) {
      console.debug('[PWA] Error prompting installation:', err);
      return false;
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
