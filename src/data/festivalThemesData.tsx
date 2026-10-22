import React from 'react';

export interface FestivalThemePreset {
  id: string;
  nameHindi: string;
  nameEnglish: string;
  symbolEmoji: string;
  bgGradient: string; // CSS background gradient for certificate/card
  canvasBg: string; // Base canvas color
  accentColor: string; // Main festive accent
  outerBorderColor: string; // Outer frame border color
  innerBorderColor: string; // Inner gold/ornate border color
  sealAccentColor: string; // Official seal color
  badgeBg: string; // Category badge background
  badgeText: string; // Category badge text
  cardBg: string; // Recipient card backdrop
  textColor: string; // Primary title text color
  shlokaBg: string; // Shloka box background
  associatedFestivals: string[]; // Festival IDs that auto-match this theme
  description: string;
}

export const FESTIVAL_THEME_PRESETS: FestivalThemePreset[] = [
  // 1. दीपावली एवं देव दीपावली (Golden Diya & Festive Radiance)
  {
    id: 'fest-theme-diwali',
    nameHindi: 'दीपावली दीपोत्सव प्रभा (Golden Diya & Radiance)',
    nameEnglish: 'Deepotsav Golden Radiance',
    symbolEmoji: '🪔',
    bgGradient: 'linear-gradient(135deg, #fffdf0 0%, #fef3c7 30%, #ffedd5 65%, #fffbeb 100%)',
    canvasBg: '#fffdf0',
    accentColor: '#d97706',
    outerBorderColor: '#8B0000',
    innerBorderColor: '#D4AF37',
    sealAccentColor: '#b45309',
    badgeBg: '#fef3c7',
    badgeText: '#92400e',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    textColor: '#8B0000',
    shlokaBg: 'rgba(254, 243, 199, 0.85)',
    associatedFestivals: ['diwali', 'deepawali', 'dhanteras', 'govardhan_puja', 'dev_diwali', 'bhai_dooj', 'karwa_chauth'],
    description: 'स्वर्ण दीपकों की दिव्य रोशनी, शुभ मांगलिक आभा एवं दीपमाला का पर्व'
  },

  // 2. होली रंगोत्सव (Vibrant Gulal & Joyous Pichkari)
  {
    id: 'fest-theme-holi',
    nameHindi: 'होली रंगोत्सव उल्लास (Gulal & Pichkari Colors)',
    nameEnglish: 'Holi Festive Colors',
    symbolEmoji: '🎨',
    bgGradient: 'linear-gradient(135deg, #fff5f5 0%, #fdf2f8 25%, #fef3c7 60%, #f0fdf4 100%)',
    canvasBg: '#fff5f5',
    accentColor: '#db2777',
    outerBorderColor: '#9d174d',
    innerBorderColor: '#f59e0b',
    sealAccentColor: '#be185d',
    badgeBg: '#fce7f3',
    badgeText: '#9d174d',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    textColor: '#9d174d',
    shlokaBg: 'rgba(253, 242, 248, 0.85)',
    associatedFestivals: ['holi', 'holika_dahan', 'chhoti_holi', 'rangwali_holi'],
    description: 'रंग-अबीर, गुलाल, पिचकारी और आपसी सद्भाव व प्रेम का पावन उत्सव'
  },

  // 3. छठ महापर्व (Surya Dev Arghya & Sunrise Ghat)
  {
    id: 'fest-theme-chhath',
    nameHindi: 'छठ महापर्व सूर्योदय (Surya Dev Arghya & Ghat)',
    nameEnglish: 'Chhath Mahaparv Sunrise',
    symbolEmoji: '☀️',
    bgGradient: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 35%, #ffedd5 70%, #fef9c3 100%)',
    canvasBg: '#fff7ed',
    accentColor: '#ea580c',
    outerBorderColor: '#9a3412',
    innerBorderColor: '#d97706',
    sealAccentColor: '#c2410c',
    badgeBg: '#ffedd5',
    badgeText: '#9a3412',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    textColor: '#9a3412',
    shlokaBg: 'rgba(255, 237, 213, 0.85)',
    associatedFestivals: ['chhath_puja', 'chhath', 'surya_shashthi', 'dalla_chhath'],
    description: 'भगवान भास्कर को अर्घ्य, पवित्र गंगा घाट एवं लोक आस्था का महापर्व'
  },

  // 4. महाशिवरात्रि नीलकंठ (Trishul, Damru & Sacred Neelkanth)
  {
    id: 'fest-theme-shivratri',
    nameHindi: 'महाशिवरात्रि नीलकंठ (Trishul & Damru Divine)',
    nameEnglish: 'Maha Shivratri Neelkanth',
    symbolEmoji: '🕉️',
    bgGradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 35%, #f1f5f9 70%, #ecfeff 100%)',
    canvasBg: '#f0f9ff',
    accentColor: '#0284c7',
    outerBorderColor: '#0c4a6e',
    innerBorderColor: '#38bdf8',
    sealAccentColor: '#0369a1',
    badgeBg: '#e0f2fe',
    badgeText: '#075985',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    textColor: '#0c4a6e',
    shlokaBg: 'rgba(224, 242, 254, 0.85)',
    associatedFestivals: ['maha_shivratri', 'shivratri', 'shravan_somwar', 'nag_panchami'],
    description: 'देवाधिदेव महादेव का त्रिशूल, डमरू, बिल्वपत्र और पवित्र गंगाधार'
  },

  // 5. श्रीकृष्ण जन्माष्टमी (Peacock Feather, Bansuri & Makhan)
  {
    id: 'fest-theme-krishna',
    nameHindi: 'श्रीकृष्ण जन्माष्टमी (Peacock Feather & Bansuri)',
    nameEnglish: 'Krishna Janmashtami Morpankh',
    symbolEmoji: '🦚',
    bgGradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 35%, #fef9c3 70%, #ecfeff 100%)',
    canvasBg: '#f0fdf4',
    accentColor: '#059669',
    outerBorderColor: '#065f46',
    innerBorderColor: '#d97706',
    sealAccentColor: '#047857',
    badgeBg: '#dcfce7',
    badgeText: '#065f46',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    textColor: '#065f46',
    shlokaBg: 'rgba(220, 252, 231, 0.85)',
    associatedFestivals: ['krishna_janmashtami', 'janmashtami', 'radhashtami', 'dahi_handi'],
    description: 'भगवान नंदनंदन का पावन मोरपंख, मधुर बांसुरी, माखन मटकी व कदंब'
  },

  // 6. श्री राम नवमी व दशहरा (Kodanda Dhanush & Ayodhya Mandir)
  {
    id: 'fest-theme-ram',
    nameHindi: 'श्री राम नवमी व विजयोत्सव (Dhanush & Ayodhya Mandir)',
    nameEnglish: 'Shri Ram Navami & Vijayadashami',
    symbolEmoji: '🏹',
    bgGradient: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 35%, #fef3c7 70%, #fffbeb 100%)',
    canvasBg: '#fff7ed',
    accentColor: '#ea580c',
    outerBorderColor: '#7c2d12',
    innerBorderColor: '#d97706',
    sealAccentColor: '#c2410c',
    badgeBg: '#ffedd5',
    badgeText: '#9a3412',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    textColor: '#7c2d12',
    shlokaBg: 'rgba(255, 237, 213, 0.85)',
    associatedFestivals: ['ram_navami', 'vijayadashami', 'dussehra', 'hanuman_jayanti', 'chaitra_navratri'],
    description: 'मर्यादा पुरुषोत्तम श्री राम का कोदंड धनुष, सूर्यवंशी आभा व अयोध्या धाम'
  },

  // 7. राष्ट्रीय महापर्व तिरंगा (Tiranga Tricolor & Ashok Chakra)
  {
    id: 'fest-theme-tiranga',
    nameHindi: 'राष्ट्रीय महापर्व तिरंगा (Tiranga & Ashok Chakra)',
    nameEnglish: 'Tricolor National Pride',
    symbolEmoji: '🇮🇳',
    bgGradient: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 40%, #f0fdf4 75%, #ecfdf5 100%)',
    canvasBg: '#fff7ed',
    accentColor: '#f97316',
    outerBorderColor: '#1e3a8a',
    innerBorderColor: '#16a34a',
    sealAccentColor: '#1d4ed8',
    badgeBg: '#ffedd5',
    badgeText: '#1e3a8a',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    textColor: '#1e3a8a',
    shlokaBg: 'rgba(255, 247, 237, 0.9)',
    associatedFestivals: ['independence_day', 'republic_day', 'gandhi_jayanti', 'national'],
    description: 'केसरिया, धवल एवं हरित तिरंगा और 24 तीलियों वाला अशोक चक्र'
  },

  // 8. मां सरस्वती पूजा एवं बसंत पंचमी (Veena, Hans & Peetambar)
  {
    id: 'fest-theme-saraswati',
    nameHindi: 'मां सरस्वती पूजा व बसंत (Veena & Peetambar)',
    nameEnglish: 'Saraswati Puja & Vasant',
    symbolEmoji: '🪕',
    bgGradient: 'linear-gradient(135deg, #fffdf0 0%, #fef9c3 35%, #fef08a 70%, #fffbeb 100%)',
    canvasBg: '#fffdf0',
    accentColor: '#ca8a04',
    outerBorderColor: '#854d0e',
    innerBorderColor: '#eab308',
    sealAccentColor: '#a16207',
    badgeBg: '#fef9c3',
    badgeText: '#854d0e',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    textColor: '#854d0e',
    shlokaBg: 'rgba(254, 249, 195, 0.85)',
    associatedFestivals: ['vasant_panchami', 'saraswati_puja'],
    description: 'विद्या की देवी मां वीणावादिनी, श्वेत कमल, राजहंस एवं पीत वस्त्र'
  },

  // 9. रक्षाबंधन एवं भाई-बहन स्नेह (Sacred Rakhi & Sneh)
  {
    id: 'fest-theme-rakhi',
    nameHindi: 'रक्षाबंधन स्नेह सूत्र (Sacred Rakhi Thread)',
    nameEnglish: 'Raksha Bandhan Sacred Bond',
    symbolEmoji: '🌸',
    bgGradient: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 35%, #fed7aa 70%, #fff7ed 100%)',
    canvasBg: '#fff1f2',
    accentColor: '#e11d48',
    outerBorderColor: '#9f1239',
    innerBorderColor: '#f59e0b',
    sealAccentColor: '#be123c',
    badgeBg: '#ffe4e6',
    badgeText: '#9f1239',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    textColor: '#9f1239',
    shlokaBg: 'rgba(255, 228, 230, 0.85)',
    associatedFestivals: ['raksha_bandhan', 'rakhi'],
    description: 'पवित्र रक्षा सूत्र, भाई-बहन का अटूट स्नेह, मिष्ठान्न एवं संकल्प'
  },

  // 10. गणेश चतुर्थी (Vighnaharta Modak & Ganesha Moorti)
  {
    id: 'fest-theme-ganesh',
    nameHindi: 'श्री गणेश चतुर्थी (Vighnaharta Modak & Ganesha)',
    nameEnglish: 'Ganesh Chaturthi Vighnaharta',
    symbolEmoji: '🐘',
    bgGradient: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 35%, #fef08a 70%, #fffbeb 100%)',
    canvasBg: '#fff7ed',
    accentColor: '#ea580c',
    outerBorderColor: '#9a3412',
    innerBorderColor: '#d97706',
    sealAccentColor: '#c2410c',
    badgeBg: '#ffedd5',
    badgeText: '#9a3412',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    textColor: '#9a3412',
    shlokaBg: 'rgba(255, 237, 213, 0.85)',
    associatedFestivals: ['ganesh_chaturthi', 'anant_chaturdashi', 'vinayaka_chaturthi'],
    description: 'प्रथम पूज्य विघ्नहर्ता भगवान श्री गणेश, मोदक प्रसाद एवं मंगल कलश'
  },

  // 11. मकर संक्रांति एवं लोहड़ी (Kite & Til-Gur)
  {
    id: 'fest-theme-makar',
    nameHindi: 'मकर संक्रांति व लोहड़ी (Kite & Harvest Sun)',
    nameEnglish: 'Makar Sankranti & Harvest',
    symbolEmoji: '🪁',
    bgGradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 35%, #fed7aa 70%, #ecfeff 100%)',
    canvasBg: '#fffbeb',
    accentColor: '#d97706',
    outerBorderColor: '#78350f',
    innerBorderColor: '#ca8a04',
    sealAccentColor: '#b45309',
    badgeBg: '#fef3c7',
    badgeText: '#78350f',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    textColor: '#78350f',
    shlokaBg: 'rgba(254, 243, 199, 0.85)',
    associatedFestivals: ['makar_sankranti', 'pongal', 'lohri', 'khichdi'],
    description: 'उड़ाती रंगीन पतंगें, तिल-गुड़ की मिठास, उत्तरायण सूर्य एवं नई फसल का उल्लास'
  },

  // 12. जीवन ज्योति शाही सर्वमान्य (Royal Gold & Deep Crimson)
  {
    id: 'fest-theme-royal-gold',
    nameHindi: 'जीवन ज्योति शाही स्वर्ण (Royal Gold & Crimson Signature)',
    nameEnglish: 'Royal Gold & Crimson Signature',
    symbolEmoji: '👑',
    bgGradient: 'linear-gradient(135deg, #fffdf8 0%, #fef9c3 35%, #fef3c7 70%, #ffffff 100%)',
    canvasBg: '#fffdf8',
    accentColor: '#b45309',
    outerBorderColor: '#8B0000',
    innerBorderColor: '#D4AF37',
    sealAccentColor: '#8B0000',
    badgeBg: '#fef3c7',
    badgeText: '#78350f',
    cardBg: 'rgba(255, 255, 255, 0.96)',
    textColor: '#8B0000',
    shlokaBg: 'rgba(255, 253, 231, 0.9)',
    associatedFestivals: ['universal', 'default'],
    description: 'जीवन ज्योति फाउंडेशन की शाही सर्वमान्य परंपरा, स्वर्ण नक्काशी एवं महरून बॉर्डर'
  }
];

