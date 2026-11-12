// ============================================================================
// JEEVAN JYOTI FOUNDATION - OFFICIAL APP SOCIAL SHARE & INVITATION PORTAL
// डायरेक्ट सोशल मीडिया शेयर एवं आकर्षक 3D लोगो पोस्टर केंद्र
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  Share2,
  X,
  MessageCircle,
  Facebook,
  Twitter,
  Send,
  Linkedin,
  Instagram,
  Copy,
  Check,
  Download,
  QrCode,
  Sparkles,
  ExternalLink,
  Smartphone,
  Heart,
  Award,
  Layers,
  Palette,
  CheckCircle2,
  Loader2,
  FileText
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { FOUNDATION_INFO } from '../../data/foundationData';
import { BrandLogo } from './BrandLogo';

interface AppSocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'general' | 'quotes' | 'volunteer' | 'donation';
}

type ShareTopicKey = 'general' | 'quotes' | 'volunteer' | 'donation';

export const AppSocialShareModal: React.FC<AppSocialShareModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'general'
}) => {
  const [activeTopic, setActiveTopic] = useState<ShareTopicKey>(initialTab);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const [cardFormat, setCardFormat] = useState<'portrait' | 'square'>('portrait');
  const shareCardRef = useRef<HTMLDivElement | null>(null);

  const appUrl = typeof window !== 'undefined'
    ? `${window.location.origin}`
    : 'https://jeevanjyotifoundation.org';

  // Trigger joyous festive confetti on modal open
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#8B0000', '#FFD700', '#10B981']
        });
      } catch (e) {
        // Safe confetti catch
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Topic specific viral Hindi share copy
  const SHARE_TOPICS: Record<ShareTopicKey, {
    titleHi: string;
    badge: string;
    emoji: string;
    headline: string;
    message: string;
    hashtags: string[];
  }> = {
    general: {
      titleHi: 'समग्र सेवा अभियान (Official App)',
      badge: '🌟 मुख्य जनसेवा आमंत्रण',
      emoji: '🌟',
      headline: 'जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर के पावन सेवा अभियान से जुड़ें',
      message: `🌟 *जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर (उत्तर प्रदेश)* 🌟\nसेवा • शिक्षा • स्वास्थ्य • अन्नपूर्णा भोजन अभियान\n\nसादर प्रणाम! जीवन ज्योति फाउंडेशन के आधिकारिक जनसेवा पोर्टल से जुड़ें:\n\n✨ निःशुल्क बाल शिक्षा व अन्नपूर्णा भोजन सेवा\n✨ अपना नाम व फोटो लगाकर 1080p सुविचार व शुभकामना पोस्टर बनाएं\n✨ स्वयंसेवक बनें, सेवा करें व डिजिटल प्रमाण पत्र प्राप्त करें\n✨ नीति आयोग (भारत सरकार) मान्यता प्राप्त NGO (Reg. 2018)\n\n📲 ऐप लिंक पर क्लिक कर सीधे देखें व जुड़ें:\n👉 ${appUrl}\n\n- जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर`,
      hashtags: ['JeevanJyotiFoundation', 'Ghazipur', 'NGO', 'Seva', 'EducationForChildren']
    },
    quotes: {
      titleHi: 'सुविचार व फोटो पोस्टर स्टूडियो',
      badge: '🎨 पोस्टर मेकर स्टूडियो',
      emoji: '🎨',
      headline: 'अपने नाम व फोटो के साथ बनाएं HD सुविचार एवं त्यौहार पोस्टर',
      message: `🎨 *प्रेरक सुविचार एवं फोटो पोस्टर जनरेटर स्टूडियो* 🎨\nजीवन ज्योति फाउंडेशन, ग़ाज़ीपुर\n\n✨ 400+ प्रेरक सुविचार, दैनिक प्रज्ञा एवं साप्ताहिक देवी-देवता मंत्र!\n✨ अपनी फोटो व नाम लगाकर 1-क्लिक में 1080p Ultra HD सोशल मीडिया पोस्टर बनाएं।\n✨ WhatsApp स्टेटस व Facebook के लिए बिल्कुल निःशुल्क!\n\n📲 अभी अपना पोस्टर बनाएं:\n👉 ${appUrl}#quotes-poster\n\n- जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर`,
      hashtags: ['MotivationalQuotes', 'SuvicharPoster', 'JeevanJyoti', 'Ghazipur']
    },
    volunteer: {
      titleHi: 'स्वयंसेवक एवं डिजिटल प्रमाण पत्र',
      badge: '📜 स्वयंसेवक आमंत्रण',
      emoji: '📜',
      headline: 'स्वयंसेवक बनें व डिजिटल सत्यापित प्रमाण पत्र प्राप्त करें',
      message: `🏅 *जीवन ज्योति फाउंडेशन - स्वयंसेवक बनिए* 🏅\nग़ाज़ीपुर, उत्तर प्रदेश\n\nसमाज सेवा, निःशुल्क शिक्षा व राहत कार्यों में सहभागी बनें!\n✨ आधिकारिक डिजिटल स्वयंसेवक पहचान पत्र (I-Card)\n✨ ऑनलाइन सत्यापित प्रशस्ति प्रमाण पत्र (QR Verification)\n\n📲 निःशुल्क स्वयंसेवक पंजीकरण के लिए क्लिक करें:\n👉 ${appUrl}#volunteers\n\n- जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर`,
      hashtags: ['VolunteerIndia', 'SocialWork', 'GhazipurNGO', 'JeevanJyoti']
    },
    donation: {
      titleHi: 'पुण्य सेवा सहयोग व अन्नपूर्णा दान',
      badge: '🙏 अन्नपूर्णा व शिक्षा दान',
      emoji: '🙏',
      headline: 'निःशुल्क शिक्षा व अन्नपूर्णा भोजन सेवा में सहभागी बनें',
      message: `🌾 *जीवन ज्योति फाउंडेशन - अन्नपूर्णा एवं बाल शिक्षा सेवा* 🌾\nग़ाज़ीपुर, उत्तर प्रदेश\n\nजरूरतमंद बच्चों की शिक्षा व भूखों को पौष्टिक भोजन उपलब्ध कराने के महायज्ञ में अपना पावन सहयोग दें।\n✨ पारदर्शी ऑनलाइन रसीद व प्रमाण पत्र\n✨ नीति आयोग मान्यता प्राप्त (Reg: GAZ/03373)\n\n📲 सेवा में सहयोग के लिए क्लिक करें:\n👉 ${appUrl}#donation\n\n- जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर`,
      hashtags: ['DonateForEducation', 'AnnapurnaSeva', 'NGOIndia', 'Charity']
    }
  };

  const currentTopicData = SHARE_TOPICS[activeTopic];
  const shareText = currentTopicData.message;

  // 1. Copy Link Handler
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(appUrl);
        setCopiedLink(true);
        toast.success('🔗 ऐप का सीधा लिंक क्लिपबोर्ड में कॉपी हो गया!', { icon: '📋' });
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      toast.error('लिंक कॉपी करने में असमर्थ।');
    }
  };

  // 2. Copy Full Message Text Handler
  const handleCopyText = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setCopiedText(true);
        toast.success('📝 पूरा आमंत्रण संदेश क्लिपबोर्ड में कॉपी हो गया! इसे सीधे पेस्ट करें।', { icon: '📋' });
        setTimeout(() => setCopiedText(false), 2500);
      }
    } catch {
      toast.error('संदेश कॉपी करने में असमर्थ।');
    }
  };

  // 3. Download the Ultra-Attractive 1080p Promotional Card as HD PNG
  const handleDownloadSharePoster = async () => {
    if (!shareCardRef.current) return;
    setIsDownloadingCard(true);
    const toastId = toast.loading('1080p Ultra HD सोशल शेयर पोस्टर तैयार हो रहा है...');

    try {
      const node = shareCardRef.current;
      const actualWidth = node.scrollWidth || 600;
      const actualHeight = node.scrollHeight || 800;

      const dataUrl = await toPng(node, {
        quality: 0.98,
        pixelRatio: 3, // 3x Ultra-sharp resolution
        cacheBust: true,
        width: actualWidth,
        height: actualHeight,
        style: {
          transform: 'none',
          maxHeight: 'none',
          height: `${actualHeight}px`,
          width: `${actualWidth}px`,
          overflow: 'visible'
        }
      });

      const fileName = `JJF_App_Social_Share_Poster_${Date.now()}.png`;
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 }
      });

      toast.dismiss(toastId);
      toast.success('🎉 1080p आकर्षक सोशल शेयर पोस्टर डाउनलोड हो गया! इसे WhatsApp Status व Facebook पर लगाएं।', {
        duration: 5000,
        icon: '📥'
      });
    } catch (err) {
      console.error('Download share card error:', err);
      toast.dismiss(toastId);
      toast.error('पोस्टर डाउनलोड में समस्या आई।');
    } finally {
      setIsDownloadingCard(false);
    }
  };

  // 4. Native Web Share API (Triggers system share dialog on Android / iOS)
  const handleNativeShare = async () => {
    const shareData = {
      title: 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुर - आधिकारिक ऐप',
      text: shareText,
      url: appUrl
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success('ऐप सफलतापूर्वक शेयर किया गया! धन्यवाद।', { icon: '🎉' });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    // Fallback: copy link and open WhatsApp
    handleShareWhatsApp();
  };

  // 5. Direct WhatsApp Share
  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
    toast.success('WhatsApp खुल रहा है! आमंत्रण साझा करें।', { icon: '🟢' });
  };

  // 6. Direct Facebook Share
  const handleShareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(currentTopicData.headline)}`;
    window.open(fbUrl, '_blank');
  };

  // 7. Direct Twitter/X Share
  const handleShareTwitter = () => {
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(currentTopicData.headline)}&url=${encodeURIComponent(appUrl)}&hashtags=${encodeURIComponent(currentTopicData.hashtags.join(','))}&via=SHAILESH1666`;
    window.open(tweetUrl, '_blank');
  };

  // 8. Direct Telegram Share
  const handleShareTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(currentTopicData.headline + '\n\n' + shareText)}`;
    window.open(tgUrl, '_blank');
  };

  // 9. Direct LinkedIn Share
  const handleShareLinkedIn = () => {
    const inUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}`;
    window.open(inUrl, '_blank');
  };

  // 10. Direct Instagram Guidance
  const handleShareInstagram = async () => {
    await handleDownloadSharePoster();
    await handleCopyText();
    toast.success('📸 HD पोस्टर डाउनलोड हो गया है और कैप्शन कॉपी हो गया है! अब इंस्टाग्राम खोलकर स्टोरी या पोस्ट में लगाएं।', {
      duration: 6000,
      icon: '📸'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-white relative flex flex-col scrollbar-thin">
        {/* Glow Accents */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* =====================================================================
            TOP HEADER WITH 3D LOGO & ROYAL TITLE
            ===================================================================== */}
        <div className="relative p-5 sm:p-6 border-b border-amber-500/30 bg-gradient-to-r from-red-950/90 via-slate-900 to-amber-950/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            {/* Animated 3D Logo with Golden Glowing Ring */}
            <div className="relative shrink-0 group">
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 opacity-75 blur-xs group-hover:opacity-100 transition animate-pulse" />
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-slate-950 p-1 border-2 border-amber-400 shadow-xl flex items-center justify-center">
                <BrandLogo size={58} className="drop-shadow-lg" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-xs">
                  📲 डायरेक्ट सोशल मीडिया शेयर
                </span>
                <span className="text-xs font-mono font-bold text-amber-200">
                  नीति आयोग मान्यता प्राप्त NGO
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-serif text-white tracking-wide mt-1">
                जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर
              </h2>
              <p className="text-xs sm:text-sm text-amber-200/90 font-medium mt-0.5">
                सेवा • शिक्षा • स्वास्थ्य • अन्नपूर्णा अभियान • निःशुल्क सुविचार व प्रमाण पत्र पोर्टल
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto w-9 h-9 rounded-full bg-slate-800/80 hover:bg-red-900/80 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700 cursor-pointer shadow-md"
            title="बंद करें (Close)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =====================================================================
            TOPIC SELECTOR TABS (4 PURPOSE-BUILT HIGH-CONVERTING MESSAGES)
            ===================================================================== */}
        <div className="px-4 sm:px-6 pt-4 pb-2 bg-slate-900/60 border-b border-slate-800">
          <div className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span>शेयर करने का विषय व आमंत्रण चुनें (Select Purpose):</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(SHARE_TOPICS) as ShareTopicKey[]).map((key) => {
              const item = SHARE_TOPICS[key];
              const isSelected = activeTopic === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTopic(key)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 border-yellow-300 shadow-md font-black scale-[1.01]'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span className="truncate">{item.badge.replace(/^[^\s]+\s*/, '')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            MAIN BODY: 2 COLUMNS (ATTRACTIVE CARD PREVIEW + 1-CLICK SHARE CHANNELS)
            ===================================================================== */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* =================================================================
              LEFT COLUMN: ULTRA-ATTRACTIVE SHARE CARD PREVIEW (5 Cols)
              ================================================================= */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>आकर्षक सोशल शेयर कार्ड (Live Share Card Look):</span>
              </span>
              <span className="text-[11px] font-mono text-amber-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-amber-500/30">
                1080p HD
              </span>
            </div>

            {/* THE ATTRACTION CARD (Captured into ultra HD PNG) */}
            <div
              ref={shareCardRef}
              id="jjf-promotional-share-card"
              className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-[#8B0000] ring-2 ring-amber-400/80 text-white text-center select-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 30%, #8A0000 0%, #580000 45%, #300000 85%, #150000 100%)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 25px rgba(212, 175, 55, 0.25)'
              }}
            >
              {/* Subtle Gold Filigree Inset Frame */}
              <div
                className="absolute inset-2 sm:inset-3 rounded-2xl pointer-events-none"
                style={{
                  border: '2px double rgba(212, 175, 55, 0.85)',
                  outline: '1px dashed rgba(212, 175, 55, 0.45)',
                  outlineOffset: '-6px'
                }}
              />

              {/* Decorative Subtle Corner Lotuses/Ornaments */}
              <div className="absolute top-4 left-4 text-amber-400 text-xs opacity-75 pointer-events-none">✦</div>
              <div className="absolute top-4 right-4 text-amber-400 text-xs opacity-75 pointer-events-none">✦</div>
              <div className="absolute bottom-4 left-4 text-amber-400 text-xs opacity-75 pointer-events-none">✦</div>
              <div className="absolute bottom-4 right-4 text-amber-400 text-xs opacity-75 pointer-events-none">✦</div>

              <div className="relative z-10 p-5 sm:p-6 space-y-4 flex flex-col items-center justify-between">
                {/* National Service Top Banner */}
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-md">
                    <span>🇮🇳 राष्ट्र सेवा सर्वोपरि • सत्यमेव जयते 🇮🇳</span>
                  </div>
                  <div className="text-[10px] text-amber-200/90 font-mono tracking-wide">
                    नीति आयोग (भारत सरकार) UID: UP/2018/0207700
                  </div>
                </div>

                {/* 3D Gold Logo Centerpiece with Double Gold Rings */}
                <div className="relative my-1">
                  <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 opacity-60 blur-xs animate-pulse" />
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-950 p-1.5 border-2 border-amber-300 shadow-2xl flex items-center justify-center">
                    <BrandLogo size={80} className="drop-shadow-md" />
                  </div>
                </div>

                {/* Main Brand Typography */}
                <div className="space-y-1">
                  <h3
                    className="text-xl sm:text-2xl lg:text-3xl font-black font-serif text-white tracking-wide"
                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 12px rgba(255, 215, 0, 0.4)' }}
                  >
                    जीवन ज्योति फाउंडेशन
                  </h3>
                  <div className="text-xs sm:text-sm font-bold text-amber-300 tracking-wider">
                    ग़ाज़ीपुर, उत्तर प्रदेश • स्थापना वर्ष 2018
                  </div>
                </div>

                {/* Golden Ribbon Separator */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

                {/* 4 Pillars Badge Grid */}
                <div className="grid grid-cols-2 gap-2 w-full max-w-sm text-center">
                  <div className="p-2 rounded-xl bg-black/45 border border-amber-400/40 text-[11px] font-black text-amber-200 flex items-center justify-center gap-1.5 shadow-xs">
                    <span>📚</span>
                    <span>निःशुल्क बाल शिक्षा</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/45 border border-amber-400/40 text-[11px] font-black text-amber-200 flex items-center justify-center gap-1.5 shadow-xs">
                    <span>🍲</span>
                    <span>अन्नपूर्णा भोजन सेवा</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/45 border border-amber-400/40 text-[11px] font-black text-amber-200 flex items-center justify-center gap-1.5 shadow-xs">
                    <span>🩺</span>
                    <span>चिकित्सा राहत शिविर</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/45 border border-amber-400/40 text-[11px] font-black text-amber-200 flex items-center justify-center gap-1.5 shadow-xs">
                    <span>🌳</span>
                    <span>पर्यावरण व जल रक्षा</span>
                  </div>
                </div>

                {/* Key Digital Features Strip */}
                <div className="w-full bg-gradient-to-r from-black/60 via-amber-950/70 to-black/60 rounded-xl p-2.5 border border-amber-400/40 text-[11px] sm:text-xs text-amber-100 font-bold space-y-1">
                  <div className="text-amber-300 font-black">
                    ✨ डिजिटल ऐप की प्रमुख सुविधाएं:
                  </div>
                  <div>• 🎨 सुविचार एवं फोटो पोस्टर जनरेटर स्टूडियो</div>
                  <div>• 📜 डिजिटल स्वयंसेवक व दान प्रमाण पत्र सत्यापन</div>
                </div>

                {/* QR Code & Scan Strip */}
                <div className="flex items-center justify-between gap-3 w-full max-w-sm pt-2 border-t border-amber-400/30">
                  <div className="text-left text-[10px] space-y-0.5">
                    <div className="font-black text-amber-300">📲 सीधे ऐप पर जाएं:</div>
                    <div className="text-slate-300 font-mono text-[9px]">jeevanjyotifoundation.org</div>
                    <div className="text-amber-200/90 font-medium">कैमरे से स्कैन करें व जुड़ें</div>
                  </div>

                  <div className="p-1.5 bg-white rounded-xl shadow-md border border-amber-400 shrink-0">
                    <QRCodeSVG
                      value={appUrl}
                      size={54}
                      level="M"
                      fgColor="#8B0000"
                      bgColor="#FFFFFF"
                    />
                  </div>
                </div>

                {/* Contact Ribbon */}
                <div className="text-[9px] text-amber-200/80 font-mono pt-1">
                  📞 +91 8052361666 • ✉️ jeevanjyotifoundationgzp@gmail.com
                </div>
              </div>
            </div>

            {/* Download and Copy Buttons for this Share Card */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadSharePoster}
                disabled={isDownloadingCard}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75 border border-amber-300"
                title="इस आकर्षक शेयर पोस्टर को 1080p Ultra HD PNG में डाउनलोड करें"
              >
                {isDownloadingCard ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                    <span>तैयार हो रहा है...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>📥 HD पोस्टर डाउनलोड</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">लिंक कॉपी हुआ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>🔗 लिंक कॉपी करें</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* =================================================================
              RIGHT COLUMN: 1-CLICK DIRECT SOCIAL MEDIA CHANNELS (7 Cols)
              ================================================================= */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>सीधे सोशल मीडिया पर शेयर करें (1-Click Direct Share):</span>
              </div>
              <p className="text-xs text-slate-300">
                नीचे दिए गए किसी भी बटन पर क्लिक कर अपने मित्रों, पारिवारिक समूहों व सोशल मीडिया पर तुरंत साझा करें:
              </p>
            </div>

            {/* PRIMARY: WHATSAPP DIRECT SHARE (HIGH PRIORITY) */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black text-sm shadow-xl transition-all flex items-center justify-between cursor-pointer border border-emerald-400 hover:scale-[1.01] active:scale-[0.99] group"
              title="WhatsApp पर तुरंत शेयर करें"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                </div>
                <div className="text-left">
                  <div className="font-black text-sm sm:text-base">WhatsApp पर शेयर करें</div>
                  <div className="text-[11px] text-emerald-100 font-normal">चैट, स्टेटस और फैमिली ग्रुप में तुरंत भेजें</div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-white text-emerald-900 font-black text-xs shadow-xs group-hover:bg-amber-300 transition">
                भेजें →
              </span>
            </button>

            {/* OTHER POPULAR SOCIAL PLATFORMS GRID */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Facebook */}
              <button
                type="button"
                onClick={handleShareFacebook}
                className="py-3 px-3.5 rounded-xl bg-[#1877F2] hover:bg-[#1565C0] text-white font-bold text-xs shadow-md transition flex items-center gap-2.5 cursor-pointer border border-blue-400/40"
              >
                <Facebook className="w-4 h-4 fill-white" />
                <div className="text-left">
                  <div className="font-bold">Facebook</div>
                  <div className="text-[10px] text-blue-100">टाइमलाइन व ग्रुप</div>
                </div>
              </button>

              {/* Twitter / X */}
              <button
                type="button"
                onClick={handleShareTwitter}
                className="py-3 px-3.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition flex items-center gap-2.5 cursor-pointer border border-slate-700"
              >
                <Twitter className="w-4 h-4 text-sky-400 fill-sky-400" />
                <div className="text-left">
                  <div className="font-bold">X (Twitter)</div>
                  <div className="text-[10px] text-slate-400">ट्वीट साझा करें</div>
                </div>
              </button>

              {/* Telegram */}
              <button
                type="button"
                onClick={handleShareTelegram}
                className="py-3 px-3.5 rounded-xl bg-[#229ED9] hover:bg-[#1E88E5] text-white font-bold text-xs shadow-md transition flex items-center gap-2.5 cursor-pointer border border-sky-300/40"
              >
                <Send className="w-4 h-4 text-white" />
                <div className="text-left">
                  <div className="font-bold">Telegram</div>
                  <div className="text-[10px] text-sky-100">चैनल व ग्रुप</div>
                </div>
              </button>

              {/* Instagram Story / Post */}
              <button
                type="button"
                onClick={handleShareInstagram}
                className="py-3 px-3.5 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white font-bold text-xs shadow-md transition flex items-center gap-2.5 cursor-pointer border border-pink-400/40"
              >
                <Instagram className="w-4 h-4 text-white" />
                <div className="text-left">
                  <div className="font-bold">Instagram</div>
                  <div className="text-[10px] text-pink-100">स्टोरी व पोस्ट</div>
                </div>
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                onClick={handleShareLinkedIn}
                className="py-3 px-3.5 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold text-xs shadow-md transition flex items-center gap-2.5 cursor-pointer border border-blue-400/40"
              >
                <Linkedin className="w-4 h-4 fill-white" />
                <div className="text-left">
                  <div className="font-bold">LinkedIn</div>
                  <div className="text-[10px] text-blue-100">प्रोफेशनल नेटवर्क</div>
                </div>
              </button>

              {/* Native Mobile Share Sheet */}
              <button
                type="button"
                onClick={handleNativeShare}
                className="py-3 px-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2.5 cursor-pointer border border-amber-400"
              >
                <Share2 className="w-4 h-4 text-white" />
                <div className="text-left">
                  <div className="font-bold">सभी ऐप्स (All)</div>
                  <div className="text-[10px] text-amber-100">मोबाइल शेयर मेनू</div>
                </div>
              </button>
            </div>

            {/* PRE-CRAFTED MESSAGE PREVIEW BOX */}
            <div className="p-3.5 rounded-2xl bg-black/50 border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>साझा होने वाला हिंदी संदेश (Message Copy):</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedText ? 'कॉपी हो गया' : 'टेक्स्ट कॉपी करें'}</span>
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 max-h-28 overflow-y-auto font-mono whitespace-pre-wrap leading-relaxed select-text scrollbar-thin">
                {shareText}
              </div>
            </div>

            {/* DIRECT APP LINK COPY CARD */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center justify-between gap-2 shadow-xs">
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-slate-400">सीधा वेबसाइट / ऐप लिंक:</div>
                <div className="text-xs font-mono font-bold text-amber-300 truncate">{appUrl}</div>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-xs transition"
              >
                {copiedLink ? '✓ कॉपी हुआ' : 'कॉपी करें'}
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================================
            FOOTER HELP
            ===================================================================== */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span>आपके एक शेयर से किसी जरूरतमंद बच्चे की शिक्षा व भोजन में सहयोग मिल सकता है।</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer text-xs"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppSocialShareModal;
