// ============================================================================
// JEEVAN JYOTI FOUNDATION - NGO MEMBERSHIP TYPES & PLANS
// जीवन ज्योति फाउंडेशन - आधिकारिक सदस्यता मॉडल, श्रेणियां व शुल्क विवरण
// ============================================================================

export type MembershipType =
  | 'life'         // आजीवन सदस्यता (Life Member)
  | 'patron'       // संरक्षक / मानद सदस्यता (Patron / Honorary)
  | 'executive'    // कार्यकारिणी / विशिष्ट सदस्यता (Executive Associate)
  | 'annual'       // वार्षिक / सक्रिय सदस्यता (Annual Active Member)
  | 'youth';       // युवा / छात्र सदस्यता (Youth / Student)

export interface NgoMembershipPlan {
  id: MembershipType;
  titleHindi: string;
  titleEnglish: string;
  badgeHindi: string;
  badgeEnglish: string;
  amount: number;
  validityHindi: string;
  validityEnglish: string;
  popular?: boolean;
  color: string;
  accentBg: string;
  borderClass: string;
  descriptionHindi: string;
  benefits: string[];
}

export interface NgoMemberRecord {
  id: string; // Official Membership ID (assigned upon approval, e.g. JJF-MEM-2026-001)
  applicationNo: string; // Application Tracker ID (e.g. JJF-MEM-APP-2026-8941)
  membershipType: MembershipType;
  planNameHindi: string;
  planNameEnglish: string;
  
  // Personal Details
  fullName: string;
  fatherOrHusbandName: string;
  relationType: 'Father' | 'Husband' | 'Guardian';
  gender: 'male' | 'female' | 'other';
  dob: string;
  age?: number;
  phone: string; // 10 Digits - Primary retrieval key
  whatsappNumber?: string;
  email?: string;
  bloodGroup?: string;
  occupation: string;
  
  // Residential Address
  address: string;
  district: string;
  state: string;
  pincode: string;
  block?: string;
  wardOrVillage?: string;
  
  // Verification Proof & Photo
  idProofType: 'aadhaar' | 'voter_id' | 'pan' | 'driving_license';
  idProofNumber?: string;
  photoUrl?: string;
  
  // Payment Details
  paymentAmount: number;
  paymentMode: 'upi_qr' | 'online' | 'bank_transfer' | 'cash';
  transactionRef: string; // UTR Number / Reference
  paymentScreenshotUrl?: string;
  paymentDate: string;
  
  // Approval Workflow
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  
  // Validity & Certificate
  validFrom?: string;
  validTill?: string; // Date or 'आजीवन (Lifetime)'
  certificateIssued?: boolean;
  certificateNumber?: string; // e.g. JJF/MEM-CERT/2026/001
}

