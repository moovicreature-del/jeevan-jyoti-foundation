import React, { useState, useEffect } from 'react';
import {
  Download,
  X,
  Smartphone,
  Share,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Monitor,
  ArrowRight,
  ShieldAlert,
  Lock,
  Copy,
  Check,
  RefreshCw,
  Info
} from 'lucide-react';
import { useHomeContent } from '../context/HomeContentContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useHttpsCheck } from '../hooks/useHttpsCheck';

export const PwaInstallBanner: React.FC = () => {
  const homeContext = useHomeContent();
  const content = homeContext?.content;

  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    isInIframe,
    isSwRegistered,
    install,
    getReadinessReport
  } = usePWAInstall();

  const { isInsecureHttp, upgradeToHttps } = useHttpsCheck();

  const [activeThumbnail, setActiveThumbnail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const isDeleted = localStorage.getItem('jjf_thumb_permanently_deleted') === 'true';
        if (!isDeleted) {
          const localThumb = localStorage.getItem('jjf_custom_thumbnail');
          if (
            localThumb &&
            localThumb !== '/pwa-icon-512.png' &&
            !localThumb.includes('1791445209912') &&
            !localThumb.includes('1791445272050')
          ) {
            return localThumb;
          }
        }
      } catch {}
    }
    const candidate = content?.appThumbnailUrl || content?.appLogoUrl || '/pwa-icon-512.png';
    if (candidate.includes('1791445209912') || candidate.includes('1791445272050')) {
      return '/pwa-icon-512.png';
    }
    return candidate;
  });

  useEffect(() => {
    if (
      content?.appThumbnailUrl &&
      content.appThumbnailUrl !== '/pwa-icon-512.png' &&
      !content.appThumbnailUrl.includes('1791445209912') &&
      !content.appThumbnailUrl.includes('1791445272050')
    ) {
      setActiveThumbnail(content.appThumbnailUrl);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jjf_thumb_permanently_deleted');
      }
    } else {
      const isDeleted = typeof window !== 'undefined' && localStorage.getItem('jjf_thumb_permanently_deleted') === 'true';
      if (isDeleted) {
        setActiveThumbnail(content?.appLogoUrl || '/pwa-icon-512.png');
      } else if (content?.appLogoUrl && !content.appLogoUrl.includes('1791445209912') && !content.appLogoUrl.includes('1791445272050')) {
        setActiveThumbnail(content.appLogoUrl);
      } else {
        setActiveThumbnail('/pwa-icon-512.png');
      }
    }
  }, [content?.appThumbnailUrl, content?.appLogoUrl]);

  useEffect(() => {
    const handleThumbChange = (e: CustomEvent<string>) => {
      const newThumb = typeof e.detail === 'string' ? e.detail : '';
      if (newThumb && newThumb !== '/pwa-icon-512.png') {
        setActiveThumbnail(newThumb);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jjf_thumb_permanently_deleted');
        }
      } else {
        setActiveThumbnail(content?.appLogoUrl || '/pwa-icon-512.png');
      }
    };
    window.addEventListener('jjf-thumbnail-changed' as any, handleThumbChange);
    return () => window.removeEventListener('jjf-thumbnail-changed' as any, handleThumbChange);
  }, [content?.appLogoUrl]);

  const [showBanner, setShowBanner] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const isDismissed = sessionStorage.getItem('jjf_pwa_banner_dismissed') === 'true';
    return !isDismissed;
  });
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>('android');
  const [isInstalling, setIsInstalling] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  useEffect(() => {
    if (isIOS) setActiveTab('ios');
    else if (isAndroid) setActiveTab('android');
    else setActiveTab('desktop');
  }, [isIOS, isAndroid]);

  // Open modal on global custom event
  useEffect(() => {
    const handleOpenCustomModal = async () => {
      if (isInstallable) {
        setIsInstalling(true);
        try {
          const accepted = await install();
          if (accepted) {
            setShowBanner(false);
            setShowModal(false);
            return;
          }
        } finally {
          setIsInstalling(false);
        }
      }
      setShowModal(true);
    };

    window.addEventListener('open-pwa-install-modal', handleOpenCustomModal);
    return () => {
      window.removeEventListener('open-pwa-install-modal', handleOpenCustomModal);
    };
  }, [isInstallable, install]);

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        const accepted = await install();
        if (accepted) {
          setShowBanner(false);
          setShowModal(false);
          return;
        }
      } catch (err) {
        console.debug('[PWA] Prompt outcome error:', err);
      } finally {
        setIsInstalling(false);
      }
    }
    setShowModal(true);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      sessionStorage.setItem('jjf_pwa_banner_dismissed', 'true');
    } catch {}
  };

  // Construct direct install standalone URL
  const directInstallUrl = (() => {
    if (typeof window === 'undefined') return '/?install=true';
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('install', 'true');
      return url.toString();
    } catch {
      return window.location.href;
    }
  })();

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      try {
        navigator.clipboard.writeText(directInstallUrl).then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2500);
        });
      } catch {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    }
  };

  const readiness = getReadinessReport();

  return (
    <>
      {/* Top Floating PWA Banner (If not dismissed & not in standalone mode) */}
      {showBanner && !isInstalled && (
        <div className="relative z-40 bg-gradient-to-r from-[#8B0000] via-[#9E1B1B] to-[#700000] text-white px-3 sm:px-4 py-2 sm:py-2.5 shadow-md border-b-2 border-amber-400">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
            {/* Left: Organization icon & text */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white/20 border border-amber-300/80 p-0.5 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                <img
                  src={activeThumbnail}
                  alt="App Icon"
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/pwa-icon-512.png';
                  }}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-amber-300 truncate">
                  <Smartphone className="w-3.5 h-3.5 text-yellow-300 animate-bounce shrink-0" />
                  <span>फाउंडेशन आधिकारिक ऐप इंस्टॉल करें (Install App)</span>
                </div>
                <p className="text-[11px] text-amber-100 hidden md:block">
                  होम स्क्रीन पर 1-टैप में जोड़ें — सुपरफास्ट लोड, बिना इंटरनेट प्रमाण पत्र सत्यापन व डिजिटल रसीद सुविधा।
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 ml-auto sm:ml-0 shrink-0">
              <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200 text-[#8B0000] rounded-xl text-xs font-black shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 border border-yellow-200 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isInstalling ? 'प्रतीक्षा करें...' : 'ऐप इंस्टॉल करें'}</span>
              </button>
              <button
                onClick={handleDismiss}
                aria-label="Close install banner"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full cursor-pointer transition-colors"
                title="बंद करें"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete PWA Installation Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border-2 border-amber-400 relative my-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-3">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <img
                  src={activeThumbnail}
                  alt="Jeevan Jyoti Foundation App Icon"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md bg-white"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/pwa-icon-512.png';
                  }}
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full border-2 border-white shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#8B0000] font-['Cinzel',serif]">
                JEEVAN JYOTI FOUNDATION APP
              </h3>
              <p className="text-xs text-gray-700 font-bold mt-0.5">
                आधिकारिक मोबाइल व डेस्कटॉप ऐप इंस्टॉलेशन (PWA Ready)
              </p>
            </div>

            {/* If already installed */}
            {isInstalled && (
              <div className="mb-4 bg-emerald-50 border-2 border-emerald-400 rounded-xl p-3 text-emerald-950 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-emerald-800">ऐप पहले से आपके डिवाइस पर इंस्टॉल है!</div>
                  <div className="text-emerald-700 text-[11px]">आप इसे अपने फ़ोन के होम स्क्रीन या ऐप लॉन्चर से कभी भी खोल सकते हैं।</div>
                </div>
              </div>
            )}

            {/* Insecure HTTP Warning Banner */}
            {isInsecureHttp && (
              <div className="mb-4 bg-red-50 border-2 border-red-400 rounded-xl p-3.5 text-red-950 text-xs shadow-xs">
                <div className="font-black flex items-center gap-1.5 text-red-900 mb-1">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                  <span>असुरक्षित कनेक्शन (Insecure HTTP Detected)</span>
                </div>
                <p className="text-red-900/90 text-[11px] leading-relaxed mb-2.5">
                  ब्राउज़र सुरक्षा नीति (W3C PWA Standards) के कारण <strong>असुरक्षित HTTP</strong> पर PWA ऐप इंस्टॉलेशन पूरी तरह अक्षम (Disabled) रहता है। ऐप इंस्टॉल करने के लिए कृपया सुरक्षित HTTPS कनेक्शन पर जाएँ:
                </p>
                <button
                  onClick={upgradeToHttps}
                  className="w-full py-2 bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-800 hover:to-rose-800 text-white rounded-lg font-black text-xs shadow flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <Lock className="w-3.5 h-3.5 text-yellow-300" />
                  <span>सुरक्षित HTTPS पर जाएँ और इंस्टॉल करें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* PRIMARY ACTION 1: Direct 1-Click Install Button if browser prompt is ready */}
            {isInstallable && !isInstalled && (
              <div className="mb-4">
                <button
                  onClick={async () => {
                    setIsInstalling(true);
                    try {
                      const success = await install();
                      if (success) {
                        setShowModal(false);
                        setShowBanner(false);
                      }
                    } finally {
                      setIsInstalling(false);
                    }
                  }}
                  disabled={isInstalling}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-700 hover:to-green-800 text-white rounded-xl font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-4 h-4 animate-bounce" />
                  <span>{isInstalling ? 'इंस्टॉल किया जा रहा है...' : '📲 1-क्लिक में अभी ऐप इंस्टॉल करें (Install Now)'}</span>
                </button>
                <p className="text-center text-[11px] text-emerald-700 font-semibold mt-1.5">
                  ✓ ब्राउज़र ने सुरक्षित इंस्टॉलेशन अनुमति दी है। ऊपर दिए बटन पर क्लिक करें।
                </p>
              </div>
            )}

            {/* PRIMARY ACTION 2: If inside iframe (AI Studio preview or embedded frame) */}
            {isInIframe && (
              <div className="mb-4 bg-amber-50 border-2 border-amber-400 rounded-xl p-3.5 text-amber-950 text-xs shadow-sm">
                <div className="font-black flex items-center gap-1.5 text-amber-900 mb-1">
                  <Smartphone className="w-4 h-4 text-amber-700" />
                  <span>पूर्वावलोकन मोड (Preview / iFrame) सक्रिय है:</span>
                </div>
                <p className="text-gray-700 text-[11px] leading-relaxed mb-3">
                  ब्राउज़र सुरक्षा नियमों (W3C Security Standards) के अनुसार <strong>पूर्वावलोकन फ्रेम (iframe)</strong> के अंदर ऑटो-इंस्टॉल ब्लॉक रहता है। नीचे दिए गए बटन पर टैप करके सीधे ब्राउज़र में खोलें, जहाँ से 1-क्लिक में ऐप इंस्टॉल हो जाएगा:
                </p>
                <a
                  href={directInstallUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-gradient-to-r from-[#8B0000] via-red-700 to-amber-700 hover:from-red-800 hover:to-amber-800 text-white rounded-xl font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>🌐 सीधे Chrome / ब्राउज़र में खोलें और इंस्टॉल करें</span>
                </a>
              </div>
            )}

            {/* Live App Icon Confirmation Box */}
            <div className="mb-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-2.5 flex items-center gap-3">
              <img
                src={activeThumbnail}
                alt="Active App Icon"
                className="w-11 h-11 rounded-xl object-cover border border-amber-300 shadow-xs bg-white shrink-0"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/pwa-icon-512.png';
                }}
              />
              <div className="min-w-0 text-left">
                <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <span>आधिकारिक ऐप आइकन (App Icon)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    सत्यापित
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 truncate">
                  होम-स्क्रीन पर यही आधिकारिक लोगो प्रदर्शित होगा।
                </p>
              </div>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex border-b border-gray-200 mb-3 text-xs font-bold">
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-2 text-center border-b-2 flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  activeTab === 'android'
                    ? 'border-[#8B0000] text-[#8B0000] bg-red-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android (Chrome)</span>
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-2 text-center border-b-2 flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  activeTab === 'ios'
                    ? 'border-[#8B0000] text-[#8B0000] bg-red-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Share className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>
              <button
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 py-2 text-center border-b-2 flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  activeTab === 'desktop'
                    ? 'border-[#8B0000] text-[#8B0000] bg-red-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Laptop / PC</span>
              </button>
            </div>

            {/* Tab 1: Android Chrome */}
            {activeTab === 'android' && (
              <div className="space-y-2.5 text-xs text-gray-700 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                  <p>अपने Chrome ब्राउज़र के ऊपर दाईं ओर <strong>3 डॉट्स (⋮) मेन्यू</strong> पर टैप करें।</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                  <p>सूची में <strong>'Install app'</strong> या <strong>'Add to Home screen (होम स्क्रीन में जोड़ें)'</strong> पर क्लिक करें।</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  <p>पॉपअप में <strong>'Install'</strong> बटन दबाएं। ऐप तुरंत आपके फोन में इंस्टॉल हो जाएगा!</p>
                </div>
              </div>
            )}

            {/* Tab 2: iPhone / iPad */}
            {activeTab === 'ios' && (
              <div className="space-y-2.5 text-xs text-gray-700 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                  <p>सफारी (Safari) ब्राउज़र के नीचे स्थित <strong className="text-gray-900 inline-flex items-center gap-1 font-bold"><Share className="w-3.5 h-3.5 text-blue-600 inline" /> Share (शेयर)</strong> बटन पर टैप करें।</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                  <p>मेन्यू को नीचे स्क्रॉल करके <strong className="text-gray-900 font-bold">'Add to Home Screen'</strong> विकल्प चुनें।</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  <p>ऊपर दाईं ओर <strong className="text-gray-900 font-bold">'Add'</strong> दबाएं। ऐप आपके होम स्क्रीन पर उपलब्ध हो जाएगा।</p>
                </div>
              </div>
            )}

            {/* Tab 3: Desktop Chrome / Edge */}
            {activeTab === 'desktop' && (
              <div className="space-y-2.5 text-xs text-gray-700 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                  <p>ब्राउज़र की एड्रेस बार (URL bar) के दाईं ओर स्थित <strong className="text-gray-900 font-bold">कंप्यूटर/इंस्टॉल आइकन (⊕)</strong> पर क्लिक करें।</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                  <p>यदि आइकन न दिखे तो <strong>3 डॉट्स (⋮) ➔ 'Save and share' / 'Apps' ➔ 'Install Jeevan Jyoti Foundation'</strong> चुनें।</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  <p>डेस्कटॉप पर स्वतंत्र विंडो में ऐप शुरू हो जाएगा!</p>
                </div>
              </div>
            )}

            {/* Quick Share / Direct Link Copy Box */}
            <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-gray-700">सीधे Chrome में खोलने के लिए लिंक कॉपी करें:</div>
                <div className="text-[10px] text-gray-500 truncate">{directInstallUrl}</div>
              </div>
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-colors shadow-2xs"
                title="लिंक कॉपी करें"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'कॉपी हुआ!' : 'कॉपी करें'}</span>
              </button>
            </div>

            {/* Diagnostics Accordion Toggle */}
            <div className="mt-3">
              <button
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                className="text-[11px] text-gray-600 hover:text-gray-900 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-amber-600" />
                <span>{showDiagnostics ? 'सिस्टम जांच विवरण छुपाएं' : 'PWA सिस्टम जांच व स्थिति देखें'}</span>
              </button>

              {showDiagnostics && (
                <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-700">
                    <span>सुरक्षित कनेक्शन (HTTPS):</span>
                    <span className={readiness.isHttps ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                      {readiness.isHttps ? '✓ सुरक्षित (Active)' : '✗ असुरक्षित HTTP'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span>वेब मैनिफेस्ट (Web Manifest):</span>
                    <span className={readiness.hasManifest ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                      {readiness.hasManifest ? '✓ सत्यापित (Verified)' : '✗ अनुपलब्ध'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span>सर्विस वर्कर (Offline SW):</span>
                    <span className={readiness.hasServiceWorker ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                      {readiness.hasServiceWorker ? '✓ सक्रिय (Active)' : 'जांच जारी...'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span>पूर्वावलोकन स्थिति (iFrame):</span>
                    <span className={isInIframe ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
                      {isInIframe ? 'हाँ (ब्राउज़र में खोलें)' : 'स्वतंत्र ब्राउज़र टैब'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Key App Features Highlight */}
            <div className="mt-3 pt-2.5 border-t border-gray-200 grid grid-cols-2 gap-2 text-[11px] font-bold text-gray-700">
              <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>ऑफ़लाइन प्रमाण पत्र सत्यापन</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>डिजिटल 80G दान रसीदें</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2.5">
              <a
                href={directInstallUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>ब्राउज़र में खोलें</span>
              </a>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 bg-[#8B0000] hover:bg-[#A52A2A] text-white rounded-xl text-xs font-black shadow-md cursor-pointer transition-colors"
              >
                समझ गया (Got It)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PwaInstallBanner;