/**
 * Automatically find matching theme for any festival
 */
export function getThemeForFestival(festivalId?: string): FestivalThemePreset {
  if (!festivalId) return FESTIVAL_THEME_PRESETS[0];
  const cleanId = festivalId.toLowerCase();
  const matched = FESTIVAL_THEME_PRESETS.find((t) =>
    t.associatedFestivals.some((af) => cleanId.includes(af) || af.includes(cleanId))
  );
  return matched || FESTIVAL_THEME_PRESETS[0];
}

/**
 * Get theme by ID
 */
export function getFestivalThemeById(themeId?: string): FestivalThemePreset {
  if (!themeId) return FESTIVAL_THEME_PRESETS[0];
  const found = FESTIVAL_THEME_PRESETS.find((t) => t.id === themeId);
  return found || FESTIVAL_THEME_PRESETS[0];
}

/**
 * Vector Artwork Component for each theme - Renders high-fidelity, theme-related pictures
 */
export const FestivalThemeArtwork: React.FC<{
  themeId: string;
  size?: number;
  className?: string;
  variant?: 'emblem' | 'watermark' | 'badge';
}> = ({ themeId, size = 120, className = '', variant = 'emblem' }) => {
  const isWatermark = variant === 'watermark';
  const opacity = isWatermark ? 0.12 : 1;

  switch (themeId) {
    // 1. DIWALI / DEEPOTSAV - Detailed Ornate Golden Diya with Glowing Flame & Light Aura
    case 'fest-theme-diwali':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity }}
        >
          {/* Radial Light Aura */}
          <circle cx="80" cy="80" r="74" fill="url(#diwali-aura)" opacity="0.4" />
          <circle cx="80" cy="52" r="32" fill="url(#flame-glow)" opacity="0.6" />

          {/* Diya Base Clay / Brass Pot */}
          <path
            d="M30 92 C30 122 130 122 130 92 C125 98 105 106 80 106 C55 106 35 98 30 92 Z"
            fill="url(#diya-brass)"
            stroke="#b45309"
            strokeWidth="2.5"
          />
          {/* Diya Rim with Golden Carvings */}
          <ellipse cx="80" cy="92" rx="50" ry="12" fill="url(#diya-rim)" stroke="#d97706" strokeWidth="2" />
          <ellipse cx="80" cy="90" rx="38" ry="8" fill="#78350f" />

          {/* Floral Carvings on Diya */}
          <path
            d="M50 102 Q80 118 110 102"
            stroke="#fef08a"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            fill="none"
          />

          {/* Golden Pedestal */}
          <path
            d="M62 118 L98 118 L104 128 L56 128 Z"
            fill="url(#diya-brass)"
            stroke="#92400e"
            strokeWidth="1.5"
          />

          {/* Sacred Flame (Jyoti) */}
          <path
            d="M80 32 C88 52 92 68 80 84 C68 68 72 52 80 32 Z"
            fill="url(#sacred-flame-grad)"
          />
          {/* Inner Golden Core */}
          <path
            d="M80 44 C84 56 86 68 80 78 C74 68 76 56 80 44 Z"
            fill="#ffffff"
          />

          {/* Sparkle Stars */}
          <path d="M42 45 L45 52 L52 55 L45 58 L42 65 L39 58 L32 55 L39 52 Z" fill="#fef08a" />
          <path d="M120 42 L122 47 L127 49 L122 51 L120 56 L118 51 L113 49 L118 47 Z" fill="#fde047" />

          <defs>
            <radialGradient id="diwali-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="flame-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
              <stop offset="60%" stopColor="#ea580c" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="diya-brass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="diya-rim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="sacred-flame-grad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 2. HOLI - Ornate Pichkari with Vibrant Gulal Splashes & Celebration Aura
    case 'fest-theme-holi':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity }}
        >
          {/* Colorful Gulal Splash Clouds */}
          <circle cx="105" cy="45" r="32" fill="#ec4899" opacity="0.4" />
          <circle cx="125" cy="65" r="26" fill="#f59e0b" opacity="0.45" />
          <circle cx="95" cy="30" r="20" fill="#3b82f6" opacity="0.4" />
          <circle cx="130" cy="35" r="18" fill="#10b981" opacity="0.4" />

          {/* Color Droplets */}
          <circle cx="128" cy="22" r="5" fill="#f43f5e" />
          <circle cx="140" cy="48" r="4.5" fill="#8b5cf6" />
          <circle cx="85" cy="24" r="4" fill="#06b6d4" />
          <circle cx="142" cy="78" r="4" fill="#eab308" />

          {/* Golden Pichkari Barrel (Diagonal 45 deg) */}
          <g transform="rotate(-35 75 85)">
            {/* Front Nozzle */}
            <path d="M78 35 L86 35 L84 48 L80 48 Z" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
            {/* Front Ring */}
            <rect x="74" y="48" width="16" height="5" rx="2" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
            {/* Main Cylinder with Ornate Stripes */}
            <rect x="76" y="53" width="12" height="60" rx="3" fill="#f43f5e" stroke="#78350f" strokeWidth="1.8" />
            <rect x="76" y="65" width="12" height="12" fill="#f59e0b" />
            <rect x="76" y="87" width="12" height="12" fill="#10b981" />
            {/* Golden Filigree Bands */}
            <line x1="76" y1="65" x2="88" y2="65" stroke="#fef08a" strokeWidth="2" />
            <line x1="76" y1="77" x2="88" y2="77" stroke="#fef08a" strokeWidth="2" />
            <line x1="76" y1="87" x2="88" y2="87" stroke="#fef08a" strokeWidth="2" />
            <line x1="76" y1="99" x2="88" y2="99" stroke="#fef08a" strokeWidth="2" />
            {/* Rear Cap */}
            <rect x="74" y="113" width="16" height="5" rx="2" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
            {/* Plunger Shaft */}
            <rect x="80" y="118" width="4" height="24" fill="#d97706" />
            {/* Plunger Handle */}
            <path d="M72 142 L92 142 Q92 148 82 148 Q72 148 72 142 Z" fill="#92400e" stroke="#78350f" strokeWidth="1" />
          </g>

          {/* Earthen Gulal Bowl (Matki) with Dry Powder */}
          <path d="M30 115 Q48 115 54 128 L24 128 Q30 115 30 115 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
          <ellipse cx="39" cy="115" rx="14" ry="4" fill="#f43f5e" />
          <path d="M26 114 Q39 104 52 114 Z" fill="#f43f5e" />

          {/* Second Bowl Yellow Gulal */}
          <path d="M48 122 Q64 122 70 134 L42 134 Q48 122 48 122 Z" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
          <ellipse cx="56" cy="122" rx="12" ry="3.5" fill="#eab308" />
          <path d="M45 121 Q56 112 67 121 Z" fill="#eab308" />
        </svg>
      );

    // 3. CHHATH PUJA - Sacred Rising Sun with Surya Arghya Kalash & Holy Waves
    case 'fest-theme-chhath':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity }}
        >
          {/* Surya Radiance Rays */}
          <g stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
            <line x1="80" y1="18" x2="80" y2="8" />
            <line x1="102" y1="27" x2="110" y2="19" />
            <line x1="118" y1="45" x2="128" y2="45" />
            <line x1="120" y1="67" x2="129" y2="73" />
            <line x1="42" y1="45" x2="32" y2="45" />
            <line x1="58" y1="27" x2="50" y2="19" />
            <line x1="40" y1="67" x2="31" y2="73" />
          </g>

          {/* Radiant Rising Sun Disc */}
          <circle cx="80" cy="54" r="30" fill="url(#surya-disc)" stroke="#ea580c" strokeWidth="2.5" />
          {/* Inner Divine Aura */}
          <circle cx="80" cy="54" r="22" fill="#fef08a" opacity="0.5" />

          {/* Holy River Ganga Waves */}
          <path
            d="M15 125 C30 118 45 130 65 124 C85 118 105 130 125 124 C138 120 150 125 155 126 L155 145 L15 145 Z"
            fill="url(#river-water)"
            opacity="0.85"
          />
          <path
            d="M10 134 C25 128 45 138 65 133 C85 128 110 140 135 134 C145 132 155 135 158 136"
            stroke="#fef08a"
            strokeWidth="1.8"
            fill="none"
          />

          {/* Sacred Brass Arghya Kalash Pot */}
          <g transform="translate(62, 78)">
            {/* Kalash Body */}
            <path
              d="M10 24 C2 36 6 52 18 52 C30 52 34 36 26 24 Z"
              fill="url(#brass-kalash)"
              stroke="#78350f"
              strokeWidth="2"
            />
            {/* Kalash Neck & Rim */}
            <ellipse cx="18" cy="24" rx="10" ry="3.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
            <path d="M12 24 L14 16 L22 16 L24 24 Z" fill="#d97706" />
            <ellipse cx="18" cy="16" rx="6" ry="2" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
            {/* Fresh Coconut on Kalash */}
            <path d="M14 16 Q18 7 22 16 Z" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
            {/* Mango Leaves on Top */}
            <path d="M14 15 L7 8 L13 14 Z" fill="#15803d" />
            <path d="M22 15 L29 8 L23 14 Z" fill="#15803d" />
            {/* Arghya Holy Water Stream Pouring Out */}
            <path
              d="M18 14 C18 5 35 15 36 28 C37 40 33 46 32 54"
              stroke="#67e8f9"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Sugarcane Stalks (ईख) in Background */}
          <path d="M35 128 L40 45 L43 45 L38 128 Z" fill="#15803d" stroke="#14532d" strokeWidth="1" />
          <path d="M37 75 L30 65 L37 73" stroke="#16a34a" strokeWidth="2" fill="none" />
          <path d="M39 60 L46 50 L39 58" stroke="#16a34a" strokeWidth="2" fill="none" />

          <defs>
            <radialGradient id="surya-disc" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fef08a" />
              <stop offset="65%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#dc2626" />
            </radialGradient>
            <linearGradient id="brass-kalash" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="80%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="river-water" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 4. MAHA SHIVRATRI - Sacred Trishul with Damru & Crescent Moon (अर्धचंद्र)
    case 'fest-theme-shivratri':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity }}
        >
          {/* Divine Lunar Aura */}
          <circle cx="80" cy="80" r="72" fill="url(#shiva-aura)" opacity="0.4" />

          {/* Crescent Moon (अर्धचंद्र) */}
          <path
            d="M92 24 C82 24 74 34 74 46 C74 58 84 68 96 68 C88 68 80 60 80 46 C80 34 86 26 92 24 Z"
            fill="#e0f2fe"
            stroke="#bae6fd"
            strokeWidth="1.5"
            filter="drop-shadow(0 0 4px #38bdf8)"
          />

          {/* Central Trishul Rod */}
          <rect x="78" y="32" width="4" height="112" rx="2" fill="url(#trishul-gold)" stroke="#0c4a6e" strokeWidth="1" />

          {/* Trishul Prongs (Center, Left, Right) */}
          {/* Center Blade */}
          <path
            d="M80 14 L85 36 L75 36 Z"
            fill="url(#trishul-gold)"
            stroke="#0c4a6e"
            strokeWidth="1.8"
          />
          {/* Left Blade */}
          <path
            d="M80 46 C60 46 54 26 50 20 C54 36 68 56 76 56 Z"
            fill="url(#trishul-gold)"
            stroke="#0c4a6e"
            strokeWidth="1.8"
          />
          {/* Right Blade */}
          <path
            d="M80 46 C100 46 106 26 110 20 C106 36 92 56 84 56 Z"
            fill="url(#trishul-gold)"
            stroke="#0c4a6e"
            strokeWidth="1.8"
          />
          {/* Trishul Base Ring */}
          <ellipse cx="80" cy="56" rx="8" ry="3" fill="#0284c7" stroke="#0c4a6e" strokeWidth="1" />

          {/* Sacred Damru tied to Trishul */}
          <g transform="translate(66, 68)">
            {/* Damru Upper Cone */}
            <path d="M3 2 L25 2 L14 16 L14 16 Z" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
            <ellipse cx="14" cy="2" rx="11" ry="3" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
            {/* Damru Lower Cone */}
            <path d="M14 16 L25 30 L3 30 Z" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
            <ellipse cx="14" cy="30" rx="11" ry="3" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
            {/* Damru Center Waist */}
            <ellipse cx="14" cy="16" rx="4" ry="2" fill="#0284c7" />
            {/* Cross Leather Cords */}
            <line x1="5" y1="2" x2="23" y2="30" stroke="#fef08a" strokeWidth="1.2" opacity="0.8" />
            <line x1="23" y1="2" x2="5" y2="30" stroke="#fef08a" strokeWidth="1.2" opacity="0.8" />
            {/* Hanging Beads */}
            <circle cx="2" cy="16" r="2.5" fill="#f59e0b" />
            <circle cx="26" cy="16" r="2.5" fill="#f59e0b" />
          </g>

          {/* Sacred Bilva Patra (Belpatra Leaves) */}
          <g transform="translate(84, 102)">
            {/* Center Leaf */}
            <path d="M16 12 C24 0 28 0 28 12 C28 24 20 24 16 12 Z" fill="#15803d" stroke="#14532d" strokeWidth="1.2" />
            {/* Left Leaf */}
            <path d="M16 16 C6 10 4 6 12 4 C20 4 18 12 16 16 Z" fill="#16a34a" stroke="#14532d" strokeWidth="1.2" />
            {/* Right Leaf */}
            <path d="M18 16 C28 10 30 6 22 4 C14 4 16 12 18 16 Z" fill="#16a34a" stroke="#14532d" strokeWidth="1.2" />
            <line x1="17" y1="16" x2="15" y2="28" stroke="#14532d" strokeWidth="1.5" />
          </g>

          {/* Sacred Tripundra Vibhuti & Red Bindi */}
          <g opacity="0.85">
            <line x1="72" y1="92" x2="88" y2="92" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="70" y1="96" x2="90" y2="96" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="72" y1="100" x2="88" y2="100" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="80" cy="96" r="2.2" fill="#dc2626" />
          </g>

          <defs>
            <radialGradient id="shiva-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="trishul-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 5. KRISHNA JANMASHTAMI - Magnificent Peacock Feather (मोर पंख) & Golden Bansuri
    case 'fest-theme-krishna':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity }}
        >
          {/* Divine Peacock Feather Outer Eye */}
          <g transform="translate(60, 22)">
            {/* Outer Green Plumes */}
            <path
              d="M20 2 C-5 16 -10 46 20 62 C50 46 45 16 20 2 Z"
              fill="url(#morpankh-green)"
              stroke="#047857"
              strokeWidth="1.5"
            />
            {/* Turquoise Blue Layer */}
            <path
              d="M20 12 C6 22 2 44 20 54 C38 44 34 22 20 12 Z"
              fill="url(#morpankh-blue)"
            />
            {/* Bronze Gold Ring */}
            <ellipse cx="20" cy="34" rx="12" ry="14" fill="#d97706" />
            {/* Deep Royal Purple Center Core */}
            <ellipse cx="20" cy="36" rx="8" ry="10" fill="#312e81" />
            <circle cx="20" cy="35" r="4.5" fill="#38bdf8" />

            {/* Delicate Feather Spine */}
            <path d="M20 62 Q22 85 24 105" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Golden Bansuri (Flute) crossing horizontally with angle */}
          <g transform="rotate(-18 80 95)">
            {/* Flute Body */}
            <rect x="20" y="90" width="120" height="9" rx="4.5" fill="url(#bansuri-gold)" stroke="#78350f" strokeWidth="1.8" />
            {/* Finger Holes */}
            <circle cx="48" cy="94.5" r="2.2" fill="#451a03" />
            <circle cx="62" cy="94.5" r="2.2" fill="#451a03" />
            <circle cx="76" cy="94.5" r="2.2" fill="#451a03" />
            <circle cx="90" cy="94.5" r="2.2" fill="#451a03" />
            <circle cx="104" cy="94.5" r="2.2" fill="#451a03" />
            <circle cx="118" cy="94.5" r="2.2" fill="#451a03" />
            {/* Mouth Hole */}
            <circle cx="34" cy="94.5" r="2.8" fill="#451a03" stroke="#fef08a" strokeWidth="0.8" />
            {/* Golden Silk Tassels (Ghungroo) Hanging from Flute End */}
            <path d="M136 96 C138 108 142 118 140 126" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
            <circle cx="140" cy="126" r="3.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
          </g>

          {/* Earthen Makhan Matki (Butter Pot) */}
          <g transform="translate(24, 92)">
            <ellipse cx="26" cy="22" rx="18" ry="14" fill="#9a3412" stroke="#78350f" strokeWidth="1.8" />
            <ellipse cx="26" cy="10" rx="12" ry="4" fill="#78350f" stroke="#f59e0b" strokeWidth="1.2" />
            {/* White Fresh Butter overflowing */}
            <path
              d="M16 10 C16 4 36 4 36 10 C36 18 32 20 28 20 C24 20 20 24 18 20 C16 16 16 10 16 10 Z"
              fill="#ffffff"
              stroke="#fef08a"
              strokeWidth="1.2"
            />
          </g>

          <defs>
            <linearGradient id="morpankh-green" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="morpankh-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="bansuri-gold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 6. RAM NAVAMI & DUSSEHRA - Divine Kodanda Dhanush (Bow) with Golden Sun Crest
    case 'fest-theme-ram':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity }}
        >
          {/* Surya Vansh Radiant Sun Emblem */}
          <circle cx="80" cy="50" r="26" fill="url(#suryavansh-sun)" opacity="0.85" />
          <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
            <line x1="80" y1="18" x2="80" y2="12" />
            <line x1="104" y1="26" x2="110" y2="20" />
            <line x1="112" y1="50" x2="118" y2="50" />
            <line x1="104" y1="74" x2="110" y2="80" />
            <line x1="80" y1="82" x2="80" y2="88" />
            <line x1="56" y1="74" x2="50" y2="80" />
            <line x1="48" y1="50" x2="42" y2="50" />
            <line x1="56" y1="26" x2="50" y2="20" />
          </g>

          {/* Divine Kodanda Bow (धनुष) */}
          <g transform="translate(30, 25)">
            {/* Bow Wooden Arch Curve */}
            <path
              d="M10 110 C-10 60 10 20 80 15 C85 15 90 20 80 25 C25 30 15 65 25 105 Z"
              fill="url(#bow-gold)"
              stroke="#7c2d12"
              strokeWidth="2"
            />
            {/* Bow String (प्रत्यंचा) */}
            <line x1="12" y1="110" x2="85" y2="17" stroke="#fef08a" strokeWidth="1.8" strokeDasharray="3 1" />

            {/* Sacred Arrow (बाण) */}
            <line x1="15" y1="15" x2="95" y2="95" stroke="#d97706" strokeWidth="3" />
            {/* Golden Arrowhead */}
            <path d="M95 95 L98 84 L106 92 L95 95 Z" fill="#f59e0b" stroke="#7c2d12" strokeWidth="1.2" />
            {/* Feather Flights at end */}
            <path d="M15 15 L22 10 L18 22 Z" fill="#dc2626" />
          </g>

          {/* Saffron Dhwaja (भगवा ध्वज) flying */}
          <g transform="translate(100, 70)">
            <line x1="8" y1="5" x2="8" y2="60" stroke="#78350f" strokeWidth="2.5" />
            <path d="M8 8 L42 20 L8 32 L36 44 L8 52 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
            <circle cx="8" cy="5" r="3" fill="#f59e0b" />
          </g>

          <defs>
            <radialGradient id="suryavansh-sun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
            <linearGradient id="bow-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 7. NATIONAL DAYS - Tiranga Tricolor Waves & Ashok Chakra Medallion
    case 'fest-theme-tiranga':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity }}
        >
          {/* Circular Tiranga Badge Backdrop */}
          <circle cx="80" cy="80" r="70" fill="#ffffff" stroke="#1e3a8a" strokeWidth="3" />

          {/* Saffron Top Wave */}
          <path
            d="M13 60 C35 50 60 70 85 58 C110 46 135 62 147 60 A70 70 0 0 0 13 60 Z"
            fill="#f97316"
          />

          {/* Green Bottom Wave */}
          <path
            d="M13 100 C35 90 60 110 85 98 C110 86 135 102 147 100 A70 70 0 0 1 13 100 Z"
            fill="#16a34a"
          />

          {/* White Middle Band with Ashoka Chakra */}
          <circle cx="80" cy="80" r="22" stroke="#1e3a8a" strokeWidth="2.2" fill="#ffffff" />
          <circle cx="80" cy="80" r="4" fill="#1e3a8a" />

          {/* 24 Spokes of Ashoka Chakra */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            const rad = (angle * Math.PI) / 180;
            const x2 = 80 + 20 * Math.cos(rad);
            const y2 = 80 + 20 * Math.sin(rad);
            return (
              <line
                key={i}
                x1="80"
                y1="80"
                x2={x2}
                y2={y2}
                stroke="#1e3a8a"
                strokeWidth="1.2"
              />
            );
          })}

          {/* Golden Laurel Victory Leaves Framing */}
          <path
            d="M20 80 C20 120 60 144 80 144 C100 144 140 120 140 80"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeDasharray="4 6"
            fill="none"
          />
        </svg>
      );

    // 8. SARASWATI PUJA & VASANT - Sacred Veena, White Lotus & Swan Aura
    case 'fest-theme-saraswati':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity }}
        >
          {/* Peetambar Yellow Aura */}
          <circle cx="80" cy="80" r="70" fill="url(#vasant-aura)" opacity="0.45" />

          {/* Sacred White Blooming Kamal (Lotus) */}
          <g transform="translate(42, 92)">
            {/* Center Petal */}
            <path d="M38 12 C30 -4 46 -4 38 12 Z" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.2" />
            {/* Left Petals */}
            <path d="M36 14 C18 0 28 -8 34 8 Z" fill="#ffffff" stroke="#f59e0b" strokeWidth="1" />
            <path d="M34 16 C8 8 16 0 28 14 Z" fill="#ffffff" stroke="#f59e0b" strokeWidth="1" />
            {/* Right Petals */}
            <path d="M40 14 C58 0 48 -8 42 8 Z" fill="#ffffff" stroke="#f59e0b" strokeWidth="1" />
            <path d="M42 16 C68 8 60 0 48 14 Z" fill="#ffffff" stroke="#f59e0b" strokeWidth="1" />
            {/* Lotus Base */}
            <ellipse cx="38" cy="18" rx="20" ry="6" fill="#15803d" />
          </g>

          {/* Divine Veena (वीणा) placed gracefully */}
          <g transform="rotate(-30 75 75)">
            {/* Main Resonator Gourd (Thumbi) */}
            <circle cx="36" cy="75" r="22" fill="url(#veena-wood)" stroke="#78350f" strokeWidth="2" />
            <circle cx="36" cy="75" r="14" fill="#fef08a" opacity="0.4" />
            {/* Neck (Dandi) */}
            <rect x="54" y="71" width="75" height="8" rx="2" fill="url(#veena-wood)" stroke="#78350f" strokeWidth="1.8" />
            {/* Upper Small Resonator */}
            <circle cx="112" cy="75" r="12" fill="url(#veena-wood)" stroke="#78350f" strokeWidth="1.5" />
            {/* Dragon Head (Yali) Finial */}
            <path d="M129 70 Q138 68 142 75 Q138 82 129 80 Z" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
            {/* Strings */}
            <line x1="42" y1="73" x2="132" y2="73" stroke="#fef08a" strokeWidth="1" />
            <line x1="42" y1="75" x2="132" y2="75" stroke="#fef08a" strokeWidth="1" />
            <line x1="42" y1="77" x2="132" y2="77" stroke="#fef08a" strokeWidth="1" />
            {/* Bridge (Kudurai) */}
            <rect x="42" y="70" width="4" height="10" rx="1" fill="#78350f" />
          </g>

          {/* Sacred Book / Shastra (वेद पुस्तक) */}
          <g transform="translate(95, 110)">
            <path d="M5 12 L22 5 L42 12 L42 26 L22 19 L5 26 Z" fill="#fffbeb" stroke="#854d0e" strokeWidth="1.5" />
            <line x1="22" y1="5" x2="22" y2="19" stroke="#854d0e" strokeWidth="1.5" />
          </g>

          <defs>
            <radialGradient id="vasant-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#ca8a04" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="veena-wood" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 9. RAKSHA BANDHAN - Ornate Royal Rakhi Thread & Sweets
    case 'fest-theme-rakhi':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity }}
        >
          {/* Golden Silk Rakhi Threads Extending Left & Right */}
          <path
            d="M5 80 Q45 95 80 80 Q115 65 155 80"
            stroke="#f59e0b"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M5 80 Q45 95 80 80 Q115 65 155 80"
            stroke="#dc2626"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
          />

          {/* Central Ornate Floral Rakhi Medallion */}
          <circle cx="80" cy="80" r="34" fill="#fef08a" stroke="#d97706" strokeWidth="2.5" />
          <circle cx="80" cy="80" r="28" fill="#e11d48" />

          {/* Golden Floral Petals around Center */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8;
            const rad = (angle * Math.PI) / 180;
            const cx = 80 + 20 * Math.cos(rad);
            const cy = 80 + 20 * Math.sin(rad);
            return <circle key={i} cx={cx} cy={cy} r="4" fill="#fef08a" stroke="#b45309" strokeWidth="1" />;
          })}

          {/* Sparkling Diamond Ruby Center */}
          <circle cx="80" cy="80" r="14" fill="#ffffff" stroke="#9f1239" strokeWidth="2" />
          <polygon
            points="80,69 88,77 88,83 80,91 72,83 72,77"
            fill="#e11d48"
          />
          <circle cx="80" cy="80" r="3.5" fill="#fef08a" />

          {/* Beads on Silk Threads */}
          <circle cx="48" cy="84" r="5" fill="#d97706" />
          <circle cx="40" cy="85" r="3.5" fill="#e11d48" />
          <circle cx="112" cy="76" r="5" fill="#d97706" />
          <circle cx="120" cy="75" r="3.5" fill="#e11d48" />
        </svg>
      );

    // 10. GANESH CHATURTHI - Vighnaharta Ganesha Moorti Silhouette & Modak
    case 'fest-theme-ganesh':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity }}
        >
          {/* Mangal Halo Aura */}
          <circle cx="80" cy="80" r="70" fill="url(#ganesh-aura)" opacity="0.45" />

          {/* Auspicious Ganesha Iconic Calligraphic Silhouette */}
          <g fill="none" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            {/* Crown / Mukut */}
            <path d="M72 32 L80 18 L88 32 L84 36 L76 36 Z" fill="#f59e0b" stroke="#9a3412" strokeWidth="2" />
            {/* Forehead & Ear */}
            <path d="M60 48 C60 40 70 38 80 38 C90 38 100 40 100 48" />
            {/* Trunk (सूंड) sweeping gracefully */}
            <path d="M80 38 C80 55 76 75 88 85 C94 90 102 85 98 75 C96 70 90 70 88 74" />
            {/* Left Ear */}
            <path d="M62 48 C48 52 46 68 58 74 C62 76 68 74 72 68" />
            {/* Right Ear */}
            <path d="M98 48 C112 52 114 68 102 74 C98 76 92 74 88 68" />
            {/* Tusk (दांत) */}
            <line x1="74" y1="62" x2="68" y2="65" stroke="#fef08a" strokeWidth="2.5" />
          </g>

          {/* Red Tilak on Forehead */}
          <line x1="77" y1="42" x2="83" y2="42" stroke="#dc2626" strokeWidth="2.5" />
          <circle cx="80" cy="46" r="2" fill="#dc2626" />

          {/* Golden Modak on Plate */}
          <g transform="translate(64, 100)">
            {/* Brass Plate */}
            <ellipse cx="16" cy="22" rx="20" ry="6" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
            {/* Modak Body */}
            <path
              d="M16 6 C12 12 6 18 16 22 C26 18 20 12 16 6 Z"
              fill="url(#modak-gold)"
              stroke="#b45309"
              strokeWidth="1.5"
            />
            {/* Modak Folds */}
            <line x1="16" y1="8" x2="16" y2="20" stroke="#fef08a" strokeWidth="1.2" />
            <line x1="16" y1="8" x2="11" y2="19" stroke="#fef08a" strokeWidth="1" />
            <line x1="16" y1="8" x2="21" y2="19" stroke="#fef08a" strokeWidth="1" />
          </g>

          <defs>
            <radialGradient id="ganesh-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#ea580c" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#9a3412" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="modak-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 11. MAKAR SANKRANTI - Colorful Soaring Kites & Harvest Sunlight
    case 'fest-theme-makar':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity }}
        >
          {/* Sunlight Horizon */}
          <circle cx="80" cy="115" r="45" fill="url(#makar-sun)" opacity="0.6" />

          {/* Primary Flying Kite (पतंग) */}
          <g transform="translate(65, 30) rotate(15)">
            {/* Diamond Body with 4 quadrants */}
            <polygon points="25,0 50,30 25,60 0,30" fill="#f59e0b" stroke="#78350f" strokeWidth="1.8" />
            {/* Top quadrant red */}
            <polygon points="25,0 50,30 25,30" fill="#dc2626" />
            {/* Left quadrant green */}
            <polygon points="25,30 0,30 25,60" fill="#16a34a" />
            {/* Bamboo Spine & Bow Crossbar */}
            <line x1="25" y1="0" x2="25" y2="60" stroke="#451a03" strokeWidth="1.8" />
            <path d="M0 30 Q25 15 50 30" stroke="#451a03" strokeWidth="1.8" fill="none" />
            {/* Kite Tail (पुछल्ला) */}
            <polygon points="20,60 30,60 25,72" fill="#dc2626" stroke="#78350f" strokeWidth="1" />
            {/* Kite Manja String */}
            <path d="M25 45 C35 65 30 95 20 120" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
          </g>

          {/* Secondary Distant Kite */}
          <g transform="translate(20, 45) rotate(-20) scale(0.65)">
            <polygon points="25,0 50,30 25,60 0,30" fill="#38bdf8" stroke="#0369a1" strokeWidth="1.8" />
            <polygon points="25,0 50,30 25,30" fill="#e11d48" />
            <polygon points="20,60 30,60 25,72" fill="#f59e0b" />
          </g>

          {/* Earthen Bowl of Til-Gud Sweets */}
          <g transform="translate(90, 105)">
            <ellipse cx="22" cy="18" rx="18" ry="7" fill="#78350f" stroke="#b45309" strokeWidth="1.5" />
            {/* Til Laddoo Sweets */}
            <circle cx="16" cy="12" r="5" fill="#fef08a" stroke="#d97706" strokeWidth="1" />
            <circle cx="26" cy="11" r="5.5" fill="#fef08a" stroke="#d97706" strokeWidth="1" />
            <circle cx="21" cy="7" r="4.5" fill="#fed7aa" stroke="#d97706" strokeWidth="1" />
          </g>

          <defs>
            <radialGradient id="makar-sun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#fef08a" />
              <stop offset="80%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      );

    // 12. ROYAL SIGNATURE / DEFAULT - Mangal Kalash with Coconut, Swastika & Shubh Deepam
    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity }}
        >
          {/* Royal Golden Halo */}
          <circle cx="80" cy="80" r="72" fill="url(#royal-kalash-aura)" opacity="0.4" />

          {/* Sacred Mangal Kalash Base */}
          <g transform="translate(50, 50)">
            {/* Kalash Brass Pot */}
            <path
              d="M15 35 C5 52 10 75 30 75 C50 75 55 52 45 35 Z"
              fill="url(#royal-brass)"
              stroke="#8B0000"
              strokeWidth="2.2"
            />
            {/* Swastika Emblem on Kalash */}
            <g stroke="#8B0000" strokeWidth="2" strokeLinecap="round">
              <line x1="30" y1="46" x2="30" y2="60" />
              <line x1="23" y1="53" x2="37" y2="53" />
              <line x1="30" y1="46" x2="36" y2="46" />
              <line x1="30" y1="60" x2="24" y2="60" />
              <line x1="23" y1="53" x2="23" y2="47" />
              <line x1="37" y1="53" x2="37" y2="59" />
            </g>
            {/* Kalash Rim */}
            <ellipse cx="30" cy="35" rx="16" ry="5.5" fill="#fef08a" stroke="#8B0000" strokeWidth="2" />

            {/* Sacred Mango Leaves (आम के पल्लव) */}
            <path d="M22 34 L10 20 L22 32 Z" fill="#15803d" stroke="#14532d" strokeWidth="1" />
            <path d="M38 34 L50 20 L38 32 Z" fill="#15803d" stroke="#14532d" strokeWidth="1" />
            <path d="M30 33 L30 16 L31 33 Z" fill="#16a34a" stroke="#14532d" strokeWidth="1" />

            {/* Coconut (श्रीफल) with Sacred Red Thread */}
            <path d="M23 32 Q30 14 37 32 Z" fill="#78350f" stroke="#8B0000" strokeWidth="1.8" />
            <ellipse cx="30" cy="22" rx="4" ry="2" fill="#ea580c" />
          </g>

          {/* Left Companion Diya */}
          <g transform="translate(22, 95) scale(0.65)">
            <path d="M10 24 C10 38 42 38 42 24 Z" fill="url(#royal-brass)" stroke="#8B0000" strokeWidth="1.5" />
            <path d="M26 10 C29 16 30 20 26 24 C22 20 23 16 26 10 Z" fill="#f59e0b" />
          </g>

          {/* Right Companion Diya */}
          <g transform="translate(112, 95) scale(0.65)">
            <path d="M10 24 C10 38 42 38 42 24 Z" fill="url(#royal-brass)" stroke="#8B0000" strokeWidth="1.5" />
            <path d="M26 10 C29 16 30 20 26 24 C22 20 23 16 26 10 Z" fill="#f59e0b" />
          </g>

          <defs>
            <radialGradient id="royal-kalash-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8B0000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="royal-brass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="80%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
};