export const OFFICIAL_MEMBERSHIP_PLANS: NgoMembershipPlan[] = [
  {
    id: 'life',
    titleHindi: 'आजीवन सदस्यता',
    titleEnglish: 'Life Membership',
    badgeHindi: 'आजीवन सदस्य',
    badgeEnglish: 'Life Member',
    amount: 5100,
    validityHindi: 'आजीवन (Lifetime)',
    validityEnglish: 'Lifetime',
    popular: true,
    color: '#8B0000',
    accentBg: 'bg-amber-50',
    borderClass: 'border-amber-400 ring-2 ring-amber-300',
    descriptionHindi: 'संस्था की स्थाई आजीवन सदस्यता। आम सभा (General Body) में स्थायी भागीदारी व विशेष सम्मान।',
    benefits: [
      'संस्था का अधिकृत आजीवन सदस्यता प्रमाण पत्र (A4 लेटरहेड)',
      'डिजिटल आजीवन सदस्य पहचान पत्र (Life Member ID Card)',
      'वार्षिक आम सभा (AGM) में मत एवं विचार रखने का अधिकार',
      'संस्था के सभी सार्वजनिक व राष्ट्रीय आयोजनों में वीआईपी आमंत्रण',
      'आयकर धारा 80G के अंतर्गत दान रसीद एवं आयकर छूट लाभ',
      'संस्था की वेबसाइट पर विशेष आजीवन सदस्य नामावली में स्थान'
    ]
  },
  {
    id: 'patron',
    titleHindi: 'संरक्षक / मानद सदस्यता',
    titleEnglish: 'Patron Membership',
    badgeHindi: 'मुख्य संरक्षक',
    badgeEnglish: 'Chief Patron',
    amount: 11000,
    validityHindi: 'आजीवन (Lifetime)',
    validityEnglish: 'Lifetime',
    popular: false,
    color: '#3F2B96',
    accentBg: 'bg-purple-50',
    borderClass: 'border-purple-300',
    descriptionHindi: 'संस्था के सर्वोच्च मार्गदर्शक मंडल का हिस्सा बनें। नीति निर्धारण व समाज सेवा में विशिष्ट योगदान।',
    benefits: [
      'संस्था का सर्वोच्च रॉयल संरक्षक सदस्यता प्रमाण पत्र (Letterhead)',
      'विशेष स्वर्ण स्मृति चिन्ह एवं संस्थागत सम्मान पत्र',
      'संस्था के प्रमुख प्रकल्पों व अभियानों में विशेष मार्गदर्शक भूमिका',
      'वार्षिक रिपोर्ट व स्मारिका में संरक्षक संदेश व चित्र का प्रकाशन',
      '80G टैक्स छूट रसीद एवं डिजिटल पहचान पत्र'
    ]
  },
  {
    id: 'executive',
    titleHindi: 'कार्यकारिणी / विशिष्ट सदस्यता',
    titleEnglish: 'Executive Associate',
    badgeHindi: 'विशिष्ट सहयोगी',
    badgeEnglish: 'Executive Associate',
    amount: 2500,
    validityHindi: '1 वर्ष (वार्षिक नवीकरणीय)',
    validityEnglish: '1 Year (Renewable)',
    popular: false,
    color: '#0D9488',
    accentBg: 'bg-teal-50',
    borderClass: 'border-teal-300',
    descriptionHindi: 'सेवा प्रकल्पों के जमीनी क्रियान्वयन व सामाजिक अभियानों के संचालन में सक्रिय भूमिका।',
    benefits: [
      'विशिष्ट कार्यकारिणी सदस्य प्रमाण पत्र व पहचान पत्र',
      'ब्लाक व जिला स्तरीय सेवा प्रकल्पों में नेतृत्वकारी दायित्व',
      'संस्था के मासिक समीक्षा सत्रों एवं कार्यशालाओं में भागीदारी',
      '80G टैक्स छूट रसीद एवं आधिकारिक अनुशंसा पत्र'
    ]
  },
  {
    id: 'annual',
    titleHindi: 'साधारण / वार्षिक सदस्यता',
    titleEnglish: 'Annual Membership',
    badgeHindi: 'वार्षिक सदस्य',
    badgeEnglish: 'Annual Member',
    amount: 1100,
    validityHindi: '1 वर्ष (वार्षिक)',
    validityEnglish: '1 Year',
    popular: false,
    color: '#B45309',
    accentBg: 'bg-orange-50',
    borderClass: 'border-orange-300',
    descriptionHindi: 'प्रतिवर्ष संस्था के सेवा संकल्पों से जुड़ें। नियमित सामाजिक अभियानों में सीधा सहयोग।',
    benefits: [
      'आधिकारिक वार्षिक सदस्यता प्रमाण पत्र (A4 Letterhead)',
      'डिजिटल सदस्य पहचान पत्र (Valid for 1 Year)',
      'निःशुल्क स्वास्थ्य, शिक्षा व वृक्षारोपण अभियानों में सहभागिता',
      'आयकर 80G दान रसीद'
    ]
  },
  {
    id: 'youth',
    titleHindi: 'युवा / छात्र सदस्यता',
    titleEnglish: 'Youth / Student Membership',
    badgeHindi: 'युवा सदस्य',
    badgeEnglish: 'Youth Member',
    amount: 501,
    validityHindi: '1 वर्ष (रियायती)',
    validityEnglish: '1 Year (Subsidized)',
    popular: false,
    color: '#15803D',
    accentBg: 'bg-emerald-50',
    borderClass: 'border-emerald-300',
    descriptionHindi: 'विद्यार्थियों व 25 वर्ष तक के युवाओं हेतु विशेष रियायती सदस्यता। राष्ट्र-सेवा व कौशल विकास।',
    benefits: [
      'युवा समाज सेवक सदस्यता प्रमाण पत्र',
      'समाज सेवा अनुभव पत्र (Social Work Experience Certificate)',
      'व्यक्तित्व विकास व सांध्यकालीन पाठशालाओं में शिक्षण का अवसर',
      'डिजिटल युवा सदस्य आई-कार्ड'
    ]
  }
];
