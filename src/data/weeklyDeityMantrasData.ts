// ============================================================================
// JEEVAN JYOTI FOUNDATION - WEEKLY DEITIES & TROUBLE-RELIEVING MANTRAS DATA
// जीवन ज्योति फाउंडेशन - सप्ताह के प्रत्येक दिन के पूजनीय देवी-देवता एवं अति शक्तिशाली कष्ट निवारण मंत्र
// ============================================================================

export type DayOfWeekKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type DeityKey =
  | 'shiva'
  | 'parvati'
  | 'hanuman'
  | 'ganesha'
  | 'durga'
  | 'vishnu'
  | 'krishna'
  | 'saraswati'
  | 'lakshmi'
  | 'shani'
  | 'surya'
  | 'gayatri';

export interface WeeklyDeityMantra {
  id: string;
  dayKey: DayOfWeekKey;
  dayNameHi: string;
  dayNameEn: string;
  deityKey: DeityKey;
  deityNameHi: string;
  deityTitleHi: string;
  mantraTitle: string;
  sanskritMantra: string;
  beejaMantra?: string;
  meaningHi: string;
  benefitsHi: string;
  deityIcon: string;
  elementColor: string;
  bgGradient: string;
  accentColor: string;
  preferredThemeId: string;
  tags: string[];
  auspiciousOfferingsHi?: string; // जैसे: बेलपत्र, सिंदूर, मोदक, पीले फूल, कमल पुष्प
}

export interface DayMeta {
  key: DayOfWeekKey;
  dayNumber: number; // 0 Sunday, 1 Monday, ...
  nameHi: string;
  nameEn: string;
  rulingPlanet: string;
  rulingDeity: string;
  icon: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    badge: string;
  };
  specialTagline: string;
}

export const DAYS_OF_WEEK_META: DayMeta[] = [
  {
    key: 'monday',
    dayNumber: 1,
    nameHi: 'सोमवार',
    nameEn: 'Monday',
    rulingPlanet: 'चंद्रमा (Moon)',
    rulingDeity: 'देवाधिदेव महादेव शंकर एवं माता पार्वती',
    icon: '🔱',
    colorScheme: {
      bg: 'from-sky-950 via-slate-900 to-indigo-950',
      border: 'border-sky-400',
      text: 'text-sky-300',
      badge: 'bg-sky-500/20 text-sky-200 border-sky-400/40'
    },
    specialTagline: 'महादेव एवं माता पार्वती की असीम अनुकंपा से मानसिक शांति व समस्त भय-क्लेश का निवारण'
  },
  {
    key: 'tuesday',
    dayNumber: 2,
    nameHi: 'मंगलवार',
    nameEn: 'Tuesday',
    rulingPlanet: 'मंगल (Mars)',
    rulingDeity: 'संकटमोचन श्री हनुमान जी महाराज',
    icon: '🚩',
    colorScheme: {
      bg: 'from-orange-950 via-red-950 to-amber-950',
      border: 'border-orange-400',
      text: 'text-orange-300',
      badge: 'bg-orange-500/20 text-orange-200 border-orange-400/40'
    },
    specialTagline: 'पवनपुत्र हनुमान जी की कृपा से समस्त संकट, भय, रोग व बाधाओं का तात्कालिक नाश'
  },
  {
    key: 'wednesday',
    dayNumber: 3,
    nameHi: 'बुधवार',
    nameEn: 'Wednesday',
    rulingPlanet: 'बुध (Mercury)',
    rulingDeity: 'विघ्नहर्ता श्री गणेश जी एवं माँ भगवती दुर्गा',
    icon: '🌺',
    colorScheme: {
      bg: 'from-emerald-950 via-teal-950 to-slate-950',
      border: 'border-emerald-400',
      text: 'text-emerald-300',
      badge: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
    },
    specialTagline: 'बुद्धि, ज्ञान, व्यापार में चौमुखी वृद्धि व सभी अटके कार्यों की निर्विघ्न सिद्धि'
  },
  {
    key: 'thursday',
    dayNumber: 4,
    nameHi: 'गुरुवार',
    nameEn: 'Thursday',
    rulingPlanet: 'बृहस्पति (Jupiter)',
    rulingDeity: 'श्री हरि विष्णु, वासुदेव श्रीकृष्ण एवं माँ सरस्वती',
    icon: '🪷',
    colorScheme: {
      bg: 'from-amber-950 via-yellow-950 to-stone-950',
      border: 'border-yellow-400',
      text: 'text-yellow-300',
      badge: 'bg-yellow-500/20 text-yellow-200 border-yellow-400/40'
    },
    specialTagline: 'सुख, सौभाग्य, आध्यात्मिक उत्थान, सद्बुद्धि व जीवन में अखंड समृद्धि'
  },
  {
    key: 'friday',
    dayNumber: 5,
    nameHi: 'शुक्रवार',
    nameEn: 'Friday',
    rulingPlanet: 'शुक्र (Venus)',
    rulingDeity: 'धनदात्री माँ महालक्ष्मी एवं शक्ति स्वरूपा नवदुर्गा',
    icon: '🪔',
    colorScheme: {
      bg: 'from-rose-950 via-pink-950 to-purple-950',
      border: 'border-rose-400',
      text: 'text-rose-300',
      badge: 'bg-rose-500/20 text-rose-200 border-rose-400/40'
    },
    specialTagline: 'दरिद्रता का समूल नाश, वैभव, ऐश्वर्य, यश एवं सर्वबाधा मुक्ति की पावन प्राप्ति'
  },
  {
    key: 'saturday',
    dayNumber: 6,
    nameHi: 'शनिवार',
    nameEn: 'Saturday',
    rulingPlanet: 'शनि (Saturn)',
    rulingDeity: 'कर्मफलदाता न्यायप्रिय शनि देव एवं श्री हनुमान जी',
    icon: '⚖️',
    colorScheme: {
      bg: 'from-indigo-950 via-slate-950 to-blue-950',
      border: 'border-indigo-400',
      text: 'text-indigo-300',
      badge: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/40'
    },
    specialTagline: 'साढ़ेसाती, ढैय्या, शनि दोष शांति, न्याय विजय व जीवन के समस्त संघर्षों से त्राण'
  },
  {
    key: 'sunday',
    dayNumber: 0,
    nameHi: 'रविवार',
    nameEn: 'Sunday',
    rulingPlanet: 'सूर्य (Sun)',
    rulingDeity: 'प्रत्यक्ष देव भगवान सूर्य नारायण एवं वेदमाता गायत्री',
    icon: '☀️',
    colorScheme: {
      bg: 'from-amber-950 via-orange-950 to-red-950',
      border: 'border-amber-400',
      text: 'text-amber-300',
      badge: 'bg-amber-500/20 text-amber-200 border-amber-400/40'
    },
    specialTagline: 'आरोग्य, आत्मबल, तेज, मान-सम्मान, सद्बुद्धि एवं सकारात्मक ऊर्जा का दिव्य संचार'
  }
];

