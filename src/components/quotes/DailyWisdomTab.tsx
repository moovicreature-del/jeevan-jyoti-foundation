// ============================================================================
// JEEVAN JYOTI FOUNDATION - DAILY WISDOM (दैनिक प्रज्ञा) TAB
// दैनिक प्रेरणादायक उद्धरण एवं कस्टमाइजेबल बैकग्राउंड फोटो चयन
// ============================================================================

import React, { useState, useMemo, useRef } from 'react';
import {
  Calendar,
  Sparkles,
  Image as ImageIcon,
  Upload,
  Check,
  RotateCcw,
  Sliders,
  Eye,
  ArrowRight,
  Sun,
  Shuffle,
  Quote,
  Layers,
  Heart,
  BookOpen,
  Compass,
  Smile,
  Shield,
  Trash2,
  Download,
  Share2,
  MessageCircle,
  Copy,
  Loader2
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { QRCodeCanvas } from 'qrcode.react';
import { PosterAppOpenQR } from '../common/PosterAppOpenQR';
import { compressImageToSafeDataUrl } from '../../utils/imageOptimizer';
import toast from 'react-hot-toast';

export interface DailyWisdomQuoteItem {
  dayOfMonth: number; // 1 to 31
  quoteHi: string;
  author: string;
  category: 'educational' | 'career' | 'devotional' | 'humanity' | 'life' | 'patriotism';
  categoryLabelHi: string;
  themeGraphic: 'education' | 'career' | 'devotional' | 'humanity' | 'life' | 'patriotism' | 'diya';
  suggestedBgIndex: number;
}

export interface WisdomBackgroundPreset {
  id: string;
  titleHi: string;
  category: string;
  url: string;
  badge: string;
  defaultDarkness: number; // 20 - 70%
  defaultBlur: number; // 0 - 8px
}

/**
 * 31 Curated Daily Wisdom Quotes (one for each day of the month)
 */
export const DAILY_WISDOM_QUOTES: DailyWisdomQuoteItem[] = [
  {
    dayOfMonth: 1,
    quoteHi: 'प्रत्येक नया दिन अपने साथ अनंत सम्भावनाएं और आशा की नई किरण लेकर आता है। अपने संकल्पों को कर्म में बदलें।',
    author: 'स्वामी विवेकानंद',
    category: 'career',
    categoryLabelHi: 'सफलता व संकल्प',
    themeGraphic: 'career',
    suggestedBgIndex: 0
  },
  {
    dayOfMonth: 2,
    quoteHi: 'शिक्षा का वास्तविक उद्देश्य केवल ज्ञान अर्जित करना नहीं, बल्कि चरित्र का निर्माण और संवेदनशील हृदय बनाना है।',
    author: 'रवींद्रनाथ टैगोर',
    category: 'educational',
    categoryLabelHi: 'शिक्षा एवं प्रज्ञा',
    themeGraphic: 'education',
    suggestedBgIndex: 6
  },
  {
    dayOfMonth: 3,
    quoteHi: 'जो दूसरों के जीवन में प्रकाश फैलाते हैं, उनका अपना जीवन कभी अंधकार में नहीं रह सकता।',
    author: 'महात्मा गांधी',
    category: 'humanity',
    categoryLabelHi: 'सेवा व करुणा',
    themeGraphic: 'humanity',
    suggestedBgIndex: 3
  },
  {
    dayOfMonth: 4,
    quoteHi: 'सपने वे नहीं होते जो हम सोते समय देखते हैं, सपने वे होते हैं जो हमें सोने नहीं देते।',
    author: 'डॉ. ए. पी. जे. अब्दुल कलाम',
    category: 'career',
    categoryLabelHi: 'युवा प्रेरणा',
    themeGraphic: 'career',
    suggestedBgIndex: 1
  },
  {
    dayOfMonth: 5,
    quoteHi: 'मन की शांति संसार की सबसे बड़ी संपदा है। जो अपने भीतर शांत है, वह हर परिस्थिति में विजयी है।',
    author: 'गौतम बुद्ध',
    category: 'life',
    categoryLabelHi: 'शांति व ध्यान',
    themeGraphic: 'life',
    suggestedBgIndex: 7
  },
  {
    dayOfMonth: 6,
    quoteHi: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। निष्काम भाव से किया गया कर्म ही आत्मा को परम आनंद देता है।',
    author: 'श्रीमद्भगवद्गीता',
    category: 'devotional',
    categoryLabelHi: 'श्रीमद्भगवद्गीता',
    themeGraphic: 'devotional',
    suggestedBgIndex: 4
  },
  {
    dayOfMonth: 7,
    quoteHi: 'सच्चा धर्म वही है जो मानव-मात्र के प्रति दया, प्रेम और निःस्वार्थ सेवा की भावना जगाए।',
    author: 'संत कबीर दास',
    category: 'humanity',
    categoryLabelHi: 'मानवता व धर्म',
    themeGraphic: 'humanity',
    suggestedBgIndex: 2
  },
  {
    dayOfMonth: 8,
    quoteHi: 'कठिन परिश्रम का कोई विकल्प नहीं होता। सफलता उसी की दासी बनती है जो पसीने से अपना इतिहास लिखता है।',
    author: 'सरदार वल्लभभाई पटेल',
    category: 'career',
    categoryLabelHi: 'परिश्रम व कर्म',
    themeGraphic: 'career',
    suggestedBgIndex: 1
  },
  {
    dayOfMonth: 9,
    quoteHi: 'जब तक जीना, तब तक सीखना। अनुभव ही जगत में सर्वश्रेष्ठ शिक्षक है।',
    author: 'स्वामी विवेकानंद',
    category: 'educational',
    categoryLabelHi: 'ज्ञान एवं साधना',
    themeGraphic: 'education',
    suggestedBgIndex: 6
  },
  {
    dayOfMonth: 10,
    quoteHi: 'यदि आप सूरज की तरह चमकना चाहते हैं, तो पहले सूरज की तरह जलना सीखिए।',
    author: 'डॉ. ए. पी. जे. अब्दुल कलाम',
    category: 'career',
    categoryLabelHi: 'संकल्प व तेज',
    themeGraphic: 'career',
    suggestedBgIndex: 0
  },
  {
    dayOfMonth: 11,
    quoteHi: 'परोपकाराय फलन्ति वृक्षाः परोपकाराय वहन्ति नद्यः। परोपकार ही मनुष्य जीवन की सार्थकता है।',
    author: 'संस्कृत सुभाषित',
    category: 'humanity',
    categoryLabelHi: 'परोपकार व सेवा',
    themeGraphic: 'humanity',
    suggestedBgIndex: 8
  },
  {
    dayOfMonth: 12,
    quoteHi: 'सत्य की राह कठिन हो सकती है, लेकिन उसकी मंजिल हमेशा अविचल और सुखद होती है।',
    author: 'राजा हरिश्चंद्र / सत्य प्रेरणा',
    category: 'life',
    categoryLabelHi: 'सत्य व निष्ठा',
    themeGraphic: 'life',
    suggestedBgIndex: 2
  },
  {
    dayOfMonth: 13,
    quoteHi: 'उठो, जागो और तब तक मत रुको जब तक कि लक्ष्य की प्राप्ति न हो जाए।',
    author: 'स्वामी विवेकानंद',
    category: 'career',
    categoryLabelHi: 'युवा शक्ति',
    themeGraphic: 'career',
    suggestedBgIndex: 1
  },
  {
    dayOfMonth: 14,
    quoteHi: 'देश की सेवा ही सच्ची ईश्वर सेवा है। राष्ट्र के प्रति समर्पण प्रत्येक नागरिक का प्रथम कर्तव्य है।',
    author: 'सुभाष चंद्र बोस',
    category: 'patriotism',
    categoryLabelHi: 'राष्ट्रभक्ति',
    themeGraphic: 'patriotism',
    suggestedBgIndex: 0
  },
  {
    dayOfMonth: 15,
    quoteHi: 'क्रोध पर शांति से, असत्य पर सत्य से और कटुता पर प्रेम से विजय प्राप्त की जा सकती है।',
    author: 'महात्मा बुद्ध',
    category: 'life',
    categoryLabelHi: 'सद्भावना व शांति',
    themeGraphic: 'life',
    suggestedBgIndex: 7
  },
  {
    dayOfMonth: 16,
    quoteHi: 'विद्या ददाति विनयं विनयाद्याति पात्रताम्। विद्या से विनम्रता और विनम्रता से योग्यता आती है।',
    author: 'हितोपदेश',
    category: 'educational',
    categoryLabelHi: 'विद्या व संस्कार',
    themeGraphic: 'education',
    suggestedBgIndex: 6
  },
  {
    dayOfMonth: 17,
    quoteHi: 'दीपक स्वयं जलकर संसार को प्रकाश देता है; ऐसे ही निस्वार्थ कर्मवीर समाज का मार्गदर्शन करते हैं।',
    author: 'जीवन ज्योति विचार',
    category: 'humanity',
    categoryLabelHi: 'सेवा ज्योति',
    themeGraphic: 'diya',
    suggestedBgIndex: 5
  },
  {
    dayOfMonth: 18,
    quoteHi: 'धैर्य और विश्वास दो ऐसे शस्त्र हैं जो जीवन के सबसे घने अंधकार को भी चीरने की शक्ति रखते हैं।',
    author: 'श्रीमद्भगवद्गीता',
    category: 'devotional',
    categoryLabelHi: 'आत्मबल व धैर्य',
    themeGraphic: 'devotional',
    suggestedBgIndex: 4
  },
  {
    dayOfMonth: 19,
    quoteHi: 'जीवन लम्बा होने के बजाय महान होना चाहिए। सेवा और सरोकार से ही जीवन धन्य होता है।',
    author: 'डॉ. बी. आर. आंबेडकर',
    category: 'career',
    categoryLabelHi: 'महानता व विचार',
    themeGraphic: 'career',
    suggestedBgIndex: 1
  },
  {
    dayOfMonth: 20,
    quoteHi: 'जो अन्नदाता का सम्मान करते हैं और भूखे को भोजन देते हैं, उन पर माँ अन्नपूर्णा की कृपा सदैव बनी रहती है।',
    author: 'अन्नपूर्णा सेवा संदेश',
    category: 'humanity',
    categoryLabelHi: 'अन्नपूर्णा सेवा',
    themeGraphic: 'humanity',
    suggestedBgIndex: 3
  },
  {
    dayOfMonth: 21,
    quoteHi: 'प्रकृति हमारी माँ है, वृक्षारोपण और पर्यावरण रक्षा से ही भावी पीढ़ी का जीवन सुरक्षित होगा।',
    author: 'पर्यावरण चेतना',
    category: 'life',
    categoryLabelHi: 'प्रकृति व पर्यावरण',
    themeGraphic: 'life',
    suggestedBgIndex: 8
  },
  {
    dayOfMonth: 22,
    quoteHi: 'विश्वास वह प्रकाश है जो उस समय भी मार्ग दिखाता है जब चारों ओर घना कोहरा छाया हो।',
    author: 'रवींद्रनाथ टैगोर',
    category: 'educational',
    categoryLabelHi: 'आत्मविश्वास',
    themeGraphic: 'education',
    suggestedBgIndex: 0
  },
  {
    dayOfMonth: 23,
    quoteHi: 'मातृ-पितृ सेवा से बढ़कर संसार में कोई तीर्थ नहीं। बड़ों का आशीर्वाद ही समस्त संकटों का ढाल है।',
    author: 'भारतीय संस्कृति',
    category: 'humanity',
    categoryLabelHi: 'संस्कार व परिवार',
    themeGraphic: 'humanity',
    suggestedBgIndex: 4
  },
  {
    dayOfMonth: 24,
    quoteHi: 'हौसले जिनके ऊँचे होते हैं, इम्तिहान भी उनके कड़े होते हैं। कठिन रास्ते ही शानदार मंजिलों तक ले जाते हैं।',
    author: 'प्रेरणा पुंज',
    category: 'career',
    categoryLabelHi: 'उत्साह व विजय',
    themeGraphic: 'career',
    suggestedBgIndex: 1
  },
  {
    dayOfMonth: 25,
    quoteHi: 'परोपकार के बिना जीवन व्यर्थ है। किसी का सहारा बनना ही मानव होने का सबसे बड़ा प्रमाण है।',
    author: 'मदर टेरेसा',
    category: 'humanity',
    categoryLabelHi: 'करुणा व सहायता',
    themeGraphic: 'humanity',
    suggestedBgIndex: 10
  },
  {
    dayOfMonth: 26,
    quoteHi: 'हमारा देश केवल भू-भाग नहीं, बल्कि कोटि-कोटि देशवासियों का पावन स्पंदन है। राष्ट्र प्रथम!',
    author: 'शहीद भगत सिंह',
    category: 'patriotism',
    categoryLabelHi: 'राष्ट्र प्रथम',
    themeGraphic: 'patriotism',
    suggestedBgIndex: 0
  },
  {
    dayOfMonth: 27,
    quoteHi: 'सकारात्मक सोच और निरंतर प्रयास से असंभव दिखने वाला कार्य भी संभव हो जाता है।',
    author: 'चाणक्य नीति',
    category: 'career',
    categoryLabelHi: 'कर्म नीति',
    themeGraphic: 'career',
    suggestedBgIndex: 1
  },
  {
    dayOfMonth: 28,
    quoteHi: 'अहिंसा परमो धर्मः। प्रेम और क्षमा से बड़ा कोई अस्त्र इस संसार में नहीं है।',
    author: 'भगवान महावीर',
    category: 'life',
    categoryLabelHi: 'अहिंसा व सद्भाव',
    themeGraphic: 'life',
    suggestedBgIndex: 7
  },
  {
    dayOfMonth: 29,
    quoteHi: 'स्वास्थ्य ही सबसे बड़ा धन है और संतोष सबसे बड़ा सुख। योग व संयम से जीवन निरोगी बनता है।',
    author: 'महर्षि पतंजलि',
    category: 'life',
    categoryLabelHi: 'स्वास्थ्य व आरोग्य',
    themeGraphic: 'life',
    suggestedBgIndex: 11
  },
  {
    dayOfMonth: 30,
    quoteHi: 'दूसरों की सेवा में स्वयं को खो देना ही अपने जीवन को सार्थक बनाने का सबसे सरल मार्ग है।',
    author: 'महात्मा गांधी',
    category: 'humanity',
    categoryLabelHi: 'सेवा साधना',
    themeGraphic: 'humanity',
    suggestedBgIndex: 3
  },
  {
    dayOfMonth: 31,
    quoteHi: 'तमसो मा ज्योतिर्गमय। अज्ञान के अंधकार से ज्ञान के प्रकाश की ओर अग्रसर होना ही जीवन है।',
    author: 'बृहदारण्यक उपनिषद्',
    category: 'devotional',
    categoryLabelHi: 'वैदिक प्रकाश',
    themeGraphic: 'diya',
    suggestedBgIndex: 5
  }
];

/**
 * 12 Curated Aesthetic High-Resolution Background Presets
 */
export const WISDOM_BACKGROUND_PRESETS: WisdomBackgroundPreset[] = [
  {
    id: 'bg-golden-sunrise',
    titleHi: 'स्वर्णिम सूर्योदय व प्रभात रश्मियां',
    category: 'nature',
    badge: '🌅 प्रभात प्रकाश',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    defaultDarkness: 45,
    defaultBlur: 0
  },
  {
    id: 'bg-himalayan-peaks',
    titleHi: 'हिमालय पावन पर्वत शिखर',
    category: 'spiritual',
    badge: '🏔️ विजय शिखर',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    defaultDarkness: 50,
    defaultBlur: 0
  },
  {
    id: 'bg-ganges-waters',
    titleHi: 'पवित्र गंगा तट व शांत जलधारा',
    category: 'spiritual',
    badge: '🌊 निर्मल गंगा',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    defaultDarkness: 45,
    defaultBlur: 0
  },
  {
    id: 'bg-ghazipur-rural-field',
    titleHi: 'गाजीपुर ग्रामीण सेवा व हरियाली',
    category: 'seva',
    badge: '🌾 गाजीपुर सेवा',
    url: '/uploads/jjf_media_1793250700283_83f32964.jpg',
    defaultDarkness: 55,
    defaultBlur: 1
  },
  {
    id: 'bg-sacred-temple',
    titleHi: 'प्राचीन भारतीय पावन मंदिर',
    category: 'spiritual',
    badge: '🏛️ पावन धरोहर',
    url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&auto=format&fit=crop&q=80',
    defaultDarkness: 55,
    defaultBlur: 0
  },
  {
    id: 'bg-festive-diya-bokeh',
    titleHi: 'दीप प्रज्ज्वलन व स्वर्णिम बोकेह',
    category: 'festive',
    badge: '🪔 स्वर्णिम दीप',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&auto=format&fit=crop&q=80',
    defaultDarkness: 40,
    defaultBlur: 0
  },
  {
    id: 'bg-wisdom-library',
    titleHi: 'ज्ञान दीप, पुस्तक व शांत कक्ष',
    category: 'education',
    badge: '📖 ज्ञान कक्ष',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&auto=format&fit=crop&q=80',
    defaultDarkness: 55,
    defaultBlur: 1
  },
  {
    id: 'bg-peaceful-lotus',
    titleHi: 'पवित्र सहस्रार कमल पुष्प',
    category: 'nature',
    badge: '🌸 शांत कमल',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&auto=format&fit=crop&q=80',
    defaultDarkness: 50,
    defaultBlur: 0
  },
  {
    id: 'bg-banyan-tree',
    titleHi: 'विशाल वटवृक्ष व शांत प्रकृति',
    category: 'nature',
    badge: '🌳 वटवृक्ष छाया',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
    defaultDarkness: 50,
    defaultBlur: 0
  },
  {
    id: 'bg-cosmic-night',
    titleHi: 'तारों भरा शांत ब्रह्मांडीय आकाश',
    category: 'spiritual',
    badge: '🌌 अनंत आकाश',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80',
    defaultDarkness: 35,
    defaultBlur: 0
  },
  {
    id: 'bg-ghazipur-relief-action',
    titleHi: 'गाजीपुर राहत वितरण सेवा अभियान',
    category: 'seva',
    badge: '🤝 धरातलीय सेवा',
    url: '/uploads/jjf_media_1793250697644_9b7cd9be.jpg',
    defaultDarkness: 55,
    defaultBlur: 1
  },
  {
    id: 'bg-meditation-haven',
    titleHi: 'साधना, ध्यान व शांति कुटीर',
    category: 'spiritual',
    badge: '🧘 साधना कुटीर',
    url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1200&auto=format&fit=crop&q=80',
    defaultDarkness: 50,
    defaultBlur: 0
  }
];

interface DailyWisdomTabProps {
  onSelectQuote: (quote: string, author: string, category?: string, themeGraphic?: string) => void;
  onApplyBackground: (photoUrl: string, darkness: number, blur: number) => void;
  currentBgPhoto?: string;
  currentBgDarkness?: number;
  currentBgBlur?: number;
  onSwitchToPoster: () => void;
  onDownloadOfficialPoster?: (quote: string, author: string, bgUrl: string, darkness: number, blur: number) => Promise<void>;
}

export const DailyWisdomTab: React.FC<DailyWisdomTabProps> = ({
  onSelectQuote,
  onApplyBackground,
  currentBgPhoto = '',
  currentBgDarkness = 45,
  currentBgBlur = 0,
  onSwitchToPoster,
  onDownloadOfficialPoster
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewCardRef = useRef<HTMLDivElement | null>(null);

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  // Today's date calculations
  const today = new Date();
  const todayDayOfMonth = today.getDate(); // 1 to 31
  const todayDateStr = today.toLocaleDateString('hi-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Selected Day & Quote State
  const [selectedDay, setSelectedDay] = useState<number>(todayDayOfMonth);
  const activeDailyQuote = useMemo(() => {
    return (
      DAILY_WISDOM_QUOTES.find((q) => q.dayOfMonth === selectedDay) ||
      DAILY_WISDOM_QUOTES[0]
    );
  }, [selectedDay]);

  // Category filter for quote list
  const [quoteCategoryFilter, setQuoteCategoryFilter] = useState<string>('all');
  const filteredQuotes = useMemo(() => {
    if (quoteCategoryFilter === 'all') return DAILY_WISDOM_QUOTES;
    return DAILY_WISDOM_QUOTES.filter((q) => q.category === quoteCategoryFilter);
  }, [quoteCategoryFilter]);

  // Background Photo State
  const [selectedBgUrl, setSelectedBgUrl] = useState<string>(
    currentBgPhoto || WISDOM_BACKGROUND_PRESETS[0].url
  );
  const [bgDarkness, setBgDarkness] = useState<number>(currentBgDarkness);
  const [bgBlur, setBgBlur] = useState<number>(currentBgBlur);
  const [isCustomUploaded, setIsCustomUploaded] = useState<boolean>(false);
  const [bgCategoryFilter, setBgCategoryFilter] = useState<string>('all');

  const filteredBgPresets = useMemo(() => {
    if (bgCategoryFilter === 'all') return WISDOM_BACKGROUND_PRESETS;
    return WISDOM_BACKGROUND_PRESETS.filter((b) => b.category === bgCategoryFilter);
  }, [bgCategoryFilter]);

  // Handle Photo Upload from user's device
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('कृपया केवल इमेज फ़ाइल (JPG, PNG, WebP) चुनें।');
      return;
    }

    const toastId = toast.loading('फ़ोटो संपीड़ित व लोड की जा रही है...');
    try {
      // Compress to high-res safe data URL (1400px width, 82% quality)
      const dataUrl = await compressImageToSafeDataUrl(file, 1400, 0.82);
      setSelectedBgUrl(dataUrl);
      setIsCustomUploaded(true);
      toast.dismiss(toastId);
      toast.success('आपकी कस्टम बैकग्राउंड फ़ोटो लोड हो गई है!', { icon: '🖼️' });
    } catch (err) {
      console.error('Photo upload error:', err);
      toast.dismiss(toastId);
      toast.error('फ़ोटो लोड करने में समस्या आई। कृपया पुनः प्रयास करें।');
    }
  };

  // 1-Click Load Quote into Poster
  const handleApplyQuoteToPoster = (quoteItem: DailyWisdomQuoteItem) => {
    onSelectQuote(
      quoteItem.quoteHi,
      quoteItem.author,
      quoteItem.category,
      quoteItem.themeGraphic
    );
    toast.success(`"${quoteItem.author}" का विचार पोस्टर में लोड हो गया!`, {
      icon: '✨'
    });
  };

  // 1-Click Apply Background to Poster
  const handleApplyBgToPoster = () => {
    onApplyBackground(selectedBgUrl, bgDarkness, bgBlur);
    toast.success('बैकग्राउंड फ़ोटो सफलतापूर्वक पोस्टर में सेट हो गई!', {
      icon: '🎨'
    });
  };

  // 1-Click Shuffle Random Quote
  const handleShuffleQuote = () => {
    const randomDay = Math.floor(Math.random() * 31) + 1;
    setSelectedDay(randomDay);
    const item = DAILY_WISDOM_QUOTES.find((q) => q.dayOfMonth === randomDay);
    if (item) {
      toast.success(`दिन #${randomDay} का विचार प्रस्तुत है!`, { icon: '🎲' });
    }
  };

  // Remove Custom Background
  const handleRemoveBackground = () => {
    setSelectedBgUrl('');
    onApplyBackground('', 45, 0);
    toast.success('कस्टम बैकग्राउंड हटाया गया। आधिकारिक महरून बैकग्राउंड सक्रिय है।', {
      icon: '🔄'
    });
  };

  // Dedicated HTML5 Canvas 2D Poster Generator for Daily Wisdom (Guaranteed 0% Cutting)
  const renderDailyWisdomPosterCanvas = async (): Promise<{ dataUrl: string; blob: Blob; fileName: string }> => {
    const width = 1080;
    const height = 1560;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create canvas context');

    // 1. Draw Background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#5a0000');
    bgGrad.addColorStop(0.5, '#3a0000');
    bgGrad.addColorStop(1, '#1a0000');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // If selectedBgUrl exists, draw it with cover fit without distorting faces
    if (selectedBgUrl) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve(); // continue if image blocked
          img.src = selectedBgUrl;
        });

        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          ctx.save();
          if (bgBlur > 0) {
            ctx.filter = `blur(${bgBlur * 2.2}px)`;
          }
          const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
          const dw = img.naturalWidth * scale;
          const dh = img.naturalHeight * scale;
          const dx = (width - dw) / 2;
          const dy = (height - dh) / 2;
          ctx.drawImage(img, dx, dy, dw, dh);
          ctx.restore();
        }
      } catch (e) {
        console.warn('Canvas image draw error', e);
      }
    }

    // 2. Darkness & Contrast Vignette Overlay
    const overlayGrad = ctx.createLinearGradient(0, 0, 0, height);
    overlayGrad.addColorStop(0, 'rgba(30, 0, 0, 0.74)');
    overlayGrad.addColorStop(0.36, `rgba(0, 0, 0, ${bgDarkness / 100})`);
    overlayGrad.addColorStop(0.72, `rgba(0, 0, 0, ${Math.min(0.92, (bgDarkness / 100) + 0.12)})`);
    overlayGrad.addColorStop(1, 'rgba(15, 0, 0, 0.95)');
    ctx.fillStyle = overlayGrad;
    ctx.fillRect(0, 0, width, height);

    // 3. Official Multi-Tier Royal Crimson & Gold Border
    const margin = 28;
    const borderWidth = 18;
    ctx.save();
    // Outer Deep Crimson
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    // Outer & Inner Gold Highlights
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.strokeRect(margin - borderWidth / 2, margin - borderWidth / 2, width - (margin - borderWidth / 2) * 2, height - (margin - borderWidth / 2) * 2);
    ctx.strokeRect(margin + borderWidth / 2, margin + borderWidth / 2, width - (margin + borderWidth / 2) * 2, height - (margin + borderWidth / 2) * 2);

    // Inner Inset Dashed Frame
    const insetMargin = margin + borderWidth + 16;
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([10, 6]);
    ctx.strokeRect(insetMargin, insetMargin, width - insetMargin * 2, height - insetMargin * 2);
    ctx.setLineDash([]);
    ctx.restore();

    // 4. Header: Top Pill + Foundation Name
    const headerY = insetMargin + 48;
    const badgeText = `🌅 दैनिक प्रज्ञा • दिन #${activeDailyQuote.dayOfMonth} / 31`;
    ctx.font = 'bold 24px "Noto Sans Devanagari", sans-serif';
    const badgeMetrics = ctx.measureText(badgeText);
    const badgeW = badgeMetrics.width + 48;
    const badgeH = 46;
    const badgeX = (width - badgeW) / 2;

    const pillGrad = ctx.createLinearGradient(badgeX, headerY, badgeX + badgeW, headerY);
    pillGrad.addColorStop(0, '#f59e0b');
    pillGrad.addColorStop(0.5, '#fbbf24');
    pillGrad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = pillGrad;
    ctx.beginPath();
    ctx.roundRect(badgeX, headerY, badgeW, badgeH, 23);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, width / 2, headerY + badgeH / 2);

    // Foundation Name
    const titleY = headerY + badgeH + 46;
    ctx.font = '900 48px "Cinzel", "Noto Serif Devanagari", serif';
    ctx.fillStyle = '#FFE082';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.fillText('जीवन ज्योति फाउंडेशन', width / 2, titleY);

    // Subtitle
    ctx.font = 'bold 22px "Noto Sans Devanagari", sans-serif';
    ctx.fillStyle = '#FDE68A';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    ctx.fillText('ग़ाज़ीपुर (उत्तर प्रदेश) • स्थापना 2018', width / 2, titleY + 40);

    // Golden separator line
    const sepY = titleY + 70;
    const sepGrad = ctx.createLinearGradient(width * 0.2, sepY, width * 0.8, sepY);
    sepGrad.addColorStop(0, 'transparent');
    sepGrad.addColorStop(0.5, '#D4AF37');
    sepGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = sepGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.2, sepY);
    ctx.lineTo(width * 0.8, sepY);
    ctx.stroke();

    // 5. Quote Box in Center
    ctx.font = '900 70px serif';
    ctx.fillStyle = '#FBBF24';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.fillText('“', width / 2, sepY + 74);

    // Measure & Word-wrap Quote Text cleanly
    const quoteMaxWidth = width - insetMargin * 2 - 120;
    const quoteWords = activeDailyQuote.quoteHi.split(/\s+/);
    const quoteLines: string[] = [];
    let currentLine = '';
    const quoteFontSize = quoteWords.length > 25 ? 36 : 42;
    ctx.font = `bold ${quoteFontSize}px "Noto Serif Devanagari", "Mukta", serif`;

    for (const word of quoteWords) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > quoteMaxWidth && currentLine) {
        quoteLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) quoteLines.push(currentLine);

    const quoteLineHeight = quoteFontSize * 1.55;
    const totalQuoteHeight = quoteLines.length * quoteLineHeight;
    const startQuoteY = sepY + 130;

    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 4;
    for (let i = 0; i < quoteLines.length; i++) {
      ctx.fillText(quoteLines[i], width / 2, startQuoteY + i * quoteLineHeight);
    }

    // Author badge pill
    const authorY = startQuoteY + totalQuoteHeight + 45;
    const authorText = `— ${activeDailyQuote.author}`;
    ctx.font = 'bold 28px "Noto Sans Devanagari", sans-serif';
    const authorMetrics = ctx.measureText(authorText);
    const authorW = authorMetrics.width + 56;
    const authorH = 50;
    const authorX = (width - authorW) / 2;

    ctx.shadowBlur = 8;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.beginPath();
    ctx.roundRect(authorX, authorY, authorW, authorH, 25);
    ctx.fill();

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.fillStyle = '#FDE68A';
    ctx.shadowBlur = 4;
    ctx.fillText(authorText, width / 2, authorY + authorH / 2 + 1);

    // 6. Bottom Footer Ribbon
    const footerY = height - insetMargin - 75;
    const footerSepY = footerY - 25;

    // 5.5. Official App Open QR Code Plaque on Canvas
    const qrCanvas = document.getElementById('daily-wisdom-qr-canvas') as HTMLCanvasElement | null;
    if (qrCanvas) {
      const qrBoxW = 340;
      const qrBoxH = 92;
      const qrBoxX = (width - qrBoxW) / 2;
      const qrBoxY = footerSepY - qrBoxH - 18;

      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.78)';
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxW, qrBoxH, [16]);
      ctx.fill();
      ctx.stroke();

      // White QR backing
      const qrSize = 74;
      const qrX = qrBoxX + 9;
      const qrY = qrBoxY + 9;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(qrX, qrY, qrSize, qrSize, [8]);
      ctx.fill();

      // Draw QR Canvas
      ctx.drawImage(qrCanvas, qrX + 2, qrY + 2, qrSize - 4, qrSize - 4);

      // Text beside QR
      const textX = qrBoxX + qrSize + 16;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#FFE082';
      ctx.font = 'bold 18px "Noto Sans Devanagari", sans-serif';
      ctx.fillText('📲 ऐप खोलें (SCAN TO OPEN)', textX, qrBoxY + 32);

      ctx.fillStyle = '#FDE68A';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('🔗 https://jeevan-jyoti-foundation-7eso.vercel.app', textX, qrBoxY + 54);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px sans-serif';
      ctx.fillText('नीति आयोग मान्यता प्राप्त NGO • स्थापना 2018', textX, qrBoxY + 72);
      ctx.restore();
    }

    const fSepGrad = ctx.createLinearGradient(width * 0.15, footerSepY, width * 0.85, footerSepY);
    fSepGrad.addColorStop(0, 'transparent');
    fSepGrad.addColorStop(0.5, '#D4AF37');
    fSepGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = fSepGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.15, footerSepY);
    ctx.lineTo(width * 0.85, footerSepY);
    ctx.stroke();

    ctx.font = 'bold 26px "Noto Sans Devanagari", sans-serif';
    ctx.fillStyle = '#FCD34D';
    ctx.shadowBlur = 8;
    ctx.fillText('सेवा • शिक्षा • स्वास्थ्य', width / 2, footerY + 10);

    ctx.font = 'bold 19px monospace';
    ctx.fillStyle = '#E2E8F0';
    ctx.shadowBlur = 6;
    ctx.fillText('https://jeevan-jyoti-foundation-7eso.vercel.app', width / 2, footerY + 44);

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas blob failed'))), 'image/png', 1.0);
    });

    const safeAuthor = (activeDailyQuote.author || 'Quote').replace(/\s+/g, '_');
    const fileName = `JJF_Daily_Wisdom_${safeAuthor}_Day${activeDailyQuote.dayOfMonth}_${Date.now()}.png`;

    return { dataUrl, blob, fileName };
  };

  // Direct 1080p Ultra HD Poster Download from this attached section (Guaranteed 0% Cutting)
  const handleDirectDownload = async () => {
    setIsDownloading(true);
    const toastId = toast.loading('1080p Ultra HD पोस्टर तैयार हो रहा है...');
    try {
      let dataUrl: string;
      let fileName: string;

      try {
        const res = await renderDailyWisdomPosterCanvas();
        dataUrl = res.dataUrl;
        fileName = res.fileName;
      } catch (canvasErr) {
        console.warn('Canvas render fallback to toPng:', canvasErr);
        if (!previewCardRef.current) throw canvasErr;
        const node = previewCardRef.current;
        const scrollW = node.scrollWidth || 350;
        const scrollH = node.scrollHeight || 540;
        dataUrl = await toPng(node, {
          width: scrollW,
          height: scrollH,
          pixelRatio: 2.5,
          cacheBust: true,
          style: {
            transform: 'none',
            maxHeight: 'none',
            height: `${scrollH}px`,
            width: `${scrollW}px`,
            overflow: 'visible'
          }
        });
        const safeAuthor = (activeDailyQuote.author || 'Quote').replace(/\s+/g, '_');
        fileName = `JJF_Daily_Wisdom_${safeAuthor}_Day${activeDailyQuote.dayOfMonth}_${Date.now()}.png`;
      }

      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.dismiss(toastId);
      toast.success('🎉 HD पोस्टर बिना किसी कटिंग के पूरी स्पष्टता के साथ डाउनलोड हो गया!', {
        duration: 4500,
        icon: '📥'
      });
    } catch (err) {
      console.error('Direct download error:', err);
      toast.dismiss(toastId);
      toast.error('पोस्टर डाउनलोड में समस्या आई। पोस्टर एडिटर से डाउनलोड का प्रयास करें।');
    } finally {
      setIsDownloading(false);
    }
  };

  // Direct WhatsApp Share from this attached section (No Cutting)
  const handleDirectShareWhatsApp = async () => {
    setIsSharing(true);
    const toastId = toast.loading('WhatsApp शेयर तैयार हो रहा है...');
    try {
      let blob: Blob;
      let fileName: string;
      let dataUrl: string;

      try {
        const res = await renderDailyWisdomPosterCanvas();
        blob = res.blob;
        fileName = res.fileName;
        dataUrl = res.dataUrl;
      } catch (canvasErr) {
        console.warn('Canvas share fallback:', canvasErr);
        if (!previewCardRef.current) throw canvasErr;
        const node = previewCardRef.current;
        const scrollW = node.scrollWidth || 350;
        const scrollH = node.scrollHeight || 540;
        dataUrl = await toPng(node, {
          width: scrollW,
          height: scrollH,
          pixelRatio: 2.5,
          cacheBust: true,
          style: {
            transform: 'none',
            maxHeight: 'none',
            height: `${scrollH}px`,
            width: `${scrollW}px`,
            overflow: 'visible'
          }
        });
        const res = await fetch(dataUrl);
        blob = await res.blob();
        fileName = `JJF_Daily_Wisdom_${Date.now()}.png`;
      }

      const file = new File([blob], fileName, { type: 'image/png' });
      const shareText = `🌅 *दैनिक प्रज्ञा सुविचार (जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर)* 🌅\n\n"${activeDailyQuote.quoteHi}"\n\n— *${activeDailyQuote.author}*\n\nसेवा • शिक्षा • स्वास्थ्य अभियान ग़ाज़ीपुर\n🌐 https://jeevanjyotifoundation.org`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'दैनिक प्रज्ञा सुविचार - जीवन ज्योति फाउंडेशन',
            text: shareText,
            files: [file],
          });
          toast.dismiss(toastId);
          toast.success('WhatsApp पर सफलतापूर्वक साझा किया गया!', { icon: '🟢' });
          return;
        } catch (e: any) {
          if (e.name === 'AbortError') {
            toast.dismiss(toastId);
            return;
          }
        }
      }

      // Fallback: download file and open WhatsApp with quote text
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(waUrl, '_blank');

      toast.dismiss(toastId);
      toast.success('WhatsApp खुल रहा है! HD पोस्टर डाउनलोड हो गया है, इसे स्टेटस या चैट में शेयर करें।', {
        duration: 5000,
        icon: '🟢'
      });
    } catch (err) {
      console.error('WhatsApp share error:', err);
      toast.dismiss(toastId);
      toast.error('शेयर करने में समस्या आई।');
    } finally {
      setIsSharing(false);
    }
  };

  // Copy Poster Image to Clipboard (No Cutting)
  const handleCopyCardImage = async () => {
    const toastId = toast.loading('इमेज क्लिपबोर्ड में कॉपी हो रही है...');
    try {
      let blob: Blob;
      try {
        const res = await renderDailyWisdomPosterCanvas();
        blob = res.blob;
      } catch (canvasErr) {
        if (!previewCardRef.current) throw canvasErr;
        const node = previewCardRef.current;
        const scrollW = node.scrollWidth || 350;
        const scrollH = node.scrollHeight || 540;
        const dataUrl = await toPng(node, {
          width: scrollW,
          height: scrollH,
          pixelRatio: 2.5,
          cacheBust: true,
          style: {
            transform: 'none',
            maxHeight: 'none',
            height: `${scrollH}px`,
            width: `${scrollW}px`,
            overflow: 'visible'
          }
        });
        const res = await fetch(dataUrl);
        blob = await res.blob();
      }

      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        toast.dismiss(toastId);
        toast.success('📋 पूर्ण HD पोस्टर क्लिपबोर्ड में कॉपी हो गया! इसे WhatsApp Web या चैट में सीधे पेस्ट (Ctrl+V) करें।');
      } else {
        toast.dismiss(toastId);
        toast.error('क्लिपबोर्ड सपोर्ट नहीं है, डाउनलोड बटन का प्रयोग करें।');
      }
    } catch {
      toast.dismiss(toastId);
      toast.error('इमेज कॉपी करने में असमर्थ।');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* =====================================================================
          TOP HEADER: TODAY'S WISDOM HERO BANNER
          ===================================================================== */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 rounded-3xl p-5 sm:p-7 border-2 border-amber-500/60 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-500/30">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-xs">
                <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    दैनिक प्रज्ञा
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-200">
                    {todayDateStr}
                  </span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black font-serif text-white mt-0.5">
                  आज का पावन सुविचार (Today's Wisdom)
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleShuffleQuote}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer shadow-xs"
                title="कोई अन्य रैंडम विचार देखें"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>नया विचार लाएं</span>
              </button>

              <button
                type="button"
                onClick={() => handleApplyQuoteToPoster(activeDailyQuote)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer"
                title="इस विचार को सीधे पोस्टर में लोड करें"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>पोस्टर में लोड करें</span>
              </button>
            </div>
          </div>

          {/* Active Quote Content Box */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-amber-400/30 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-[11px]">
                {activeDailyQuote.categoryLabelHi}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                दिन #{activeDailyQuote.dayOfMonth} / 31
              </span>
            </div>

            <p className="text-base sm:text-xl lg:text-2xl font-serif font-black text-amber-100 leading-relaxed italic">
              "{activeDailyQuote.quoteHi}"
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs sm:text-sm font-bold text-amber-400 tracking-wide">
                — {activeDailyQuote.author}
              </span>
              <button
                type="button"
                onClick={() => {
                  handleApplyQuoteToPoster(activeDailyQuote);
                  onSwitchToPoster();
                }}
                className="text-xs font-bold text-amber-300 hover:text-white underline flex items-center gap-1 cursor-pointer"
              >
                <span>पोस्टर प्रीव्यू देखें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 2: CUSTOMIZABLE BACKGROUND PHOTO SELECTOR
          ===================================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-1">
              <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
              <span>कस्टमाइजेबल बैकग्राउंड फोटो</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
              पोस्टर के लिए बैकग्राउंड फोटो चुनें व कस्टमाइज़ करें
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              अपनी पसंद की खूबसूरत प्राकृतिक या सेवा फोटो लगाएं और डार्कनेस/ब्लर को सुविचार के अनुसार संतुलित करें।
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-[#8B0000] hover:bg-[#6b0000] text-white text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer"
              title="फोन या कंप्यूटर से अपनी मनपसंद फोटो अपलोड करें"
            >
              <Upload className="w-4 h-4 text-amber-300" />
              <span>📁 फोन/डिवाइस से फोटो चुनें</span>
            </button>

            {selectedBgUrl && (
              <button
                type="button"
                onClick={handleRemoveBackground}
                className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-bold transition flex items-center gap-1 border border-slate-300 cursor-pointer"
                title="कस्टम बैकग्राउंड हटाएं और डिफ़ॉल्ट महरून रखें"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">बैकग्राउंड हटाएं</span>
              </button>
            )}
          </div>
        </div>

        {/* ===================================================================
            LIVE BACKGROUND PREVIEW & CUSTOMIZATION SLIDERS
            =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Live Preview Box (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-600" />
                <span>बैकग्राउंड लाइव प्रीव्यू:</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                {isCustomUploaded ? 'कस्टम फ़ोटो' : 'लाइब्रेरी फ़ोटो'}
              </span>
            </div>

            <div
              ref={previewCardRef}
              id="daily-wisdom-live-card"
              className="relative w-full min-h-[520px] h-auto max-w-[350px] mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-[#8B0000] ring-2 ring-amber-400/80 bg-slate-950 flex flex-col justify-between p-5 sm:p-6 text-center select-none"
            >
              {/* Underneath Background Photo */}
              {selectedBgUrl ? (
                <>
                  <img
                    src={selectedBgUrl}
                    alt="Background Preview"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-300"
                    style={{
                      filter: bgBlur > 0 ? `blur(${bgBlur}px)` : 'none',
                      transform: bgBlur > 0 ? 'scale(1.02)' : 'none'
                    }}
                  />
                  {/* Dark Shade Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-all duration-300"
                    style={{
                      background: `linear-gradient(to bottom, rgba(40,0,0,0.7) 0%, rgba(0,0,0,${bgDarkness / 100}) 42%, rgba(20,0,0,0.92) 100%)`
                    }}
                  />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-[#800000] to-[#3a0000] pointer-events-none" />
              )}

              {/* Sample Typography Preview atop Photo */}
              <div className="relative z-10 flex flex-col items-center justify-between h-full py-1">
                {/* Header Branding */}
                <div className="space-y-1">
                  <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                    🌅 दैनिक प्रज्ञा • दिन #{activeDailyQuote.dayOfMonth}
                  </span>
                  <h4
                    className="text-amber-200 text-sm font-black font-serif tracking-wide drop-shadow-sm"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.85)' }}
                  >
                    जीवन ज्योति फाउंडेशन
                  </h4>
                  <p className="text-[10px] text-amber-300/80 font-medium">
                    ग़ाज़ीपुर (उत्तर प्रदेश) • स्थापना 2018
                  </p>
                </div>

                {/* Central Quote Text */}
                <div className="my-auto px-1.5 py-3 space-y-2.5">
                  <Quote className="w-5 h-5 text-amber-400/90 mx-auto" />
                  <p
                    className="text-white text-xs sm:text-sm font-black font-serif leading-relaxed drop-shadow-lg"
                    style={{ textShadow: '0 2px 6px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.9)' }}
                  >
                    "{activeDailyQuote.quoteHi}"
                  </p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-black/60 border border-amber-400/60 backdrop-blur-xs text-amber-300 text-xs font-bold shadow-md">
                    <span>— {activeDailyQuote.author}</span>
                  </div>
                </div>

                {/* Footer Ribbon with App Open QR Code & Direct Clickable Link */}
                <div className="w-full pt-2 border-t border-amber-400/30 flex items-center justify-between gap-2 px-1 text-left">
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-[10px] font-bold text-amber-200/95 tracking-wide truncate">
                      सेवा • शिक्षा • स्वास्थ्य
                    </div>
                    <a
                      href="https://jeevan-jyoti-foundation-7eso.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[8.5px] font-mono text-amber-300 font-bold hover:underline flex items-center gap-1 cursor-pointer truncate"
                      title="क्लिक करके ऐप खोलें: https://jeevan-jyoti-foundation-7eso.vercel.app"
                    >
                      <span>🔗</span>
                      <span>jeevan-jyoti-foundation-7eso.vercel.app</span>
                    </a>
                  </div>
                  <div className="shrink-0">
                    <PosterAppOpenQR size={38} variant="compact" customUrl="https://jeevan-jyoti-foundation-7eso.vercel.app" />
                  </div>
                </div>
              </div>
            </div>

            {/* Hidden Offscreen QR Canvas for 1080p Canvas Export */}
            <div className="hidden" aria-hidden="true">
              <QRCodeCanvas
                id="daily-wisdom-qr-canvas"
                value="https://jeevan-jyoti-foundation-7eso.vercel.app"
                size={300}
                level="H"
                includeMargin={true}
                marginSize={2}
                fgColor="#0f172a"
                bgColor="#FFFFFF"
              />
            </div>

            {/* Direct Action & Download Buttons under Preview */}
            <div className="pt-2 flex flex-col gap-2 max-w-[340px] mx-auto w-full">
              {/* PRIMARY ACTION 1: DIRECT 1080p ULTRA HD POSTER DOWNLOAD */}
              <button
                type="button"
                onClick={handleDirectDownload}
                disabled={isDownloading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75"
                title="इस पोस्टर को सीधे 1080p Ultra HD PNG के रूप में डाउनलोड करें"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 text-slate-950 animate-spin" />
                    <span>HD पोस्टर तैयार हो रहा है...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                    <span>📥 सीधा 1080p HD पोस्टर डाउनलोड करें</span>
                  </>
                )}
              </button>

              {/* SECONDARY ROW: WhatsApp Share & Copy to Clipboard */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDirectShareWhatsApp}
                  disabled={isSharing}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
                  title="WhatsApp पर सीधे शेयर करें"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-200 fill-emerald-200" />
                  <span>WhatsApp शेयर</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyCardImage}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                  title="पोस्टर इमेज को क्लिपबोर्ड में कॉपी करें"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>इमेज कॉपी करें</span>
                </button>
              </div>

              {/* TERTIARY ACTIONS: Official Format Download or Edit in Full Studio */}
              <button
                type="button"
                onClick={() => {
                  if (onDownloadOfficialPoster) {
                    onDownloadOfficialPoster(
                      activeDailyQuote.quoteHi,
                      activeDailyQuote.author,
                      selectedBgUrl,
                      bgDarkness,
                      bgBlur
                    );
                  } else {
                    handleApplyBgToPoster();
                    handleApplyQuoteToPoster(activeDailyQuote);
                    onSwitchToPoster();
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-800 via-red-900 to-amber-950 hover:from-red-900 hover:to-black text-amber-300 border border-amber-500/40 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                title="आधिकारिक कोलाज और लोगो वाले बड़े पोस्टर फॉर्मेट में डाउनलोड करें"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>📜 आधिकारिक कॉलाज पोस्टर में डाउनलोड करें</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleApplyBgToPoster}
                  className="py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                  title="इस बैकग्राउंड को पोस्टर में सक्रिय करें"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>बैकग्राउंड लागू करें</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleApplyBgToPoster();
                    handleApplyQuoteToPoster(activeDailyQuote);
                    onSwitchToPoster();
                  }}
                  className="py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>एडिटर पर जाएं →</span>
                </button>
              </div>
            </div>
          </div>

          {/* Customization Sliders & Presets (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Fine-Tuning Sliders */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                <span className="font-black text-xs text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#8B0000]" />
                  <span>फ़ोटो अनुकूलन सेटिंग्स (Photo Contrast & Visibility):</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setBgDarkness(45);
                    setBgBlur(0);
                  }}
                  className="text-[11px] font-bold text-[#8B0000] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>रीसेट</span>
                </button>
              </div>

              {/* Slider 1: Dark Shade Overlay */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>डार्क शेड ओवरले (Darkness for readability):</span>
                  <span className="font-mono text-amber-800 font-black">{bgDarkness}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={85}
                  step={1}
                  value={bgDarkness}
                  onChange={(e) => setBgDarkness(Number(e.target.value))}
                  className="w-full accent-[#8B0000] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <p className="text-[10px] text-slate-500">
                  ओवरले बढ़ाने से बैकग्राउंड पर लिखा हुआ हिंदी टेक्स्ट अत्यंत साफ़ व स्पष्ट दिखाई देता है।
                </p>
              </div>

              {/* Slider 2: Background Blur */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>बैकग्राउंड धुंधलापन (Soft Blur Effect):</span>
                  <span className="font-mono text-amber-800 font-black">{bgBlur} px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={8}
                  step={1}
                  value={bgBlur}
                  onChange={(e) => setBgBlur(Number(e.target.value))}
                  className="w-full accent-[#8B0000] h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <p className="text-[10px] text-slate-500">
                  हल्का ब्लर (1-3px) देने से मुख्य सुविचार और लेखक का नाम सिनेमैटिक स्टाइल में उभर कर दिखता है।
                </p>
              </div>
            </div>

            {/* Photo Library Presets Filter Tabs */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700">
                  चुनिंदा प्राकृतिक व आध्यात्मिक बैकग्राउंड लाइब्रेरी:
                </span>

                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'all', label: 'सभी' },
                    { id: 'nature', label: 'प्रकृति' },
                    { id: 'spiritual', label: 'आध्यात्म' },
                    { id: 'seva', label: 'सेवा कार्य' },
                    { id: 'education', label: 'ज्ञान' },
                    { id: 'festive', label: 'पर्व दीप' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setBgCategoryFilter(tab.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                        bgCategoryFilter === tab.id
                          ? 'bg-[#8B0000] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredBgPresets.map((preset) => {
                  const isSelected = selectedBgUrl === preset.url;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        setSelectedBgUrl(preset.url);
                        setIsCustomUploaded(false);
                        setBgDarkness(preset.defaultDarkness);
                        setBgBlur(preset.defaultBlur);
                      }}
                      className={`group relative rounded-xl overflow-hidden aspect-[4/3] cursor-pointer border-2 transition-all ${
                        isSelected
                          ? 'border-[#8B0000] ring-2 ring-amber-400 shadow-md scale-[1.02]'
                          : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.titleHi}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#8B0000] text-white flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}

                      <div className="absolute bottom-1.5 left-1.5 right-1.5 text-left pointer-events-none">
                        <span className="text-[9px] font-mono font-bold text-amber-300 bg-black/60 px-1.5 py-0.2 rounded">
                          {preset.badge}
                        </span>
                        <p className="text-[10px] font-bold text-white truncate mt-0.5">
                          {preset.titleHi}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 3: BROWSE ALL 31 DAYS OF DAILY WISDOM
          ===================================================================== */}
      <div className="bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-800 text-white space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase mb-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>31 दिवसीय पावन प्रेरणा संग्रह</span>
            </div>
            <h4 className="text-lg sm:text-xl font-black font-serif text-white">
              माह के प्रत्येक दिन के लिए विशेष दैनिक सुविचार
            </h4>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'सभी 31 विचार' },
              { id: 'educational', label: 'शिक्षा' },
              { id: 'career', label: 'कर्म' },
              { id: 'devotional', label: 'भक्ति' },
              { id: 'humanity', label: 'सेवा' },
              { id: 'life', label: 'शांति' },
              { id: 'patriotism', label: 'राष्ट्र' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setQuoteCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${
                  quoteCategoryFilter === cat.id
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quotes Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredQuotes.map((q) => {
            const isToday = q.dayOfMonth === todayDayOfMonth;
            const isCurrent = q.dayOfMonth === selectedDay;

            return (
              <div
                key={q.dayOfMonth}
                onClick={() => setSelectedDay(q.dayOfMonth)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isCurrent
                    ? 'bg-gradient-to-br from-amber-950/80 to-slate-900 border-amber-400 shadow-lg ring-1 ring-amber-400/50'
                    : 'bg-slate-950/80 hover:bg-slate-800/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-mono font-black text-xs flex items-center justify-center">
                      {q.dayOfMonth}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">तारीख #{q.dayOfMonth}</span>
                  </div>

                  {isToday && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase">
                      आज का विचार
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-serif font-bold text-slate-100 leading-relaxed line-clamp-3">
                  "{q.quoteHi}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-amber-300 font-bold truncate max-w-[140px]">
                    — {q.author}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyQuoteToPoster(q);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-[11px] font-bold border border-amber-500/30 transition flex items-center gap-1 cursor-pointer"
                    title="पोस्टर में लोड करें"
                  >
                    <span>लोड करें</span>
                    <Sparkles className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
