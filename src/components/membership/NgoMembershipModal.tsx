// ============================================================================
// JEEVAN JYOTI FOUNDATION - NGO MEMBERSHIP MODAL & PORTAL
// जीवन ज्योति फाउंडेशन - आधिकारिक सदस्यता पोर्टल (आवेदन, भुगतान व प्रमाण पत्र डाउनलोड)
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  Crown,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  QrCode,
  Download,
  Search,
  Phone,
  User,
  MapPin,
  FileText,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Printer,
  Share2,
  Clock,
  Briefcase,
  Users,
  Camera,
  Upload
} from 'lucide-react';
import {
  MembershipType,
  NgoMembershipPlan,
  NgoMemberRecord,
  OFFICIAL_MEMBERSHIP_PLANS
} from '../../types/membership';
import {
  applyForMembership,
  getMembersByPhone,
  normalizeMemberPhone,
  getAllMembers
} from '../../services/membershipService';
import { FOUNDATION_INFO } from '../../data/foundationData';
import { CandidatePhotoUploader } from '../CandidatePhotoUploader';
import { BrandLogo } from '../common/BrandLogo';
import { MembershipLetterheadCertificate } from './MembershipLetterheadCertificate';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

interface NgoMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'plans' | 'payment' | 'download';
  initialPhone?: string;
}