export const DEITY_FILTER_LIST: { key: DeityKey | 'all'; nameHi: string; icon: string }[] = [
  { key: 'all', nameHi: 'सभी पूज्य देवी-देवता', icon: '🕉️' },
  { key: 'shiva', nameHi: 'महादेव शंकर', icon: '🔱' },
  { key: 'parvati', nameHi: 'माता पार्वती', icon: '🌸' },
  { key: 'hanuman', nameHi: 'श्री हनुमान जी', icon: '🚩' },
  { key: 'ganesha', nameHi: 'श्री गणेश जी', icon: '🐘' },
  { key: 'durga', nameHi: 'नवदुर्गा भवानी', icon: '⚔️' },
  { key: 'vishnu', nameHi: 'श्री हरि विष्णु', icon: '🪷' },
  { key: 'krishna', nameHi: 'वासुदेव श्रीकृष्ण', icon: '🦚' },
  { key: 'lakshmi', nameHi: 'माता महालक्ष्मी', icon: '🪙' },
  { key: 'saraswati', nameHi: 'माँ सरस्वती', icon: '🪕' },
  { key: 'shani', nameHi: 'शनि देव महाराज', icon: '⚖️' },
  { key: 'surya', nameHi: 'भगवान सूर्य देव', icon: '☀️' },
  { key: 'gayatri', nameHi: 'वेदमाता गायत्री', icon: '🪔' }
];

