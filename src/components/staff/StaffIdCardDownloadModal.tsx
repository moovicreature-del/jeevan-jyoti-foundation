// ============================================================================
// JEEVAN JYOTI FOUNDATION - STAFF I-CARD DOWNLOAD & VERIFICATION PORTAL
// जीवन ज्योति फाउंडेशन - स्टाफ पहचान पत्र डाउनलोड एवं सत्यापन केंद्र
// नियम: आई-कार्ड केवल एडमिन द्वारा रजिस्ट्रेशन फॉर्म स्वीकृत (Approve) होने पर ही खुलेगा
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Download,
  Printer,
  Search,
  RotateCw,
  Share2,
  Check,
  ShieldCheck,
  Award,
  Sparkles,
  Palette,
  Phone,
  UserCheck,
  FileText,
  UserPlus,
  Languages,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { StaffMember, StaffCardTheme, StaffCardLanguage } from '../../types/staff';
import { getAllStaffMembers, findStaffMember, findStaffByMobile } from '../../services/staffService';
import { StaffIdCard } from './StaffIdCard';
import { exportElementAsPng, exportElementsAsMultiPagePdf, directPrintElement } from '../../utils/exportImage';
import { OtpVerificationModal } from '../OtpVerificationModal';

interface StaffIdCardDownloadModalProps {
  initialStaff?: StaffMember | null;
  onClose: () => void;
  onOpenRegistrationForm: () => void;
}