export const NgoMembershipModal: React.FC<NgoMembershipModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'plans',
  initialPhone = ''
}) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'payment' | 'download'>(initialTab);

  // Selected Membership Plan
  const [selectedPlanId, setSelectedPlanId] = useState<MembershipType>('life');
  const selectedPlan =
    OFFICIAL_MEMBERSHIP_PLANS.find((p) => p.id === selectedPlanId) || OFFICIAL_MEMBERSHIP_PLANS[0];

  // 1. Form Application State
  const [fullName, setFullName] = useState<string>('');
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState<string>('');
  const [relationType, setRelationType] = useState<'Father' | 'Husband' | 'Guardian'>('Father');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [dob, setDob] = useState<string>('');
  const [phone, setPhone] = useState<string>(initialPhone);
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [bloodGroup, setBloodGroup] = useState<string>('B+');
  const [occupation, setOccupation] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [district, setDistrict] = useState<string>('ग़ाज़ीपुर');
  const [state, setState] = useState<string>('उत्तर प्रदेश');
  const [pincode, setPincode] = useState<string>('233303');
  const [block, setBlock] = useState<string>('मोहम्मदाबाद');
  const [wardOrVillage, setWardOrVillage] = useState<string>('दाउदपुर');
  const [idProofType, setIdProofType] = useState<'aadhaar' | 'voter_id' | 'pan' | 'driving_license'>('aadhaar');
  const [idProofNumber, setIdProofNumber] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [agreedToBylaws, setAgreedToBylaws] = useState<boolean>(true);

  // 2. Payment & Application Tracker State
  const [paymentMode, setPaymentMode] = useState<'upi_qr' | 'online' | 'bank_transfer' | 'cash'>('upi_qr');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedApplication, setSubmittedApplication] = useState<NgoMemberRecord | null>(null);

  // 3. Search & Certificate Download State
  const [searchPhone, setSearchPhone] = useState<string>(initialPhone);
  const [searchedMembers, setSearchedMembers] = useState<NgoMemberRecord[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedMemberForCertificate, setSelectedMemberForCertificate] = useState<NgoMemberRecord | null>(null);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  useEffect(() => {
    setActiveTab(initialTab);
    if (initialPhone) {
      setPhone(initialPhone);
      setSearchPhone(initialPhone);
      handleSearchByPhone(initialPhone);
    }
  }, [initialTab, initialPhone]);

  if (!isOpen) return null;

  // Handle Form Submit -> Switch to Payment Step
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('कृपया अपना पूरा नाम दर्ज करें!');
      return;
    }
    if (!fatherOrHusbandName.trim()) {
      toast.error('कृपया पिता / पति का नाम दर्ज करें!');
      return;
    }
    const cleanPhone = normalizeMemberPhone(phone);
    if (!cleanPhone || cleanPhone.length !== 10) {
      toast.error('कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें!');
      return;
    }
    if (!address.trim()) {
      toast.error('कृपया अपना स्थायी पता दर्ज करें!');
      return;
    }
    if (!agreedToBylaws) {
      toast.error('कृपया संस्था के नियमों और उपनियमों की सहमति स्वीकार करें!');
      return;
    }

    // Switch tab to Payment
    setActiveTab('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.success(`सदस्यता शुल्क ₹${selectedPlan.amount.toLocaleString('en-IN')} के भुगतान हेतु आगे बढ़ें।`);
  };

  // Handle Final Payment Submission
  const handleFinalSubmitWithPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      toast.error('कृपया UPI UTR संख्या अथवा बैंक ट्रांजेक्शन रेफरेंस दर्ज करें!');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('सदस्यता आवेदन व भुगतान विवरण सुरक्षित किया जा रहा है...');

    try {
      const newMember = await applyForMembership({
        membershipType: selectedPlanId,
        planNameHindi: selectedPlan.titleHindi,
        planNameEnglish: selectedPlan.titleEnglish,
        fullName: fullName.trim(),
        fatherOrHusbandName: fatherOrHusbandName.trim(),
        relationType,
        gender,
        dob: dob || '1995-01-01',
        phone: normalizeMemberPhone(phone),
        whatsappNumber: whatsappNumber ? normalizeMemberPhone(whatsappNumber) : normalizeMemberPhone(phone),
        email: email.trim(),
        bloodGroup,
        occupation: occupation.trim() || 'समाजसेवा',
        address: address.trim(),
        district: district.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        block: block.trim(),
        wardOrVillage: wardOrVillage.trim(),
        idProofType,
        idProofNumber: idProofNumber.trim(),
        photoUrl: photoUrl || '/manager_secretary.webp',
        paymentAmount: selectedPlan.amount,
        paymentMode,
        transactionRef: transactionRef.trim(),
        paymentScreenshotUrl,
        paymentDate: new Date().toISOString().split('T')[0]
      });

      setSubmittedApplication(newMember);
      toast.success('🎉 सदस्यता आवेदन सफलतापूर्वक सबमिट हो गया! एडमिन अनुमोदन के उपरांत प्रमाण पत्र जारी होगा।', {
        id: toastId,
        duration: 6000
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'आवेदन सबमिट करने में त्रुटि आई।', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Search Members by Phone Number for Certificate Download
  const handleSearchByPhone = (phoneQuery?: string) => {
    const q = normalizeMemberPhone(phoneQuery || searchPhone);
    if (!q || q.length !== 10) {
      toast.error('कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें!');
      return;
    }
    const found = getMembersByPhone(q);
    setSearchedMembers(found);
    setHasSearched(true);
    if (found.length === 0) {
      toast.error('इस मोबाइल नंबर से कोई सदस्यता आवेदन या प्रमाण पत्र नहीं मिला।');
    } else {
      toast.success(`${found.length} सदस्यता रिकॉर्ड प्राप्त हुए!`);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(FOUNDATION_INFO.upiId || 'jeevanjyoti.gzp@sbi');
    setCopiedUpi(true);
    toast.success('UPI ID कॉपी हो गई!');
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Quick UPI payment URI for QR code
  const upiPayUri = `upi://pay?pa=${encodeURIComponent(FOUNDATION_INFO.upiId || 'jeevanjyoti.gzp@sbi')}&pn=${encodeURIComponent(FOUNDATION_INFO.nameEnglish || 'JEEVAN JYOTI FOUNDATION')}&am=${selectedPlan.amount}&cu=INR&tn=${encodeURIComponent(`NGO Membership Fee ${selectedPlan.titleEnglish}`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-300 my-auto animate-in fade-in zoom-in duration-200">
        
        {/* TOP HEADER */}
        <div className="bg-gradient-to-r from-[#8B0000] via-[#A00000] to-[#3F2B96] text-white p-4 sm:p-6 text-center relative border-b-2 border-amber-400">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-3 mb-2">
            <BrandLogo size={42} className="drop-shadow-md" />
            <div className="text-left">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-300 bg-black/30 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                पंजीकृत गैर-सरकारी संस्था • Govt. Reg. NGO (UP/2018/0207700)
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-white font-['Cinzel',serif] tracking-wide">
                जीवन ज्योति फाउंडेशन सदस्यता सेवा
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-amber-100 max-w-2xl mx-auto">
            राष्ट्र निर्माण, निःशुल्क शिक्षा, स्वास्थ्य एवं असहाय जन-कल्याण के पावन संकल्प से जुड़ें। सदस्यता ग्रहण करें और अधिकृत लेटरहेड प्रमाण पत्र प्राप्त करें।
          </p>

          {/* THREE TAB SWITCHER */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 mt-4 max-w-md mx-auto bg-black/25 p-1 rounded-2xl border border-white/20">
            <button
              type="button"
              onClick={() => {
                setActiveTab('plans');
                setSubmittedApplication(null);
              }}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'plans'
                  ? 'bg-amber-400 text-[#8B0000] shadow-md scale-[1.02]'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>1. योजना व फॉर्म</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('payment')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'payment'
                  ? 'bg-amber-400 text-[#8B0000] shadow-md scale-[1.02]'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>2. शुल्क भुगतान</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('download')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'download'
                  ? 'bg-amber-400 text-[#8B0000] shadow-md scale-[1.02]'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>3. प्रमाण पत्र डाउनलोड</span>
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto bg-gradient-to-b from-amber-50/30 to-white">
          
          {/* ============================================================== */}
          {/* TAB 1: MEMBERSHIP PLANS & APPLICATION FORM                     */}
          {/* ============================================================== */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              {/* PLAN SELECTION CARDS */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                      <span>सदस्यता श्रेणी चुनें (Select Membership Tier)</span>
                    </h3>
                    <p className="text-xs text-gray-600">
                      प्रत्येक श्रेणी के शुल्क व लाभ नीचे स्पष्ट रूप से दर्शाए गए हैं:
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full">
                    5 आधिकारिक श्रेणियां
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {OFFICIAL_MEMBERSHIP_PLANS.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`relative rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? `${plan.borderClass} ${plan.accentBg} shadow-lg scale-[1.02]`
                            : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-sm'
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                            सर्वाधिक लोकप्रिय
                          </span>
                        )}

                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-black text-base text-gray-900">{plan.titleHindi}</h4>
                              <span className="text-[11px] font-semibold text-gray-500">{plan.titleEnglish}</span>
                            </div>
                            <span
                              className="text-xs font-black px-2 py-0.5 rounded-lg text-white shrink-0"
                              style={{ backgroundColor: plan.color }}
                            >
                              {plan.badgeHindi}
                            </span>
                          </div>

                          <div className="my-2.5 flex items-baseline gap-1">
                            <span className="text-2xl font-black text-[#8B0000]">
                              ₹{plan.amount.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs font-bold text-gray-600">/ {plan.validityHindi}</span>
                          </div>

                          <p className="text-xs text-gray-700 leading-relaxed mb-3">
                            {plan.descriptionHindi}
                          </p>

                          <ul className="text-[11px] text-gray-600 space-y-1 border-t border-gray-100 pt-2">
                            {plan.benefits.slice(0, 3).map((b, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-gray-500">चयनित:</span>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-[#8B0000] bg-[#8B0000] text-white' : 'border-gray-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* APPLICATION FORM */}
              <form onSubmit={handleProceedToPayment} className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-sm space-y-4">
                <div className="border-b border-amber-200 pb-2">
                  <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#8B0000]" />
                    <span>सदस्यता आवेदन पत्र (Membership Registration Form)</span>
                  </h3>
                  <p className="text-xs text-gray-600">
                    चयनित योजना: <strong className="text-[#8B0000]">{selectedPlan.titleHindi}</strong> (शुल्क: ₹{selectedPlan.amount.toLocaleString('en-IN')})
                  </p>
                </div>

                {/* Photo & Name Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  {/* Photo Uploader */}
                  <div className="md:col-span-1 flex flex-col items-center">
                    <CandidatePhotoUploader
                      photoUrl={photoUrl}
                      onPhotoChange={(url: string) => setPhotoUrl(url)}
                      onPhotoRemove={() => setPhotoUrl('')}
                      label="सदस्य पासपोर्ट फोटो"
                    />
                    <span className="text-[10px] text-gray-500 text-center mt-1">
                      लेटरहेड प्रमाण पत्र पर मुद्रित होगा
                    </span>
                  </div>

                  {/* Core Inputs */}
                  <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        पूरा नाम (Full Name) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="उदा० रमेश चंद्र वर्मा"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-gray-800">
                          संबंध प्रकार व नाम *
                        </label>
                        <select
                          value={relationType}
                          onChange={(e: any) => setRelationType(e.target.value)}
                          className="text-[11px] font-bold border border-gray-300 rounded-md px-1 py-0.5 bg-gray-50"
                        >
                          <option value="Father">पिता (Father)</option>
                          <option value="Husband">पति (Husband)</option>
                          <option value="Guardian">संरक्षक (Guardian)</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="पिता / पति का नाम"
                        value={fatherOrHusbandName}
                        onChange={(e) => setFatherOrHusbandName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        मोबाइल नंबर (10 अंक - प्रमाण पत्र डाउनलोड हेतु) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">+91</span>
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          placeholder="8052361666"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className="w-full pl-11 pr-3 py-2 rounded-xl border border-gray-300 focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] text-sm font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        ईमेल पता (Email Address)
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        जन्म तिथि (Date of Birth)
                      </label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">लिंग (Gender)</label>
                        <select
                          value={gender}
                          onChange={(e: any) => setGender(e.target.value)}
                          className="w-full px-2 py-2 rounded-xl border border-gray-300 focus:border-[#8B0000] text-xs font-bold"
                        >
                          <option value="male">पुरुष (Male)</option>
                          <option value="female">महिला (Female)</option>
                          <option value="other">अन्य (Other)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">रक्त समूह (Blood)</label>
                        <select
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)}
                          className="w-full px-2 py-2 rounded-xl border border-gray-300 focus:border-[#8B0000] text-xs font-bold text-red-700"
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profession & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      व्यवसाय / पेशा (Occupation) *
                    </label>
                    <input
                      type="text"
                      placeholder="उदा० शिक्षक / व्यापारी / समाजसेवी / छात्र"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#8B0000] text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      पहचान पत्र प्रकार (ID Proof Type)
                    </label>
                    <select
                      value={idProofType}
                      onChange={(e: any) => setIdProofType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#8B0000] text-xs font-bold"
                    >
                      <option value="aadhaar">आधार कार्ड (Aadhaar Card)</option>
                      <option value="voter_id">मतदाता पहचान पत्र (Voter ID)</option>
                      <option value="pan">पैन कार्ड (PAN Card)</option>
                      <option value="driving_license">ड्राइविंग लाइसेंस (DL)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      पहचान पत्र क्रमांक (ID Number)
                    </label>
                    <input
                      type="text"
                      placeholder="अंतिम 4 अंक अथवा ID क्रमांक"
                      value={idProofNumber}
                      onChange={(e) => setIdProofNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#8B0000] text-xs font-mono font-semibold"
                    />
                  </div>
                </div>

                {/* Full Address */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      स्थायी पता (ग्राम / मुहल्ला / गली) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ग्राम व पोस्ट दाउदपुर"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#8B0000] text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">ब्लॉक / तहसील</label>
                    <input
                      type="text"
                      placeholder="मोहम्मदाबाद"
                      value={block}
                      onChange={(e) => setBlock(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#8B0000] text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">पिन कोड (PIN)</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="233303"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#8B0000] text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Declaration Checkbox */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="member-declaration-check"
                    checked={agreedToBylaws}
                    onChange={(e) => setAgreedToBylaws(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#8B0000] rounded-sm focus:ring-[#8B0000] cursor-pointer"
                  />
                  <label htmlFor="member-declaration-check" className="text-xs text-gray-800 cursor-pointer select-none">
                    <strong>शपथ व सहमति:</strong> मैं प्रमाणित करता/करती हूँ कि उपरोक्त सभी विवरण सत्य हैं। मैं जीवन ज्योति फाउंडेशन ग़ाज़ीपुर के संविधान, उद्देश्यों एवं अनुशासन का पूर्ण निष्ठा से पालन करने का संकल्प लेता/लेती हूँ।
                  </label>
                </div>

                {/* Submit to Payment Button */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-gray-600">
                    कुल देय सदस्यता शुल्क: <strong className="text-base font-black text-[#8B0000]">₹{selectedPlan.amount.toLocaleString('en-IN')}</strong>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#8B0000] to-[#b30000] hover:from-[#6b0000] hover:to-[#8B0000] text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.01]"
                  >
                    <span>फॉर्म सबमिट करें व शुल्क भुगतान पर जाएं</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: PAYMENT REDIRECTION & PROOF SUBMISSION                 */}
          {/* ============================================================== */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              {submittedApplication ? (
                /* Application Success Receipt Card */
                <div className="p-6 bg-gradient-to-b from-emerald-50 to-white rounded-3xl border-2 border-emerald-300 shadow-md text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div>
                    <span className="text-xs font-black uppercase tracking-wider px-3 py-1 bg-emerald-200 text-emerald-900 rounded-full border border-emerald-400">
                      आवेदन सफलतापूर्वक दर्ज
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-2 font-serif">
                      सदस्यता आवेदन व भुगतान प्राप्त हुआ!
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto mt-1">
                      आपका आवेदन क्रमांक <strong className="font-mono font-black text-[#8B0000]">{submittedApplication.applicationNo}</strong> है। भुगतान व विवरण व्यवस्थापक (Admin) के अनुमोदन हेतु भेज दिया गया है।
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="max-w-md mx-auto p-4 bg-white rounded-2xl border border-gray-200 text-left text-xs space-y-1.5 shadow-2xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">आवेदक का नाम:</span>
                      <span className="font-black text-gray-900">{submittedApplication.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">सदस्यता श्रेणी:</span>
                      <span className="font-black text-[#3F2B96]">{submittedApplication.planNameHindi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">शुल्क राशि:</span>
                      <span className="font-black text-emerald-700">₹{submittedApplication.paymentAmount.toLocaleString('en-IN')}/-</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">पंजीकृत मोबाइल:</span>
                      <span className="font-mono font-bold text-gray-900">+91 {submittedApplication.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">ट्रांजेक्शन UTR:</span>
                      <span className="font-mono font-bold text-blue-800">{submittedApplication.transactionRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">वर्तमान स्थिति:</span>
                      <span className="font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        जांच व सत्यापन हेतु प्रतीक्षारत (Pending)
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-900 max-w-lg mx-auto">
                    ℹ️ <strong>महत्वपूर्ण सूचना:</strong> व्यवस्थापक द्वारा भुगतान जांच व स्वीकृति होते ही आप &quot;प्रमाण पत्र डाउनलोड&quot; टैब में अपना मोबाइल नंबर दर्ज करके तुरंत A4 लेटरहेड प्रमाण पत्र डाउनलोड कर सकेंगे।
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchPhone(submittedApplication.phone);
                        setActiveTab('download');
                        handleSearchByPhone(submittedApplication.phone);
                      }}
                      className="px-5 py-2.5 bg-[#8B0000] hover:bg-[#6b0000] text-white font-black text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>प्रमाण पत्र स्थिति देखें</span>
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      समाप्त करें
                    </button>
                  </div>
                </div>
              ) : (
                /* Payment Gateway View */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Dynamic QR & UPI details */}
                  <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/70 rounded-2xl border-2 border-amber-300 shadow-sm flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8B0000] text-white text-xs font-black rounded-full mb-3 shadow-2xs">
                      <QrCode className="w-3.5 h-3.5" />
                      <span>आधिकारिक NGO सदस्यता QR कोड</span>
                    </div>

                    <h4 className="text-base font-black text-gray-900 mb-1">
                      {selectedPlan.titleHindi} शुल्क भुगतान
                    </h4>
                    <div className="text-2xl font-black text-[#8B0000] mb-3">
                      ₹{selectedPlan.amount.toLocaleString('en-IN')}/-
                    </div>

                    {/* QR Code Container */}
                    <div className="p-3 bg-white rounded-2xl border-2 border-amber-400 shadow-md mb-3">
                      <QRCodeSVG
                        value={upiPayUri}
                        size={175}
                        level="H"
                        includeMargin={false}
                      />
                    </div>

                    <p className="text-[11px] text-gray-600 font-medium max-w-xs">
                      PhonePe, Google Pay, Paytm, BHIM अथवा किसी भी UPI ऐप से स्कैन करके सीधे भुगतान करें।
                    </p>

                    {/* UPI ID Copy Strip */}
                    <div className="w-full mt-3 p-2 bg-white rounded-xl border border-amber-300 flex items-center justify-between gap-2">
                      <div className="text-left min-w-0">
                        <div className="text-[10px] text-gray-500 font-bold uppercase">आधिकारिक UPI ID:</div>
                        <div className="text-xs font-mono font-black text-blue-900 truncate">
                          {FOUNDATION_INFO.upiId || 'jeevanjyoti.gzp@sbi'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shrink-0 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUpi ? 'कॉपी' : 'कॉपी करें'}</span>
                      </button>
                    </div>

                    {/* Bank Details */}
                    <div className="w-full mt-3 p-2.5 bg-white/90 rounded-xl border border-gray-200 text-left text-[11px] text-gray-700 space-y-0.5">
                      <div><strong>खाता नाम:</strong> {FOUNDATION_INFO.bankAccountName || 'JEEVAN JYOTI FOUNDATION'}</div>
                      <div><strong>खाता संख्या:</strong> <span className="font-mono font-bold text-gray-950">{FOUNDATION_INFO.bankAccountNumber || '718720110000323'}</span></div>
                      <div><strong>IFSC कोड:</strong> <span className="font-mono font-bold text-gray-950">{FOUNDATION_INFO.bankIfsc || 'BKID0007187'}</span> ({FOUNDATION_INFO.bankName || 'BANK OF INDIA'})</div>
                    </div>
                  </div>

                  {/* Right: Payment Reference & Final Submission Form */}
                  <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="border-b border-gray-200 pb-2 mb-4">
                        <h4 className="text-base font-black text-gray-900 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>भुगतान संदर्भ व UTR दर्ज करें</span>
                        </h4>
                        <p className="text-xs text-gray-600">
                          भुगतान पूर्ण होने के बाद प्राप्त 12 अंकों का UTR / रेफरेंस नंबर यहाँ दर्ज करें:
                        </p>
                      </div>

                      <form id="membership-payment-form" onSubmit={handleFinalSubmitWithPayment} className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            भुगतान का माध्यम (Payment Mode) *
                          </label>
                          <select
                            value={paymentMode}
                            onChange={(e: any) => setPaymentMode(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#8B0000] text-xs font-bold"
                          >
                            <option value="upi_qr">UPI QR कोड (Google Pay / PhonePe / Paytm / BHIM)</option>
                            <option value="bank_transfer">सीधा बैंक ट्रांसफर (NEFT / RTGS / IMPS)</option>
                            <option value="online">ऑनलाइन नेटबैंकिंग / डेबिट कार्ड</option>
                            <option value="cash">संस्था कार्यालय में नकद जमा</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            UPI UTR संख्या / बैंक रेफरेंस नंबर (12 अंक) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="उदा० 4289XXXXXXXX अथवा बैंक Ref ID"
                            value={transactionRef}
                            onChange={(e) => setTransactionRef(e.target.value.trim())}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] text-sm font-mono font-black"
                          />
                          <span className="text-[10px] text-gray-500 mt-0.5 block">
                            यह नंबर व्यवस्थापक द्वारा बैंक खाते से मिलान हेतु प्रयोग किया जाएगा।
                          </span>
                        </div>

                        {/* Applicant details recap */}
                        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-bold">आवेदक का नाम:</span>
                            <span className="font-bold text-gray-950">{fullName || 'प्रतीक्षारत'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-bold">मोबाइल नंबर:</span>
                            <span className="font-mono font-bold text-gray-950">+91 {phone || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-bold">योजना / शुल्क:</span>
                            <span className="font-bold text-[#8B0000]">{selectedPlan.titleHindi} (₹{selectedPlan.amount})</span>
                          </div>
                        </div>

                        {/* Pay via UPI App Intent Button on Mobile */}
                        <a
                          href={upiPayUri}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black text-center shadow-xs transition-colors flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>सीधे UPI ऐप से पेमेंट करें (PhonePe / GPay)</span>
                        </a>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 bg-gradient-to-r from-[#8B0000] to-[#b30000] hover:from-[#6b0000] hover:to-[#8B0000] text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <ShieldCheck className="w-5 h-5 text-amber-300" />
                          <span>सदस्यता आवेदन अंतिम रूप से सबमिट करें</span>
                        </button>
                      </form>
                    </div>

                    <div className="text-[10px] text-gray-500 text-center mt-3 pt-2 border-t border-gray-100">
                      भुगतान सुरक्षित है। सबमिट होते ही यह एडमिन लॉगिन में जांच व अनुमोदन हेतु उपलब्ध हो जाएगा।
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: DOWNLOAD CERTIFICATE BY MOBILE NUMBER                   */}
          {/* ============================================================== */}
          {activeTab === 'download' && (
            <div className="space-y-6">
              {/* SEARCH BOX */}
              <div className="p-5 bg-gradient-to-r from-amber-100/70 via-orange-50 to-amber-100/70 rounded-2xl border-2 border-amber-300 shadow-sm">
                <div className="max-w-xl mx-auto text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#8B0000] text-white flex items-center justify-center mx-auto shadow-md">
                    <Download className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 font-serif">
                    पंजीकृत मोबाइल नंबर दर्ज कर सदस्यता प्रमाण पत्र डाउनलोड करें
                  </h3>
                  <p className="text-xs text-gray-600">
                    आवेदन के समय उपयोग किया गया 10 अंकों का मोबाइल नंबर दर्ज करें:
                  </p>

                  <div className="flex items-center gap-2 max-w-md mx-auto pt-1">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="8052361666"
                        value={searchPhone}
                        onChange={(e) => setSearchPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSearchByPhone();
                        }}
                        className="w-full pl-11 pr-3 py-2.5 rounded-xl border-2 border-amber-400 bg-white font-mono font-bold text-sm text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-[#8B0000]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSearchByPhone()}
                      className="px-5 py-2.5 bg-[#8B0000] hover:bg-[#6b0000] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Search className="w-4 h-4" />
                      <span>सर्च करें</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SEARCH RESULTS */}
              {hasSearched && (
                <div>
                  {searchedMembers.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
                      <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
                      <h4 className="text-base font-bold text-gray-900">
                        मोबाइल नंबर +91 {searchPhone} से कोई सदस्यता प्रमाण पत्र नहीं मिला
                      </h4>
                      <p className="text-xs text-gray-600 max-w-md mx-auto">
                        कृपया सुनिश्चित करें कि मोबाइल नंबर सही दर्ज है, अथवा नया सदस्यता आवेदन फॉर्म भरें।
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('plans')}
                        className="px-4 py-2 bg-[#8B0000] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        नया सदस्यता आवेदन भरें
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-600">
                          प्राप्त सदस्यता रिकॉर्ड ({searchedMembers.length}):
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchedMembers.map((member) => {
                          const isApproved = member.status === 'approved';
                          const isPending = member.status === 'pending';
                          const isRejected = member.status === 'rejected';

                          return (
                            <div
                              key={member.id || member.applicationNo}
                              className={`p-5 rounded-2xl border-2 bg-white shadow-sm flex flex-col justify-between transition-all ${
                                isApproved
                                  ? 'border-emerald-400 hover:shadow-md'
                                  : isPending
                                  ? 'border-amber-300 bg-amber-50/30'
                                  : 'border-red-300 bg-red-50/20'
                              }`}
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-14 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-amber-300 to-amber-600 border border-amber-500 shadow-2xs shrink-0">
                                      <img
                                        src={member.photoUrl || '/manager_secretary.webp'}
                                        alt={member.fullName}
                                        className="w-full h-full object-cover object-top rounded-lg"
                                      />
                                    </div>

                                    <div>
                                      <h4 className="font-black text-base text-gray-900">{member.fullName}</h4>
                                      <div className="text-xs font-bold text-[#8B0000]">{member.planNameHindi}</div>
                                      <div className="text-[10px] font-mono text-gray-500">
                                        ID: {member.id || member.applicationNo}
                                      </div>
                                    </div>
                                  </div>

                                  <span
                                    className={`text-[10px] font-black px-2.5 py-1 rounded-full border shadow-2xs shrink-0 ${
                                      isApproved
                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                                        : isPending
                                        ? 'bg-amber-100 text-amber-900 border-amber-400'
                                        : 'bg-red-100 text-red-800 border-red-300'
                                    }`}
                                  >
                                    {isApproved ? '✓ अनुमोदित (Approved)' : isPending ? '⏳ प्रतीक्षारत (Pending)' : '✕ अस्वीकृत'}
                                  </span>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1 mb-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500 font-bold">पिता/पति:</span>
                                    <span className="font-semibold">{member.fatherOrHusbandName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500 font-bold">मोबाइल:</span>
                                    <span className="font-mono font-bold">+91 {member.phone}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500 font-bold">वैधता अवधि:</span>
                                    <span className="font-black text-blue-900">{member.validTill || 'आजीवन (Lifetime)'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500 font-bold">शुल्क राशि:</span>
                                    <span className="font-bold text-emerald-800">₹{member.paymentAmount.toLocaleString('en-IN')}/-</span>
                                  </div>
                                </div>

                                {isPending && (
                                  <div className="p-2.5 bg-amber-100/70 border border-amber-300 rounded-xl text-[11px] text-amber-900 mb-3">
                                    ⏳ <strong>प्रशासक समीक्षा जारी:</strong> आपका भुगतान व आवेदन व्यवस्थापक द्वारा जांचा जा रहा है। स्वीकृति के तुरंत बाद यहाँ प्रमाण पत्र डाउनलोड बटन सक्रिय हो जाएगा।
                                  </div>
                                )}

                                {isRejected && (
                                  <div className="p-2.5 bg-red-100/70 border border-red-300 rounded-xl text-[11px] text-red-900 mb-3">
                                    ❌ <strong>अस्वीकृति कारण:</strong> {member.rejectionReason || 'सत्यापन विसंगति'}
                                  </div>
                                )}
                              </div>

                              {/* Action Button */}
                              <div>
                                {isApproved ? (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedMemberForCertificate(member)}
                                    className="w-full py-2.5 bg-gradient-to-r from-[#8B0000] to-[#b30000] hover:from-[#6b0000] hover:to-[#8B0000] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                                  >
                                    <Award className="w-4 h-4 text-amber-300" />
                                    <span>आधिकारिक A4 लेटरहेड प्रमाण पत्र देखें व डाउनलोड करें</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    disabled
                                    className="w-full py-2 bg-gray-200 text-gray-500 font-bold text-xs rounded-xl cursor-not-allowed text-center"
                                  >
                                    प्रमाण पत्र अनुमोदन के बाद उपलब्ध होगा
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* FULL-SCREEN LETTERHEAD CERTIFICATE PREVIEW MODAL */}
      {selectedMemberForCertificate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl p-4 sm:p-6 shadow-2xl my-auto animate-in fade-in zoom-in duration-200">
            <MembershipLetterheadCertificate
              member={selectedMemberForCertificate}
              onClose={() => setSelectedMemberForCertificate(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