export const WEEKLY_DEITY_MANTRAS: WeeklyDeityMantra[] = [
  // ==========================================
  // 1. सोमवार (MONDAY) - महादेव शंकर एवं माता पार्वती
  // ==========================================
  {
    id: 'mantra-mon-shiva-mahamrityunjaya',
    dayKey: 'monday',
    dayNameHi: 'सोमवार',
    dayNameEn: 'Monday',
    deityKey: 'shiva',
    deityNameHi: 'देवाधिदेव महादेव शंकर',
    deityTitleHi: 'भोलेनाथ • महामृत्युंजय • शिव शम्भू',
    mantraTitle: 'अति शक्तिशाली महामृत्युंजय महामंत्र (अकाल संकट व रोग निवारण)',
    sanskritMantra: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।\nउर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥',
    beejaMantra: 'ॐ जूं सः • ॐ नमः शिवाय',
    meaningHi: 'हम तीन नेत्रों वाले भगवान शिव की आराधना करते हैं जो प्रत्येक श्वास में सुगंधित जीवन शक्ति भरते हैं। जिस प्रकार पका खरबूजा बेल के बंधन से मुक्त हो जाता है, उसी प्रकार हम मृत्यु व भय से मुक्त होकर अमरता को प्राप्त हों।',
    benefitsHi: 'अकाल मृत्यु, गंभीर बीमारी, मानसिक अशांति, भय एवं घोर संकटों से पूर्ण रक्षा। मन में अपार सकारात्मक ऊर्जा व शांति का संचार।',
    deityIcon: '🔱',
    elementColor: '#38bdf8',
    bgGradient: 'from-[#0b192c] via-[#1e3e62] to-[#000000]',
    accentColor: '#38bdf8',
    preferredThemeId: 'theme-royal-maroon',
    tags: ['महादेव', 'महामृत्युंजय', 'सोमवार', 'आरोग्य', 'कष्टनिवारण'],
    auspiciousOfferingsHi: 'कच्चा दूध, जल, बेलपत्र, सफेद चंदन, भांग-धतूरा'
  },
  {
    id: 'mantra-mon-shiva-panchakshara',
    dayKey: 'monday',
    dayNameHi: 'सोमवार',
    dayNameEn: 'Monday',
    deityKey: 'shiva',
    deityNameHi: 'भगवान शिव शंकर',
    deityTitleHi: 'कैलाशपति • आशुतोष • पंचाक्षर',
    mantraTitle: 'शिव पंचाक्षर एवं रुद्र गायत्री महामंत्र (समस्त पाप व बाधा मुक्ति)',
    sanskritMantra: 'ॐ नमः शिवाय॥\nॐ तत्पुरुषाय विद्महे महादेवाय धीमहि तन्नो रुद्रः प्रचोदयात्॥',
    beejaMantra: 'ॐ ह्रीं ह्रौं नमः शिवाय',
    meaningHi: 'हम उस परम सत्य महाकाल देवाधिदेव शिव को नमन करते हैं और उनका ध्यान करते हैं। वे सर्वशक्तिमान रुद्र हमारी बुद्धि और आत्मा को सत्य व प्रकाश के मार्ग पर प्रेरित करें।',
    benefitsHi: 'मन की एकाग्रता, आंतरिक अशांति का शमन, नकारात्मक विचारों का नाश और सभी कार्यों में शिव कृपा से विजय।',
    deityIcon: '🔱',
    elementColor: '#7dd3fc',
    bgGradient: 'from-[#0f172a] via-[#1e293b] to-[#020617]',
    accentColor: '#7dd3fc',
    preferredThemeId: 'theme-royal-maroon',
    tags: ['शिव', 'रुद्रगायत्री', 'सोमवार', 'पंचाक्षर', 'शांति'],
    auspiciousOfferingsHi: 'गंगाजल, श्वेत पुष्प, भस्म, अक्षत'
  },
  {
    id: 'mantra-mon-parvati-kalyan',
    dayKey: 'monday',
    dayNameHi: 'सोमवार',
    dayNameEn: 'Monday',
    deityKey: 'parvati',
    deityNameHi: 'माता पार्वती (गौरी)',
    deityTitleHi: 'जगन्माता • शिवा • अन्नपूर्णा',
    mantraTitle: 'माता पार्वती सर्वमंगल कल्याण मंत्र (सुख-सौभाग्य एवं गृहक्लेश निवारण)',
    sanskritMantra: 'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके।\nशरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥',
    beejaMantra: 'ॐ ह्रीं उमायै नमः • ॐ गिरिजायै नमः',
    meaningHi: 'हे सब मंगलों में मंगल रूपिणी, कल्याणकारिणी, समस्त पुरुषार्थों को सिद्ध करने वाली, शरणागतवत्सला, तीन नेत्रों वाली हे गौरी नारायणी! आपको हमारा बारंबार प्रणाम है।',
    benefitsHi: 'विवाह में आ रही बाधाओं का निवारण, दांपत्य जीवन में अपार प्रेम, गृहक्लेश की समाप्ति व अखंड सौभाग्य की प्राप्ति।',
    deityIcon: '🌸',
    elementColor: '#f472b6',
    bgGradient: 'from-[#4a044e] via-[#701a75] to-[#1e1b4b]',
    accentColor: '#f472b6',
    preferredThemeId: 'theme-family-rose',
    tags: ['पार्वती', 'गौरी', 'सौभाग्य', 'मंगल', 'सोमवार'],
    auspiciousOfferingsHi: 'लाल चुनरी, कुमकुम, सुहाग सामग्री, फल व खीर'
  },
  {
    id: 'mantra-mon-shiva-parvati-ardhanarishwar',
    dayKey: 'monday',
    dayNameHi: 'सोमवार',
    dayNameEn: 'Monday',
    deityKey: 'shiva',
    deityNameHi: 'शिव-शक्ति अर्धनारीश्वर',
    deityTitleHi: 'भव भवानी • संसारसारम्',
    mantraTitle: 'शिव-पार्वती संयुक्त कृपा मंत्र (कर्पूरगौरं करुणावतारम्)',
    sanskritMantra: 'कर्पूरगौरं करुणावतारं संसारसारम् भुजगेन्द्रहारम्।\nसदावसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि॥',
    beejaMantra: 'ॐ साम्ब सदाशिवाय नमः',
    meaningHi: 'कपूर के समान उज्ज्वल गौर वर्ण वाले, करुणा के साक्षात अवतार, समस्त संसार के सार, गले में भुजंग की माला धारण करने वाले भगवान शिव, जो माता भवानी सहित मेरे हृदय-कमल में वास करते हैं, उन्हें मेरा नमन है।',
    benefitsHi: 'परिवार में प्रेम, एकता, सुख-शांति तथा ईश्वरीय कृपा का अखंड प्रवाह। हर प्रकार के भय व संकट से मुक्ति।',
    deityIcon: '🕉️',
    elementColor: '#fbbf24',
    bgGradient: 'from-[#172554] via-[#1e1b4b] to-[#020617]',
    accentColor: '#fbbf24',
    preferredThemeId: 'theme-devo-saffron',
    tags: ['कर्पूरगौरं', 'शिवपार्वती', 'कल्याण', 'सोमवार'],
    auspiciousOfferingsHi: 'धूप, दीप, नैवेद्य, चंदन'
  },

  // ==========================================
  // 2. मंगलवार (TUESDAY) - संकटमोचन श्री हनुमान जी
  // ==========================================
  {
    id: 'mantra-tue-hanuman-sankatmochan',
    dayKey: 'tuesday',
    dayNameHi: 'मंगलवार',
    dayNameEn: 'Tuesday',
    deityKey: 'hanuman',
    deityNameHi: 'संकटमोचन श्री हनुमान जी',
    deityTitleHi: 'बजरंगबली • रुद्रावतार • केसरीनंदन',
    mantraTitle: 'हनुमान महा कष्ट निवारण एवं रक्षा मंत्र (शत्रु व संकट नाशक)',
    sanskritMantra: 'मर्कटेश महोत्साह सर्वशोक विनाशक।\nशत्रून् संहर मां रक्ष श्रियं दापय मे प्रभो॥\nॐ हं हनुमते रुद्रात्मकाय हुं फट्॥',
    beejaMantra: 'ॐ हं हनुमते नमः',
    meaningHi: 'हे महा-उत्साही, समस्त शोकों का नाश करने वाले वानरराज श्री हनुमान! आप मेरे समस्त गुप्त व प्रकट शत्रुओं तथा बाधाओं का संहार कर मेरी रक्षा करें और मुझे सुख, यश व ऐश्वर्य प्रदान करें।',
    benefitsHi: 'भय, प्रेत-बाधा, तंत्र-मंत्र, न्यायालयीय विवाद, शत्रु भय एवं असाध्य संकटों से तत्काल रक्षा। अदम्य साहस व विजय की प्राप्ति।',
    deityIcon: '🚩',
    elementColor: '#f97316',
    bgGradient: 'from-[#431407] via-[#7c2d12] to-[#1c1917]',
    accentColor: '#fb923c',
    preferredThemeId: 'theme-career-gold',
    tags: ['हनुमान', 'बजरंगबली', 'संकटनाशक', 'मंगलवार', 'साहस'],
    auspiciousOfferingsHi: 'सिंदूर, चमेली का तेल, बूंदी के लड्डू, लाल लंगोट, तुलसी दल'
  },
  {
    id: 'mantra-tue-hanuman-manojavam',
    dayKey: 'tuesday',
    dayNameHi: 'मंगलवार',
    dayNameEn: 'Tuesday',
    deityKey: 'hanuman',
    deityNameHi: 'श्री हनुमान जी',
    deityTitleHi: 'पवनपुत्र • बुद्धिदाता • मारुति',
    mantraTitle: 'मनोजवं मारुततुल्यवेगं (बुद्धि, बल एवं एकाग्रता प्रदायक)',
    sanskritMantra: 'मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम्।\nवातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये॥',
    beejaMantra: 'ॐ पवननन्दनाय नमः',
    meaningHi: 'मन के समान गति वाले, वायु के समान वेगवान, सभी इंद्रियों को जीतने वाले, बुद्धिमानों में सर्वश्रेष्ठ, पवनपुत्र, वानरों के प्रमुख, प्रभु श्रीराम के परम दूत श्री हनुमान जी के चरणों में मैं शरण लेता हूँ।',
    benefitsHi: 'स्मृति शक्ति, चंचल मन पर नियंत्रण, करियर व परीक्षा में अभूतपूर्व सफलता एवं शारीरिक बल में असीम वृद्धि।',
    deityIcon: '🚩',
    elementColor: '#ea580c',
    bgGradient: 'from-[#581c87] via-[#431407] to-[#020617]',
    accentColor: '#f59e0b',
    preferredThemeId: 'theme-career-gold',
    tags: ['मारुति', 'बुद्धिबल', 'हनुमान', 'मंगलवार', 'विद्या'],
    auspiciousOfferingsHi: 'गुड़-चना, लाल पुष्प, बेसन के लड्डू'
  },
  {
    id: 'mantra-tue-hanuman-chalisa-chopai',
    dayKey: 'tuesday',
    dayNameHi: 'मंगलवार',
    dayNameEn: 'Tuesday',
    deityKey: 'hanuman',
    deityNameHi: 'महाबली हनुमान जी',
    deityTitleHi: 'अंजनीपुत्र • रामदूत • संकटमोचन',
    mantraTitle: 'सिद्ध संकटमोचन चौपाई (संकट कटै मिटै सब पीरा)',
    sanskritMantra: 'संकट कटै मिटै सब पीरा। जो सुमिरै हनुमत बलबीरा॥\nजै जै जै हनुमान गोसाईं। कृपा करहु गुरुदेव की नाईं॥\nभूत पिसाच निकट नहिं आवै। महाबीर जब नाम सुनावै॥',
    beejaMantra: 'ॐ क Operates: श्री हनुमते नमः',
    meaningHi: 'महावीर श्री हनुमान जी का स्मरण करने मात्र से समस्त संकट कट जाते हैं और सभी शारीरिक व मानसिक कष्ट दूर हो जाते हैं। हे प्रभु! गुरुदेव के समान मुझ पर दया दृष्टि बनाए रखें।',
    benefitsHi: 'रोग-शोक, अनिद्रा, बुरे सपने व आकस्मिक संकटों का समूल नाश। घर में सकारात्मक ऊर्जा का अखंड कवच।',
    deityIcon: '🚩',
    elementColor: '#f59e0b',
    bgGradient: 'from-[#7c2d12] via-[#451a03] to-[#0c0a09]',
    accentColor: '#fbbf24',
    preferredThemeId: 'theme-career-gold',
    tags: ['हनुमानचालीसा', 'चौपाई', 'कष्टनिवारण', 'मंगलवार'],
    auspiciousOfferingsHi: 'पान का बीड़ा, इमरती, चमेली का फूल'
  },

  // ==========================================
  // 3. बुधवार (WEDNESDAY) - विघ्नहर्ता श्री गणेश जी एवं माँ दुर्गा
  // ==========================================
  {
    id: 'mantra-wed-ganesha-vakratunda',
    dayKey: 'wednesday',
    dayNameHi: 'बुधवार',
    dayNameEn: 'Wednesday',
    deityKey: 'ganesha',
    deityNameHi: 'प्रथम पूज्य श्री गणेश जी',
    deityTitleHi: 'विघ्नहर्ता • लंबोदर • गजानन',
    mantraTitle: 'वक्रतुण्ड महाकाय विघ्नविनाशक महामंत्र (सर्व कार्य सिद्धि)',
    sanskritMantra: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥\nॐ गं गणपतये नमः॥',
    beejaMantra: 'ॐ गं ॐ ग्लौं ॐ गं गणपतये नमः',
    meaningHi: 'घुमावदार सूंड वाले, विशाल शरीर वाले, करोड़ों सूर्यों के समान दिव्य तेज से चमकने वाले हे देव गणपति! आप सदा मेरे समस्त कार्यों को बिना किसी बाधा के पूर्ण करने की कृपा करें।',
    benefitsHi: 'नए व्यापार, नौकरी, गृह प्रवेश या किसी भी शुभ कार्य में आने वाली समस्त अड़चनों का नाश। बुद्धि, विवेक व धन वृद्धि।',
    deityIcon: '🐘',
    elementColor: '#10b981',
    bgGradient: 'from-[#064e3b] via-[#022c22] to-[#0f172a]',
    accentColor: '#34d399',
    preferredThemeId: 'theme-humanity-emerald',
    tags: ['गणेश', 'विघ्नहर्ता', 'बुधवार', 'कार्यसिद्धि', 'श्रीगणेश'],
    auspiciousOfferingsHi: 'दुर्वा (दूब घास), मोदक, सिंदूर, पीले गेंदे के फूल'
  },
  {
    id: 'mantra-wed-ganesha-gayatri-siddhi',
    dayKey: 'wednesday',
    dayNameHi: 'बुधवार',
    dayNameEn: 'Wednesday',
    deityKey: 'ganesha',
    deityNameHi: 'विघ्नराज गणेश जी',
    deityTitleHi: 'बुद्धि विधाता • एकदंत • सिद्धि विनायक',
    mantraTitle: 'गणेश गायत्री एवं लक्ष्मी-गणेश रिद्धि-सिद्धि मंत्र',
    sanskritMantra: 'ॐ एकदन्ताय विद्महे वक्रतुण्डाय धीमहि तन्नो दन्तिः प्रचोदयात्॥\nॐ श्रीं ह्रीं क्लीं ग्लौं गं गणपतये वर वरद सर्वजनं मे वशमानय स्वाहा॥',
    beejaMantra: 'ॐ श्रीं गं सौम्याय गणपतये नमः',
    meaningHi: 'हम एकदंत वक्रतुण्ड भगवान गणेश का ध्यान करते हैं। वे गजानन हमारी बुद्धि को धर्म, ज्ञान व सफलता के मार्ग पर प्रेरित करें। हे वरदाता प्रभु! समस्त शुभता हमारे जीवन में स्थापित करें।',
    benefitsHi: 'व्यापार में लाभ, कर्ज मुक्ति, आकर्षण, समाज में मान-सम्मान एवं घर में रिद्धि-सिद्धि का स्थायी वास।',
    deityIcon: '🐘',
    elementColor: '#059669',
    bgGradient: 'from-[#065f46] via-[#047857] to-[#022c22]',
    accentColor: '#6ee7b7',
    preferredThemeId: 'theme-humanity-emerald',
    tags: ['गणेशगायत्री', 'रिद्धिसिद्धि', 'बुधवार', 'व्यापार'],
    auspiciousOfferingsHi: 'लड्डू, शमी पत्र, लाल चंदन, सुपारी'
  },
  {
    id: 'mantra-wed-durga-bhayaharini',
    dayKey: 'wednesday',
    dayNameHi: 'बुधवार',
    dayNameEn: 'Wednesday',
    deityKey: 'durga',
    deityNameHi: 'माँ भगवती दुर्गा (नवदुर्गा)',
    deityTitleHi: 'जगदम्बा • महिषासुरमर्दिनी • भवानी',
    mantraTitle: 'नवदुर्गा संकटनाशिनी महामंत्र (दुर्गे स्मृता हरसि भीतिमशेषजन्तोः)',
    sanskritMantra: 'दुर्गे स्मृता हरसि भीतिमशेषजन्तोः\nस्वस्थैः स्मृता मतिमतीव शुभां ददासि।\nदारिद्र्यदुःखभयहारिणी का त्वदन्या\nसर्वोपकारकरणाय सदार्द्रचित्ता॥',
    beejaMantra: 'ॐ दुं दुर्गायै नमः • ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे',
    meaningHi: 'हे माँ दुर्गे! विपत्ति के समय आपका स्मरण करने पर आप समस्त प्राणियों का भय हर लेती हैं। स्वस्थ चित्त वालों को परम शुभ बुद्धि प्रदान करती हैं। आपके अतिरिक्त कौन है जो दरिद्रता, दुःख व भय हरने के लिए सदा दया से परिपूर्ण हृदय रखती हैं!',
    benefitsHi: 'घोर संकट, दरिद्रता, अज्ञात भय, तांत्रिक कुदृष्टि व असाध्य रोगों का नाश। अदम्य आत्मबल व सुख-शांति।',
    deityIcon: '⚔️',
    elementColor: '#ef4444',
    bgGradient: 'from-[#881337] via-[#4c0519] to-[#0f172a]',
    accentColor: '#f87171',
    preferredThemeId: 'theme-royal-maroon',
    tags: ['नवदुर्गा', 'माँदुर्गा', 'कष्टनिवारण', 'बुधवार', 'शुक्रवार'],
    auspiciousOfferingsHi: 'लाल गुड़हल के फूल, लाल चुनरी, बताशा, लौंग का जोड़ा'
  },

  // ==========================================
  // 4. गुरुवार (THURSDAY) - श्री हरि विष्णु, वासुदेव श्रीकृष्ण एवं माँ सरस्वती
  // ==========================================
  {
    id: 'mantra-thu-vishnu-shantakaram',
    dayKey: 'thursday',
    dayNameHi: 'गुरुवार',
    dayNameEn: 'Thursday',
    deityKey: 'vishnu',
    deityNameHi: 'जगत्पालक श्री हरि विष्णु',
    deityTitleHi: 'नारायण • पीताम्बरधारी • लक्ष्मीकांत',
    mantraTitle: 'शांताकारं भुजंगशयनं (विष्णु शांति एवं भवभयहरण महामंत्र)',
    sanskritMantra: 'शांताकारं भुजंगशयनं पद्मनाभं सुरेशं\nविश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम्।\nलक्ष्मीकान्तं कमलनयनं योगिभिर्ध्यानगम्यं\nवन्दे विष्णुं भवभयहरं सर्वलोकैकनाथम्॥',
    beejaMantra: 'ॐ नमो नारायणाय • ॐ विष्णवे नमः',
    meaningHi: 'जिनका स्वरूप परम शांत है, जो शेषनाग पर शयन करते हैं, जिनकी नाभि से कमल प्रस्फुटित है, जो देवताओं के स्वामी और समस्त विश्व के आधार हैं, मेघ के समान श्याम वर्ण वाले, माँ लक्ष्मी के कांत, कमल नयन भगवान विष्णु को हम वंदन करते हैं जो संसार के समस्त भयों को हरने वाले हैं।',
    benefitsHi: 'संसार के समस्त क्लेशों, भयों व चिंताओं का हरण। घर में लक्ष्मी जी का स्थायी वास, मोक्ष, सुख व अखंड शांति।',
    deityIcon: '🪷',
    elementColor: '#eab308',
    bgGradient: 'from-[#422006] via-[#713f12] to-[#1c1917]',
    accentColor: '#facc15',
    preferredThemeId: 'theme-career-gold',
    tags: ['विष्णु', 'शांताकारं', 'नारायण', 'गुरुवार', 'शांति'],
    auspiciousOfferingsHi: 'पीले फूल, पीले वस्त्र, तुलसी मंजरी, चने की दाल व गुड़'
  },
  {
    id: 'mantra-thu-krishna-vasudeva',
    dayKey: 'thursday',
    dayNameHi: 'गुरुवार',
    dayNameEn: 'Thursday',
    deityKey: 'krishna',
    deityNameHi: 'भगवान वासुदेव श्रीकृष्ण',
    deityTitleHi: 'गोविंद • द्वारकाधीश • क्लेशनाशक',
    mantraTitle: 'वासुदेव द्वादशाक्षर एवं क्लेशनाशक कृष्ण मंत्र',
    sanskritMantra: 'ॐ नमो भगवते वासुदेवाय॥\nकृष्णाय वासुदेवाय हरये परमात्मने।\nप्रणतक्लेशनाशाय गोविंदाय नमो नमः॥\nहरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे।\nहरे राम हरे राम राम राम हरे हरे॥',
    beejaMantra: 'ॐ क्लीं कृष्णाय नमः',
    meaningHi: 'परमात्मा रूपी वासुदेव पुत्र श्रीकृष्ण, जो शरणागत भक्तों के समस्त क्लेशों व दुखों का नाश करने वाले हैं, उन परम करुणामय गोविंद को हमारा बारंबार नमन है।',
    benefitsHi: 'कर्म बंधन, ग्रह दोष, मानसिक तनाव, डिप्रेशन व पारिवारिक क्लेशों से मुक्ति। जीवन में सकारात्मक ऊर्जा व प्रेम का उदय।',
    deityIcon: '🦚',
    elementColor: '#38bdf8',
    bgGradient: 'from-[#1e1b4b] via-[#312e81] to-[#0f172a]',
    accentColor: '#67e8f9',
    preferredThemeId: 'theme-devo-saffron',
    tags: ['वासुदेव', 'श्रीकृष्ण', 'महामंत्र', 'गुरुवार', 'क्लेशनाशक'],
    auspiciousOfferingsHi: 'माखन-मिश्री, तुलसी दल, मोरपंख, पंचामृत'
  },
  {
    id: 'mantra-thu-saraswati-vidya',
    dayKey: 'thursday',
    dayNameHi: 'गुरुवार',
    dayNameEn: 'Thursday',
    deityKey: 'saraswati',
    deityNameHi: 'विद्या एवं वाणी दात्री माँ सरस्वती',
    deityTitleHi: 'वीणावादिनी • वाग्देवी • हंसवाहिनी',
    mantraTitle: 'माँ सरस्वती ज्ञान, बुद्धि एवं वाक्-सिद्धि महामंत्र',
    sanskritMantra: 'सरस्वती नमस्तुभ्यं वरदे कामरूपिणी।\nविद्यारम्भं करिष्यामि सिद्धिर्भवतु मे सदा॥\nॐ ऐं वाग्देव्यै च विद्महे कामराजाय धीमहि तन्नो देवी प्रचोदयात्॥',
    beejaMantra: 'ॐ ऐं सरस्वत्यै नमः',
    meaningHi: 'हे वरदायिनी, इच्छित फल देने वाली ज्ञान दायिनी माँ सरस्वती! आपको मेरा नमन। मैं अपनी विद्या व ज्ञान की साधना आरंभ करता हूँ, आप मुझे सदा सफलता व सिद्धि प्रदान करें।',
    benefitsHi: 'विद्यार्थियों व साधकों के लिए वरदान। स्मृति दोष निवारण, भाषण कला, संगीत-साहित्य में सिद्धि एवं बौद्धिक प्रखरता।',
    deityIcon: '🪕',
    elementColor: '#fef08a',
    bgGradient: 'from-[#78350f] via-[#451a03] to-[#020617]',
    accentColor: '#fef08a',
    preferredThemeId: 'theme-edu-wisdom',
    tags: ['सरस्वती', 'विद्या', 'ज्ञान', 'गुरुवार', 'वाग्देवी'],
    auspiciousOfferingsHi: 'श्वेत चंदन, श्वेत पुष्प, कलम-पुस्तिका, पीले फल'
  },

  // ==========================================
  // 5. शुक्रवार (FRIDAY) - धनदात्री माँ महालक्ष्मी एवं नवदुर्गा
  // ==========================================
  {
    id: 'mantra-fri-lakshmi-kanakadhara',
    dayKey: 'friday',
    dayNameHi: 'शुक्रवार',
    dayNameEn: 'Friday',
    deityKey: 'lakshmi',
    deityNameHi: 'धनदात्री माँ महालक्ष्मी',
    deityTitleHi: 'अष्टलक्ष्मी • कमलासना • विष्णुप्रिया',
    mantraTitle: 'महालक्ष्मी अष्टलक्ष्मी महामंत्र (दारिद्र्य नाश व अखंड धन-धान्य)',
    sanskritMantra: 'ॐ श्रीं ह्रीं क्लीं श्रीं सिद्धलक्ष्म्यै नमः॥\nॐ महालक्ष्म्यै च विद्महे विष्णुपत्न्यै च धीमहि\nतन्नो लक्ष्मीः प्रचोदयात्॥\nनमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते।\nशङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते॥',
    beejaMantra: 'ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद श्रीं ह्रीं श्रीं ॐ महालक्ष्म्यै नमः',
    meaningHi: 'हे श्रीपीठ पर विराजमान, देवताओं द्वारा पूजित, शंख-चक्र-गदा धारण करने वाली महामाया विष्णुपत्नी माँ महालक्ष्मी! आपको हमारा बारंबार नमन है। आप हमारे जीवन में प्रसन्न होकर दारिद्र्य का नाश करें।',
    benefitsHi: 'कर्ज मुक्ति, व्यापारिक मंदी का अंत, घर में धन-धान्य, वैभव व सुख-समृद्धि का स्थायी वास। दरिद्रता का समूल विनाश।',
    deityIcon: '🪙',
    elementColor: '#fbbf24',
    bgGradient: 'from-[#701a75] via-[#4a044e] to-[#0f172a]',
    accentColor: '#fde047',
    preferredThemeId: 'theme-royal-maroon',
    tags: ['महालक्ष्मी', 'धनधान्य', 'शुक्रवार', 'अष्टलक्ष्मी', 'वैभव'],
    auspiciousOfferingsHi: 'कमल पुष्प, खीर, इत्र, कौड़ी, बताशा, लाल चुनरी'
  },
  {
    id: 'mantra-fri-durga-sarvabadha',
    dayKey: 'friday',
    dayNameHi: 'शुक्रवार',
    dayNameEn: 'Friday',
    deityKey: 'durga',
    deityNameHi: 'माँ दुर्गा जगदम्बा (नवदुर्गा)',
    deityTitleHi: 'सिंहवाहिनी • सर्वबाधाविनाशक • चंडिका',
    mantraTitle: 'सर्वबाधा विनिर्मुक्तो दुर्गा महामंत्र (असाध्य कष्ट व जीवन रक्षा)',
    sanskritMantra: 'सर्वबाधाविनिर्मुक्तो धनधान्यसुतान्वितः।\nमनुष्यो मत्प्रसादेन भविष्यति न संशयः॥\nॐ जयंती मंगला काली भद्रकाली कपालिनी।\nदुर्गा क्षमा शिवा धात्री स्वाहा स्वधा नमोऽस्तु ते॥',
    beejaMantra: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे',
    meaningHi: 'मेरी कृपा से मनुष्य समस्त बाधाओं व संकटों से मुक्त होकर धन, धान्य व संतान से सम्पन्न होता है, इसमें कोई संशय नहीं है। हे जयंती, मंगला, काली, भद्रकाली, दुर्गा और शिवा! आपको हमारा नमन है।',
    benefitsHi: 'जीवन के असाध्य से असाध्य संकट, अज्ञात शत्रु, ऊपरी बाधाएं, आर्थिक तंगी व गंभीर रोगों का अंत। विजय व रक्षा कवच।',
    deityIcon: '⚔️',
    elementColor: '#f43f5e',
    bgGradient: 'from-[#4c0519] via-[#881337] to-[#1e1b4b]',
    accentColor: '#fb7185',
    preferredThemeId: 'theme-royal-maroon',
    tags: ['नवदुर्गा', 'सर्वबाधा', 'शुक्रवार', 'महालक्ष्मी', 'विजय'],
    auspiciousOfferingsHi: 'श्रृंगार सामग्री, नारियल, लाल पुष्प, हलवा-पूरी'
  },

  // ==========================================
  // 6. शनिवार (SATURDAY) - कर्मफलदाता शनि देव एवं श्री हनुमान जी
  // ==========================================
  {
    id: 'mantra-sat-shani-peeda-haran',
    dayKey: 'saturday',
    dayNameHi: 'शनिवार',
    dayNameEn: 'Saturday',
    deityKey: 'shani',
    deityNameHi: 'कर्मफलदाता न्यायप्रिय शनि देव',
    deityTitleHi: 'सूर्यपुत्र • शनैश्चर • न्यायधीश',
    mantraTitle: 'शनि देव महा कष्ट निवारण मंत्र (साढ़ेसाती, ढैय्या व ग्रह पीड़ा शांति)',
    sanskritMantra: 'ॐ नीलांजन समाभासं रविपुत्रं यमाग्रजम।\nछायामार्तंड संभूतं तं नमामि शनैश्चरम्॥\nॐ शं शनैश्चराय नमः॥\nसूर्यपुत्रो दीर्घदेहो विशालाक्षः शिवप्रियः।\nमन्दचारः प्रसन्नात्मा पीडां हरतु मे शनिः॥',
    beejaMantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
    meaningHi: 'नीले अंजन के समान कांति वाले, सूर्य के पुत्र, यमराज के बड़े भाई, माता छाया और सूर्य से उत्पन्न, उन शनैश्चर देव को हम नमन करते हैं। हे शिवप्रिय भगवान शनि! आप प्रसन्न होकर मेरी समस्त पीड़ाओं का हरण करें।',
    benefitsHi: 'शनि की साढ़ेसाती, ढैय्या, दुर्घटना भय, अकारण विलंब, व्यापार हानि व मानसिक कष्टों का शमन। जीवन में न्याय, धैर्य व स्थायित्व।',
    deityIcon: '⚖️',
    elementColor: '#6366f1',
    bgGradient: 'from-[#1e1b4b] via-[#0f172a] to-[#020617]',
    accentColor: '#818cf8',
    preferredThemeId: 'theme-royal-maroon',
    tags: ['शनिदेव', 'साढ़ेसाती', 'शनिवार', 'न्याय', 'कष्टनिवारण'],
    auspiciousOfferingsHi: 'सरसों का तेल, काले तिल, उड़द की दाल, काला कपड़ा, लोहे की कील'
  },
  {
    id: 'mantra-sat-hanuman-shani-raksha',
    dayKey: 'saturday',
    dayNameHi: 'शनिवार',
    dayNameEn: 'Saturday',
    deityKey: 'hanuman',
    deityNameHi: 'शनि कष्टहर्ता हनुमान जी',
    deityTitleHi: 'अंजनीसुत • शनि रक्षक • महावीर',
    mantraTitle: 'हनुमान-शनि अभय रक्षा कवच (समस्त शनि दोष व संकट नाश)',
    sanskritMantra: 'ॐ नमो भगवते आंजनेयाय महाबलाय स्वाहा॥\nप्रनवउँ पवनकुमार खल बन पावक ग्यानघन।\nजासु हृदय आगार बसहिं राम सर चाप धर॥\nअतुलितबलधामं हेमशैलाभदेहं\nदनुजवनकृशानुं ज्ञानिनामग्रगण्यम्।\nसकलगुणनिधानं वानराणामधीशं\nरघुपतिप्रियभक्तं वातजातं नमामि॥',
    beejaMantra: 'ॐ ऐं भ्रीम हनुमते रामदूताय नमः',
    meaningHi: 'अतुलनीय बल के धाम, सुमेरु पर्वत जैसे तेजस्वी शरीर वाले, ज्ञानियों में अग्रगण्य, समस्त गुणों के निधान, श्री रघुनाथ जी के परम प्रिय भक्त पवनपुत्र श्री हनुमान जी को हम नमन करते हैं।',
    benefitsHi: 'शनि देव के प्रकोप से संपूर्ण अभयदान। शत्रु, तंत्र-बाधा, दुर्घटना व आकस्मिक संकटों से अचूक सुरक्षा।',
    deityIcon: '🚩',
    elementColor: '#f97316',
    bgGradient: 'from-[#312e81] via-[#431407] to-[#020617]',
    accentColor: '#fb923c',
    preferredThemeId: 'theme-career-gold',
    tags: ['शनिवार', 'हनुमान', 'शनिरक्षा', 'महाबली'],
    auspiciousOfferingsHi: 'सिंदूर, चमेली का तेल, काले चने, मीठा पान'
  },
  {
    id: 'mantra-sat-dasharatha-shani-stotra',
    dayKey: 'saturday',
    dayNameHi: 'शनिवार',
    dayNameEn: 'Saturday',
    deityKey: 'shani',
    deityNameHi: 'शनि देव महाराज',
    deityTitleHi: 'दशरथकृत • छायासुत • सौरये',
    mantraTitle: 'दशरथ कृत सिद्ध शनि स्तोत्र सार (अमोघ संकट मोचन)',
    sanskritMantra: 'नमस्ते कोणसंस्थाय पिंगलाय नमोऽस्तु ते।\nनमस्ते बभ्रुरूपाय कृष्णाय च नमोऽस्तु ते॥\nनमस्ते रौद्रदेहाय नमस्ते चान्तकाय च।\nनमस्ते यमसंज्ञाय नमस्ते सौरये विभो॥\nप्रसादं कुरु मे देव दीनस्य प्रणतस्य च॥',
    beejaMantra: 'ॐ शं शनैश्चराय नमः',
    meaningHi: 'हे पिंगल वर्ण, हे कृष्ण वर्ण, हे रौद्र रूपी, हे सूर्यपुत्र शनि देव! मुझ दीन शरणागत पर प्रसन्न होकर अपनी अमृतमयी दृष्टि रखें और मेरी समस्त व्याधियों का शमन करें।',
    benefitsHi: 'अकाल संकट, आर्थिक संकट, अज्ञात भय और कठिन परिस्थितियों से तत्काल सुरक्षा व राहत।',
    deityIcon: '⚖️',
    elementColor: '#4f46e5',
    bgGradient: 'from-[#0f172a] via-[#1e1b4b] to-[#000000]',
    accentColor: '#a5b4fc',
    preferredThemeId: 'theme-royal-maroon',
    tags: ['दशरथस्तोत्र', 'शनिदेव', 'शनिवार', 'कष्टनिवारण'],
    auspiciousOfferingsHi: 'पीपल के वृक्ष के नीचे सरसों तेल का दीपक, काला तिल'
  },

  // ==========================================
  // 7. रविवार (SUNDAY) - भगवान सूर्य नारायण एवं वेदमाता गायत्री
  // ==========================================
  {
    id: 'mantra-sun-gayatri-mahamantra',
    dayKey: 'sunday',
    dayNameHi: 'रविवार',
    dayNameEn: 'Sunday',
    deityKey: 'gayatri',
    deityNameHi: 'वेदमाता गायत्री देवी',
    deityTitleHi: 'ब्रह्मस्वरूपिणी • सवितुर्वरेण्यं • ज्ञानजननी',
    mantraTitle: 'परम पवित्र गायत्री महामंत्र (सद्बुद्धि, पाप नाश व आत्मतेज)',
    sanskritMantra: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं\nभर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥\nॐ ब्रह्मस्वरूपिण्यै नमः॥',
    beejaMantra: 'ॐ भूर्भुवः स्वः • ॐ ऐं ह्रीं क्लीं गायत्री देव्यै नमः',
    meaningHi: 'उस प्राणस्वरूप, दुःखनाशक, सुखस्वरूप, श्रेष्ठ, तेजस्वी, पापनाशक, देवस्वरूप परमात्मा का हम ध्यान करते हैं। वह परमात्मा हमारी बुद्धि को सन्मार्ग की ओर प्रेरित करे।',
    benefitsHi: 'समस्त वेदों का सार। नकारात्मक ऊर्जा का पूर्ण नाश, मानसिक शांति, एकाग्रता, आत्मबल व आत्मसाक्षात्कार की सिद्धि।',
    deityIcon: '🪔',
    elementColor: '#f59e0b',
    bgGradient: 'from-[#451a03] via-[#78350f] to-[#020617]',
    accentColor: '#fde047',
    preferredThemeId: 'theme-edu-wisdom',
    tags: ['गायत्री', 'महामंत्र', 'रविवार', 'सद्बुद्धि', 'सकारात्मकऊर्जा'],
    auspiciousOfferingsHi: 'पीले पुष्प, केसर, गाय का घी का दीपक, अक्षत'
  },
  {
    id: 'mantra-sun-surya-aarogya',
    dayKey: 'sunday',
    dayNameHi: 'रविवार',
    dayNameEn: 'Sunday',
    deityKey: 'surya',
    deityNameHi: 'प्रत्यक्ष देवता भगवान सूर्य नारायण',
    deityTitleHi: 'दिवाकर • भाष्कर • आदित्य',
    mantraTitle: 'सूर्य देव आरोग्य, तेज एवं यश प्रदायिनी महामंत्र',
    sanskritMantra: 'ॐ सूर्याय नमः • ॐ घृणिः सूर्य आदित्यः॥\nजपाकूसुम संकाशं काश्यपेयं महाद्युतिम।\nतमोऽरिं सर्वपापघ्नं प्रणतोऽस्मि दिवाकरम्॥\nॐ आदित्याय विद्महे भास्कराय धीमहि तन्नो भानुः प्रचोदयात्॥',
    beejaMantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
    meaningHi: 'जपाकुसुम (गुड़हल) के फूल के समान कांति वाले, महर्षि कश्यप के तेजस्वी पुत्र, अंधकार के शत्रु, समस्त पापों का नाश करने वाले प्रत्यक्ष देव भगवान दिवाकर को मेरा प्रणाम है।',
    benefitsHi: 'नेत्र रोग व असाध्य शारीरिक व्याधियों से मुक्ति, चेहरे पर दिव्य तेज, मान-सम्मान, पद-प्रतिष्ठा व उच्च सरकारी पद की प्राप्ति।',
    deityIcon: '☀️',
    elementColor: '#ea580c',
    bgGradient: 'from-[#7c2d12] via-[#9a3412] to-[#1c1917]',
    accentColor: '#fdba74',
    preferredThemeId: 'theme-career-gold',
    tags: ['सूर्यदेव', 'आरोग्य', 'रविवार', 'तेज', 'आदित्य'],
    auspiciousOfferingsHi: 'तांबे के लोटे में जल, लाल पुष्प, रोली, गुड़, अक्षत'
  },
  {
    id: 'mantra-sun-aditya-hridaya-stotra',
    dayKey: 'sunday',
    dayNameHi: 'रविवार',
    dayNameEn: 'Sunday',
    deityKey: 'surya',
    deityNameHi: 'भगवान भुवनभास्कर सूर्य देव',
    deityTitleHi: 'सर्वशत्रुविनाशक • विजयदाता • सविता',
    mantraTitle: 'आदित्य हृदय स्तोत्र सिद्ध महामंत्र (सर्वशत्रु संहारक व विजयदाता)',
    sanskritMantra: 'आदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम्।\nजयावहं जपेन्नित्यमक्षयं परमं शिवम्॥\nॐ भानवे नमः, ॐ रवये नमः, ॐ खगाय नमः॥\nॐ सर्वकल्याणप्रदाय सूर्याय नमः॥',
    beejaMantra: 'ॐ ॐ ॐ सूर्याय नमः',
    meaningHi: 'आदित्य हृदय स्तोत्र अत्यंत पवित्र, समस्त शत्रुओं का नाश करने वाला, सदा विजय दिलाने वाला तथा अक्षय और परम कल्याणकारी है। भगवान सूर्य का यह स्मरण व्यक्ति को अजेय बनाता है।',
    benefitsHi: 'डिप्रेशन, हताशा, असफलता के दौर से मुक्ति। कार्यक्षेत्र में अजेय विजय, सरकारी कार्यों में सफलता और आत्मविश्वास में असीम वृद्धि।',
    deityIcon: '☀️',
    elementColor: '#f97316',
    bgGradient: 'from-[#78350f] via-[#431407] to-[#0c0a09]',
    accentColor: '#fed7aa',
    preferredThemeId: 'theme-career-gold',
    tags: ['आदित्यहृदय', 'विजय', 'रविवार', 'शत्रुनाशक'],
    auspiciousOfferingsHi: 'सूर्य नमस्कार, लाल चंदन, अर्घ्य जल'
  }
];

/**
 * Get current day of the week key (e.g. 'monday', 'tuesday', etc.)
 */
export function getCurrentDayOfWeekKey(): DayOfWeekKey {
  const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  switch (dayIndex) {
    case 0:
      return 'sunday';
    case 1:
      return 'monday';
    case 2:
      return 'tuesday';
    case 3:
      return 'wednesday';
    case 4:
      return 'thursday';
    case 5:
      return 'friday';
    case 6:
      return 'saturday';
    default:
      return 'monday';
  }
}