export const StaffIdCardDownloadModal: React.FC<StaffIdCardDownloadModalProps> = ({
  initialStaff = null,
  onClose,
  onOpenRegistrationForm
}) => {
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Selected Staff State (starts null unless initialStaff is passed)
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(initialStaff);

  // Mobile / Query Input State
  const [mobileQuery, setMobileQuery] = useState(initialStaff ? initialStaff.mobile : '');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchSuccessNotice, setSearchSuccessNotice] = useState<string | null>(null);

  // Card View States
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [cardTheme, setCardTheme] = useState<StaffCardTheme>('maroon_gold');
  const [cardLanguage, setCardLanguage] = useState<StaffCardLanguage>('hi');
  const [isExporting, setIsExporting] = useState<string | null>(null);

  // OTP Verification States for I-Card Download
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Reset OTP verification when switching staff
  useEffect(() => {
    setIsOtpVerified(false);
    setSearchError(null);
  }, [selectedStaff?.id]);

  useEffect(() => {
    if (initialStaff) {
      setSelectedStaff(initialStaff);
      setMobileQuery(initialStaff.mobile);
    }
  }, [initialStaff]);

  // Handle Search by Registered Mobile Number (or Staff ID)
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchError(null);
    setSearchSuccessNotice(null);

    const trimmed = mobileQuery.trim();
    if (!trimmed) {
      setSearchError('कृपया अपना 10 अंकों का रजिस्टर्ड मोबाइल नंबर दर्ज करें।');
      return;
    }

    const digits = trimmed.replace(/[^0-9]/g, '');
    let found: StaffMember | null = null;

    if (digits.length >= 10) {
      found = findStaffByMobile(digits.slice(-10));
    }

    if (!found) {
      found = findStaffMember(trimmed);
    }

    if (found) {
      setSelectedStaff(found);
      setSearchError(null);
    } else {
      setSelectedStaff(null);
      setSearchError(
        `इस मोबाइल नंबर (+91 ${trimmed}) से कोई स्टाफ पंजीकरण दर्ज नहीं मिला। कृपया नंबर जांचें अथवा नया पंजीकरण फॉर्म भरें।`
      );
    }
  };

  // Approval status checks
  const isApproved =
    selectedStaff &&
    (selectedStaff.status === 'approved' ||
      selectedStaff.status === 'active' ||
      selectedStaff.status === 'verified');
  const isPending = selectedStaff && selectedStaff.status === 'pending';
  const isRejected = selectedStaff && selectedStaff.status === 'rejected';

  const requireOtpBeforeAction = (action: () => void) => {
    if (!selectedStaff) return;

    if (isPending) {
      alert(
        '⚠️ यह स्टाफ पहचान पत्र वर्तमान में संस्था प्रशासन (Admin) के अनुमोदन हेतु लंबित है। एडमिन लॉगिन से फॉर्म Approve होने के बाद ही कार्ड जारी एवं डाउनलोड होगा।'
      );
      return;
    }
    if (isRejected) {
      alert(
        `⚠️ यह स्टाफ पंजीकरण संस्था प्रशासन द्वारा अस्वीकृत किया गया है। ${selectedStaff.rejectionReason ? `(कारण: ${selectedStaff.rejectionReason})` : ''}`
      );
      return;
    }

    if (isOtpVerified) {
      action();
    } else {
      setPendingAction(() => action);
      setIsOtpOpen(true);
    }
  };

  const handleOtpSuccess = () => {
    setIsOtpVerified(true);
    setIsOtpOpen(false);
    if (pendingAction) {
      setTimeout(() => {
        pendingAction();
        setPendingAction(null);
      }, 200);
    }
  };

  // Execute Download High-Res PNG with specific language
  const executeDownloadPng = async (langToUse: StaffCardLanguage = cardLanguage) => {
    if (!selectedStaff) return;
    if (langToUse !== cardLanguage) {
      setCardLanguage(langToUse);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }

    const cardEl = document.getElementById('staff-id-card-rendered');
    if (!cardEl) return;
    setIsExporting(`png_${langToUse}`);
    try {
      const langLabel = langToUse === 'en' ? 'EN' : langToUse === 'hi' ? 'HI' : 'Bilingual';
      const fileName = `JJF_Staff_Card_${selectedStaff.id}_${langLabel}_${cardSide}`;
      await exportElementAsPng(cardEl, fileName, {
        pixelRatio: 3.125,
        backgroundColor: '#FFFFFF'
      });
    } catch (err) {
      console.error('PNG download error:', err);
    } finally {
      setIsExporting(null);
    }
  };

  const handleDownloadPng = (langToUse: StaffCardLanguage = cardLanguage) => {
    requireOtpBeforeAction(() => executeDownloadPng(langToUse));
  };

  // Execute Download Print-Ready 2-Page PDF (Page 1: Front, Page 2: Back)
  const executeDownloadPdf = async (langToUse: StaffCardLanguage = cardLanguage) => {
    if (!selectedStaff) return;
    if (langToUse !== cardLanguage) {
      setCardLanguage(langToUse);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const frontEl = document.getElementById('staff-card-export-front');
    const backEl = document.getElementById('staff-card-export-back');
    const currentEl = document.getElementById('staff-id-card-rendered');

    const elementsToExport = [frontEl || currentEl, backEl].filter((el): el is HTMLElement => el !== null);
    if (elementsToExport.length === 0) return;

    setIsExporting('pdf');
    try {
      const langLabel = langToUse === 'en' ? 'EN' : langToUse === 'hi' ? 'HI' : 'Bilingual';
      const fileName = `JJF_Staff_ID_${selectedStaff.id}_${langLabel}_BothSides_2Page`;
      await exportElementsAsMultiPagePdf(elementsToExport, fileName, {
        orientation: 'portrait',
        backgroundColor: '#FFFFFF',
        pixelRatio: 3.125
      });
    } catch (err) {
      console.error('2-Page PDF download error:', err);
    } finally {
      setIsExporting(null);
    }
  };

  const handleDownloadPdf = (langToUse: StaffCardLanguage = cardLanguage) => {
    requireOtpBeforeAction(() => executeDownloadPdf(langToUse));
  };

  // Direct Print
  const handlePrint = () => {
    requireOtpBeforeAction(() => {
      const cardEl = document.getElementById('staff-id-card-rendered');
      directPrintElement(cardEl);
    });
  };

  // WhatsApp Share
  const handleWhatsAppShare = () => {
    if (!selectedStaff) return;
    const text = encodeURIComponent(
      `*जीवन ज्योति फाउंडेशन ग़ाज़ीपुर - आधिकारिक स्टाफ पहचान पत्र*\n\n` +
        `👤 नाम: ${selectedStaff.fullName}\n` +
        `💼 पदनाम: ${selectedStaff.designation}\n` +
        `🆔 स्टाफ आईडी: ${selectedStaff.id}\n` +
        `🩸 रक्त समूह: ${selectedStaff.bloodGroup}\n` +
        `🌐 ऑनलाइन सत्यापन लिंक: ${window.location.origin}/?verify=${selectedStaff.id}\n\n` +
        `_सरकारी पंजीकृत संस्था (Reg: UP/2018/0207700)_`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-300 my-auto animate-in fade-in zoom-in duration-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#8B0000] via-[#A00000] to-[#3F2B96] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-amber-400 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300 flex items-center justify-center text-amber-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white font-['Cinzel',serif]">
                  स्टाफ पहचान पत्र डाउनलोड व सत्यापन केंद्र
                </h3>
                <span className="bg-amber-400 text-[#8B0000] text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Official Portal
                </span>
              </div>
              <p className="text-xs text-amber-100 font-medium mt-0.5">
                Staff Identity Card Portal • रजिस्टर्ड मोबाइल नंबर द्वारा सत्यापन एवं 300 DPI में डाउनलोड
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-gray-50/60">
          {/* ========================================================================= */}
          {/* 1. MOBILE NUMBER SEARCH / LOOKUP SECTION                                  */}
          {/* ========================================================================= */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border-2 border-amber-200 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-[#8B0000] flex items-center justify-center font-bold">
                  <Phone className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-black text-gray-900">
                  {selectedStaff
                    ? 'रजिस्टर्ड मोबाइल नंबर द्वारा आई-कार्ड सत्यापन'
                    : 'रजिस्टर्ड मोबाइल नंबर दर्ज करके अपना आई-कार्ड खोलें'}
                </h4>
              </div>
              <span className="text-[11px] text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-bold">
                🔒 एडमिन अप्रूवल अनिवार्य
              </span>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-500 font-bold text-xs select-none pointer-events-none">
                  <Phone className="w-3.5 h-3.5 text-[#8B0000]" />
                  <span>+91</span>
                  <span className="text-gray-300">|</span>
                </div>
                <input
                  type="text"
                  value={mobileQuery}
                  onChange={(e) => {
                    setMobileQuery(e.target.value);
                    setSearchError(null);
                  }}
                  placeholder="अपना 10-अंकों का रजिस्टर्ड मोबाइल नंबर दर्ज करें (उदा. 9838361666)..."
                  maxLength={15}
                  className="w-full pl-18 pr-4 py-3 text-sm font-bold text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] outline-hidden shadow-inner bg-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#8B0000] to-red-700 hover:from-red-800 hover:to-red-900 text-white text-xs sm:text-sm font-black rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>आई-कार्ड खोलें (Open Card)</span>
                </button>

                {selectedStaff && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStaff(null);
                      setMobileQuery('');
                      setSearchError(null);
                    }}
                    className="px-3.5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                    title="अन्य नंबर से खोजें"
                  >
                    बदलें
                  </button>
                )}
              </div>
            </form>

            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1 text-[11.5px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                <span>आई-कार्ड केवल तभी खुलेगा जब संस्था प्रशासन (Admin Login) द्वारा पंजीकरण फॉर्म स्वीकृत (Approve) किया गया हो।</span>
              </span>
              <button
                type="button"
                onClick={onOpenRegistrationForm}
                className="text-xs font-bold text-[#8B0000] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>नया स्टाफ रजिस्ट्रेशन करें</span>
              </button>
            </div>

            {/* Error Message */}
            {searchError && (
              <div className="mt-3 text-xs font-bold text-red-800 bg-red-50 p-3 rounded-xl border border-red-200 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{searchError}</span>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={onOpenRegistrationForm}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>नया स्टाफ पंजीकरण फॉर्म भरें</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 2. NO STAFF SELECTED STATE: GUIDE / PROMPT                                */}
          {/* ========================================================================= */}
          {!selectedStaff && !searchError && (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border-2 border-dashed border-amber-300 space-y-4">
              <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-amber-200">
                <Phone className="w-8 h-8 text-[#8B0000]" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-base sm:text-lg font-black text-gray-900 font-['Cinzel',serif]">
                  कृपया अपना पंजीकृत मोबाइल नंबर दर्ज करें
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  स्टाफ रजिस्ट्रेशन फॉर्म भरते समय दिया गया 10 अंकों का मोबाइल नंबर ऊपर बॉक्स में डालकर <strong>"आई-कार्ड खोलें"</strong> पर क्लिक करें।
                </p>
              </div>

              {/* Security Rule Notice */}
              <div className="max-w-md mx-auto p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 text-xs text-amber-950 text-left space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-[#8B0000]">
                  <Clock className="w-4 h-4" />
                  <span>एडमिन अप्रूवल नियम (Admin Approval Rule):</span>
                </div>
                <p className="text-[11.5px] leading-relaxed text-gray-700">
                  यदि आपका आवेदन संस्था प्रशासन द्वारा स्वीकृत (Approved) हो चुका है, तो आपका 2-Page प्रिंट-रेडी पहचान पत्र तुरंत खुल जाएगा। यदि आपका फॉर्म अभी समीक्षाधीन है, तो स्टेटस दिखाई देगा।
                </p>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={onOpenRegistrationForm}
                  className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#8B0000]" />
                  <span>यदि आपने रजिस्ट्रेशन नहीं किया है, तो यहाँ फॉर्म भरें</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. CASE: STAFF FOUND BUT STATUS IS PENDING (APPROVAL PENDING)             */}
          {/* ========================================================================= */}
          {selectedStaff && isPending && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-xl space-y-6 animate-in fade-in">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-md border-2 border-amber-400 ring-4 ring-amber-200 animate-pulse">
                  <Clock className="w-8 h-8 text-amber-700" />
                </div>
                <span className="inline-block text-xs font-black uppercase tracking-widest text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  ⏳ एडमिन अप्रूवल प्रतीक्षारत (Approval Pending)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                  {selectedStaff.fullName} जी का आई-कार्ड अभी जारी नहीं हुआ है
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
                  आपका स्टाफ पंजीकरण फॉर्म संस्था प्रशासन (Admin Login) के पास समीक्षा एवं सत्यापन हेतु लंबित है। एडमिन द्वारा फॉर्म <strong>स्वीकृत (Approve)</strong> किए जाने के बाद ही आधिकारिक आई-कार्ड जारी किया जाएगा।
                </p>
              </div>

              {/* Summary of Registered Data */}
              <div className="max-w-xl mx-auto p-4 bg-gradient-to-r from-amber-50/70 to-orange-50/70 rounded-2xl border border-amber-300 flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={selectedStaff.photoUrl}
                  alt={selectedStaff.fullName}
                  className="w-20 h-24 object-cover rounded-xl border-2 border-amber-400 shadow-md shrink-0 bg-white"
                />
                <div className="flex-1 space-y-1 text-center sm:text-left text-xs">
                  <div className="text-base font-black text-gray-900">{selectedStaff.fullName}</div>
                  <div className="text-xs font-bold text-amber-900">
                    पद: {selectedStaff.designation}
                  </div>
                  <div className="text-xs text-gray-600">
                    विभाग: {selectedStaff.department}
                  </div>
                  <div className="text-xs text-gray-600 font-mono">
                    स्टाफ संदर्भ आईडी: <strong className="text-[#8B0000]">{selectedStaff.id}</strong>
                  </div>
                  <div className="text-xs text-gray-600 font-mono">
                    रजिस्टर्ड मोबाइल: +91 {selectedStaff.mobile}
                  </div>
                  <div className="pt-1">
                    <span className="text-[10.5px] font-bold px-2 py-0.5 bg-amber-200/80 text-amber-950 rounded-md">
                      पंजीकरण तिथि: {selectedStaff.createdAt ? new Date(selectedStaff.createdAt).toLocaleDateString('hi-IN') : 'हाल ही में'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Informative Step Box */}
              <div className="max-w-xl mx-auto p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-950 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>आगे क्या होगा? (Next Steps)</span>
                </div>
                <ul className="space-y-1.5 pl-1 text-[11.5px] text-blue-900">
                  <li className="flex items-start gap-2">
                    <span className="font-black text-blue-700">1.</span>
                    <span>संस्था प्रशासन (Admin) द्वारा आपके विवरण का सत्यापन किया जाएगा और इसे <strong>Approve</strong> किया जाएगा।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-black text-blue-700">2.</span>
                    <span>जैसे ही एडमिन द्वारा फॉर्म स्वीकृत होगा, आपके रजिस्टर्ड मोबाइल (<strong>+91 {selectedStaff.mobile}</strong>) के WhatsApp पर सूचना प्राप्त होगी।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-black text-blue-700">3.</span>
                    <span>स्वीकृति के उपरांत, इसी पोर्टल पर अपना मोबाइल नंबर दर्ज करते ही आपका 2-Page प्रिंट-रेडी डिजिटल आई-कार्ड तुरंत खुल जाएगा।</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStaff(null);
                    setMobileQuery('');
                    setSearchError(null);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>अन्य मोबाइल नंबर दर्ज करें</span>
                </button>
                <a
                  href="tel:8052361666"
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>हेल्पलाइन / एडमिन संपर्क: +91 8052361666</span>
                </a>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. CASE: STAFF FOUND BUT STATUS IS REJECTED                                */}
          {/* ========================================================================= */}
          {selectedStaff && isRejected && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-red-300 shadow-xl space-y-5 animate-in fade-in">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto shadow-md border-2 border-red-400">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <span className="inline-block text-xs font-black uppercase tracking-widest text-red-900 bg-red-100 px-3 py-1 rounded-full border border-red-300">
                  ❌ पंजीकरण अस्वीकृत (Registration Rejected)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                  {selectedStaff.fullName} जी का स्टाफ पंजीकरण अस्वीकृत कर दिया गया है
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
                  संस्था प्रशासन (Admin Login) द्वारा इस पंजीकरण फॉर्म की समीक्षा के बाद इसे अस्वीकृत (Reject) किया गया है।
                </p>
                {selectedStaff.rejectionReason && (
                  <div className="max-w-md mx-auto p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 font-bold">
                    कारण: {selectedStaff.rejectionReason}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStaff(null);
                    setMobileQuery('');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  अन्य नंबर दर्ज करें
                </button>
                <button
                  type="button"
                  onClick={onOpenRegistrationForm}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#8B0000] hover:bg-[#700000] text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>पुनः नया फॉर्म भरें</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. CASE: APPROVED & ISSUED! (THE OFFICIAL ID CARD OPENS)                   */}
          {/* ========================================================================= */}
          {selectedStaff && isApproved && (
            <div className="space-y-5 animate-in fade-in">
              {/* Top Approval Success Ribbon */}
              <div className="p-3 bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-black text-sm block">
                      ✅ आधिकारिक स्टाफ पहचान पत्र जारी एवं सक्रिय (Staff ID Issued & Active)
                    </span>
                    <span className="text-emerald-100 text-[11px]">
                      स्टाफ सदस्य: <strong>{selectedStaff.fullName}</strong> ({selectedStaff.id}) • रजिस्टर्ड मोबाइल: +91 {selectedStaff.mobile}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedStaff(null);
                    setMobileQuery('');
                  }}
                  className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-[11px] font-bold border border-white/30 transition cursor-pointer shrink-0"
                >
                  🔍 अन्य मोबाइल नंबर खोजें
                </button>
              </div>

              {/* Main 2-Column Section */}
              <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-start">
                {/* Left: Card Display (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  {/* Language Selector Bar Right Above Card */}
                  <div className="w-full max-w-[360px] mb-2.5 flex items-center justify-between bg-white p-1.5 rounded-xl border border-gray-200 shadow-xs">
                    <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1 ml-1">
                      <Languages className="w-3.5 h-3.5 text-[#8B0000]" />
                      <span>कार्ड भाषा (Language):</span>
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setCardLanguage('hi')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          cardLanguage === 'hi'
                            ? 'bg-[#8B0000] text-white shadow-xs'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        🇮🇳 हिन्दी
                      </button>
                      <button
                        type="button"
                        onClick={() => setCardLanguage('en')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          cardLanguage === 'en'
                            ? 'bg-[#8B0000] text-white shadow-xs'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        🇬🇧 English
                      </button>
                      <button
                        type="button"
                        onClick={() => setCardLanguage('bilingual')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          cardLanguage === 'bilingual'
                            ? 'bg-[#8B0000] text-white shadow-xs'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        🌐 द्विभाषी
                      </button>
                    </div>
                  </div>

                  {/* The Actual Staff I-Card Element */}
                  <div ref={cardContainerRef} className="relative transition-all duration-300 hover:scale-[1.01]">
                    <StaffIdCard
                      id="staff-id-card-rendered"
                      staff={selectedStaff}
                      side={cardSide}
                      theme={cardTheme}
                      language={cardLanguage}
                    />
                  </div>

                  {/* Flip Button underneath */}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCardSide((prev) => (prev === 'front' ? 'back' : 'front'))}
                      className="px-4 py-1.5 bg-white border border-gray-300 hover:border-amber-400 text-gray-800 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-[#8B0000]" />
                      <span>
                        {cardSide === 'front' ? 'कार्ड का पिछला भाग देखें (Flip to Back)' : 'कार्ड का मुख्य भाग देखें (Flip to Front)'}
                      </span>
                    </button>
                    <span className="text-[11px] font-bold text-gray-500">
                      वर्तमान: {cardSide === 'front' ? 'अग्र भाग (Front)' : 'पृष्ठ भाग (Back)'}
                    </span>
                  </div>
                </div>

                {/* Right: Customization Controls & Download Buttons (6 Cols) */}
                <div className="lg:col-span-6 space-y-4">
                  {/* Staff Details Summary Card */}
                  <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-gray-700">स्टाफ विवरण संक्षेप</span>
                      </div>
                      <span className="text-xs font-mono font-black text-[#8B0000] bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                        {selectedStaff.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block">स्टाफ का नाम:</span>
                        <span className="font-extrabold text-gray-900">{selectedStaff.fullName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block">पदनाम:</span>
                        <span className="font-bold text-gray-800">{selectedStaff.designation}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block">विभाग:</span>
                        <span className="font-medium text-gray-700">{selectedStaff.department}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block">रक्त समूह:</span>
                        <span className="font-bold text-red-600">{selectedStaff.bloodGroup}</span>
                      </div>
                    </div>
                  </div>

                  {/* Theme Selector */}
                  <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2.5">
                      <Palette className="w-4 h-4 text-amber-600" />
                      <span>स्टाइलिश कार्ड कलर थीम चुनें (Select Card Theme)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'maroon_gold', label: 'शाही महरून (Maroon & Gold)', color: 'from-[#8B0000] to-amber-500' },
                        { id: 'navy_gold', label: 'रॉयल नेवी (Navy & Gold)', color: 'from-[#0B1E48] to-yellow-500' },
                        { id: 'emerald_gold', label: 'एमराल्ड ग्रीन (Emerald)', color: 'from-[#084228] to-amber-400' },
                        { id: 'royal_purple', label: 'शाही बैंगनी (Royal Purple)', color: 'from-[#3B1566] to-purple-500' }
                      ].map((thm) => (
                        <button
                          key={thm.id}
                          type="button"
                          onClick={() => setCardTheme(thm.id as StaffCardTheme)}
                          className={`p-2 rounded-xl text-left border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            cardTheme === thm.id
                              ? 'border-[#8B0000] bg-red-50/50 text-[#8B0000] ring-2 ring-[#8B0000]/20'
                              : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-tr ${thm.color} shrink-0 shadow-xs`}></div>
                          <span className="text-[11px] truncate">{thm.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons: Multi-Page PDF Download & Language Options */}
                  <div className="space-y-2.5 pt-1">
                    {/* Security Verification Status Banner */}
                    {!isOtpVerified && (
                      <div className="p-2.5 rounded-xl border text-xs flex items-center gap-2.5 bg-amber-50 border-amber-300 text-amber-950">
                        <ShieldCheck className="w-4 h-4 text-[#8B0000] shrink-0" />
                        <div className="text-[11px] leading-tight">
                          <span>
                            <strong className="text-[#8B0000]">🔒 सुरक्षा नियम: </strong>
                            रजिस्ट्रेशन में दर्ज मोबाइल नंबर (+91 {selectedStaff.mobile}) पर OTP सत्यापन के बाद ही 300 DPI में डाउनलोड होगा।
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 1. Highlighted 2-Page PDF Download Button (Both Sides in 2 Pages) */}
                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(cardLanguage)}
                      disabled={isExporting !== null}
                      className="w-full py-3 px-4 bg-gradient-to-r from-red-800 via-rose-700 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 border-2 border-amber-300"
                    >
                      <FileText className="w-5 h-5 text-amber-300 shrink-0" />
                      <div className="text-left">
                        <div className="leading-tight text-[13.5px]">
                          {isExporting === 'pdf'
                            ? 'दोनों साइड 2-पेज 300 DPI PDF तैयार हो रही है...'
                            : '📄 दोनों साइड (2-Page) 300 DPI PDF डाउनलोड करें'}
                        </div>
                        <div className="text-[10px] text-amber-200 font-medium">
                          Page 1: फ्रंट साइड • Page 2: बैक साइड (NGO सम्पूर्ण विवरण सहित)
                        </div>
                      </div>
                    </button>

                    {/* 2. Hindi Download Button */}
                    <button
                      type="button"
                      onClick={() => handleDownloadPng('hi')}
                      disabled={isExporting !== null}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-[#8B0000] via-red-700 to-amber-600 hover:from-red-800 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-4 h-4 text-amber-300" />
                      <span>
                        {isExporting === 'png_hi'
                          ? 'हिंदी आई-कार्ड तैयार हो रहा है...'
                          : '🇮🇳 हिंदी में आई-कार्ड डाउनलोड करें (300 DPI PNG)'}
                      </span>
                    </button>

                    {/* 3. English Download Button */}
                    <button
                      type="button"
                      onClick={() => handleDownloadPng('en')}
                      disabled={isExporting !== null}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-[#0B1E48] via-blue-900 to-indigo-800 hover:from-[#081535] hover:to-indigo-900 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-4 h-4 text-yellow-300" />
                      <span>
                        {isExporting === 'png_en'
                          ? 'Generating English I-Card...'
                          : '🇬🇧 Download I-Card in English (300 DPI PNG)'}
                      </span>
                    </button>

                    {/* Secondary Actions Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {/* Print */}
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="py-2.5 px-3 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-4 h-4 text-gray-700" />
                        <span>प्रिंट करें (Print)</span>
                      </button>

                      {/* WhatsApp Share */}
                      <button
                        type="button"
                        onClick={handleWhatsAppShare}
                        className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Share2 className="w-4 h-4 text-emerald-600" />
                        <span>शेयर करें (WhatsApp)</span>
                      </button>
                    </div>

                    {/* Register New Staff CTA Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={onOpenRegistrationForm}
                        className="w-full py-2 px-4 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 text-[#8B0000]" />
                        <span>नया स्टाफ पंजीकृत करना चाहते हैं? यहाँ क्लिक करें</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hidden In-DOM Elements for Multi-Page 2-Page PDF Export */}
              <div
                style={{
                  position: 'fixed',
                  left: 0,
                  top: 0,
                  opacity: 0,
                  width: '380px',
                  pointerEvents: 'none',
                  zIndex: -1000
                }}
                aria-hidden="true"
              >
                <div id="staff-card-export-front">
                  <StaffIdCard
                    staff={selectedStaff}
                    side="front"
                    theme={cardTheme}
                    language={cardLanguage}
                  />
                </div>
                <div id="staff-card-export-back" className="mt-4">
                  <StaffIdCard
                    staff={selectedStaff}
                    side="back"
                    theme={cardTheme}
                    language={cardLanguage}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mandatory OTP Verification Modal before Download */}
        {isOtpOpen && selectedStaff && (
          <OtpVerificationModal
            isOpen={isOtpOpen}
            onClose={() => {
              setIsOtpOpen(false);
              setPendingAction(null);
            }}
            phoneNumber={selectedStaff.mobile}
            recipientName={selectedStaff.fullName}
            certificateId={selectedStaff.id}
            onSuccess={handleOtpSuccess}
          />
        )}
      </div>
    </div>
  );
};
