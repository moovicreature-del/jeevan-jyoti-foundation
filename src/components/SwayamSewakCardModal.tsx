import React, { useRef, useState, useEffect } from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, User, Camera, AlertCircle, Trash2, UploadCloud, Check, FileText, Share2, Mail, Languages } from 'lucide-react';
import { Volunteer } from '../types';
import { FOUNDATION_INFO } from '../data/foundationData';
import { CertificateVerificationQR } from './CertificateVerificationQR';
import { DigitalSignature, NgoRoundSeal, ShaileshPradhanSignature } from './DigitalSignature';
import { BrandLogo } from './common/BrandLogo';
import { StructuredAddressSelector } from './StructuredAddressSelector';
import { DEFAULT_STRUCTURED_ADDRESS, StructuredAddress } from '../data/locationData';
import { exportElementAsPng, exportElementAsJpg, exportElementAsPdf, directPrintElement } from '../utils/exportImage';
import { OtpVerificationModal } from './OtpVerificationModal';
import { CandidatePhotoUploader } from './CandidatePhotoUploader';
import { SendCertificateModal } from './SendCertificateModal';
import { formatCertificateNumber, formatCertificateIssueDate } from '../utils/certificateUtils';
import { saveCertificateToRegistry } from '../services/certificateRegistryService';
import { CertificateLanguage, getIdCardMatter } from '../utils/certificateLanguageUtils';
import { CertificateLanguageToggle } from './common/CertificateLanguageToggle';
import { OfficialVerifiedBadge } from './common/OfficialVerifiedBadge';
import { AppointmentLetterModal } from './common/AppointmentLetterModal';

interface Props {
  volunteer?: Partial<Volunteer> | null;
  onClose: () => void;
  onOpenRegistrationForm?: () => void;
}

export const SwayamSewakCardModal: React.FC<Props> = ({ volunteer, onClose, onOpenRegistrationForm }) => {
  const safeVol = volunteer || {};
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>(
    safeVol.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80'
  );
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [showAddressEdit, setShowAddressEdit] = useState(false);
  const [showFullFormEdit, setShowFullFormEdit] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<'jpg' | 'png' | 'pdf' | 'print' | null>(null);
  const [certLanguage, setCertLanguage] = useState<CertificateLanguage>('bilingual');
  const [cardName, setCardName] = useState(safeVol.name || 'श्री रामेश्वर राय');
  const [volunteerPhone, setVolunteerPhone] = useState(safeVol.phone || '+91-8052361666');
  const [cardFatherName, setCardFatherName] = useState(safeVol.fatherName || 'श्री रामेश्वर जी');
  const [cardRelationType, setCardRelationType] = useState(safeVol.relationType || 'Father');
  const [cardRole, setCardRole] = useState(safeVol.role || 'Dedicated Swayam Sewak');
  const [cardArea, setCardArea] = useState(safeVol.area || 'शिक्षा एवं निःशुल्क पाठशाला (Shiksha)');
  const [cardBloodGroup, setCardBloodGroup] = useState(safeVol.bloodGroup || 'O+');
  const initialCardId = formatCertificateNumber('ID', safeVol.joinDate || new Date(), safeVol.id || '01');
  const initialCardDate = formatCertificateIssueDate(safeVol.joinDate || new Date());
  const [cardId, setCardId] = useState(initialCardId);
  const [cardJoinDate, setCardJoinDate] = useState(initialCardDate);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareModalTab, setShareModalTab] = useState<'whatsapp' | 'email'>('whatsapp');
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const cardMatter = getIdCardMatter(certLanguage);

  const [address, setAddress] = useState<StructuredAddress>({
    country: safeVol.country || DEFAULT_STRUCTURED_ADDRESS.country,
    state: safeVol.state || DEFAULT_STRUCTURED_ADDRESS.state,
    district: safeVol.district || DEFAULT_STRUCTURED_ADDRESS.district,
    block: safeVol.block || DEFAULT_STRUCTURED_ADDRESS.block,
    wardOrVillage: safeVol.wardOrVillage || 'मीरानपुर (Miranpur)'
  });

  // Auto-save issued Swayam Sewak ID Card to database & local registry
  useEffect(() => {
    const cleanPhone = (volunteerPhone || safeVol.phone || '8052361666').replace(/[^0-9]/g, '').slice(-10);
    saveCertificateToRegistry({
      id: cardId,
      type: 'volunteer_id',
      titleHindi: 'स्वयंसेवक डिजिटल पहचान पत्र',
      titleEnglish: 'Swayam Sewak Digital ID Card',
      recipientName: cardName,
      fatherOrHusbandName: cardFatherName,
      phone: cleanPhone,
      issueDate: cardJoinDate,
      categoryOrPurpose: `${cardRole} • ${cardArea}`,
      photoUrl: photoUrl || safeVol.photoUrl,
      details: `ब्लड ग्रुप: ${cardBloodGroup} • अधिकृत पहचान पत्र`,
      status: 'active',
      rawVolunteer: {
        ...safeVol,
        id: cardId,
        name: cardName,
        fatherName: cardFatherName,
        phone: volunteerPhone,
        role: cardRole,
        area: cardArea,
        bloodGroup: cardBloodGroup,
        photoUrl: photoUrl || safeVol.photoUrl,
        country: address.country,
        state: address.state,
        district: address.district,
        block: address.block,
        wardOrVillage: address.wardOrVillage
      } as Volunteer
    });
  }, [cardId, cardName, cardFatherName, cardRole, cardArea, cardBloodGroup, cardJoinDate, photoUrl, address, volunteerPhone]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotoUrl(uploadEvent.target.result as string);
          setPhotoError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateRequirements = (): boolean => {
    if (!photoUrl) {
      setPhotoUrl('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80');
    }
    if (!address.wardOrVillage?.trim()) {
      setAddress((prev) => ({
        ...prev,
        wardOrVillage: 'मीरानपुर (Miranpur)'
      }));
    }
    setPhotoError(null);
    return true;
  };

  const handlePrint = () => {
    if (!validateRequirements()) return;
    setPendingFormat('print');
    setIsOtpOpen(true);
  };

  const handleInitiateDownload = (format: 'jpg' | 'png' | 'pdf') => {
    if (!validateRequirements()) return;
    setPendingFormat(format);
    setIsOtpOpen(true);
  };

  const handleOtpVerified = () => {
    if (pendingFormat === 'pdf') {
      executeDownloadPdf();
    } else if (pendingFormat === 'jpg') {
      executeDownloadJpg();
    } else if (pendingFormat === 'png') {
      executeDownloadPng();
    } else if (pendingFormat === 'print') {
      directPrintElement(cardRef.current);
    }
    setPendingFormat(null);
  };

  const executeDownloadJpg = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading('jpg');
    try {
      const fileName = `ID_Card_${(cardName || 'Volunteer').replace(/\s+/g, '_')}`;
      const highResScale = (typeof window !== 'undefined' ? (window.devicePixelRatio || 1) * 3 : 3.5);
      await exportElementAsJpg(cardRef.current, fileName, {
        pixelRatio: highResScale,
        quality: 0.98,
        backgroundColor: '#FFFFFF'
      });
    } finally {
      setDownloading(null);
    }
  };

  const executeDownloadPng = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading('png');
    try {
      const fileName = `ID_Card_${(cardName || 'Volunteer').replace(/\s+/g, '_')}`;
      const highResScale = (typeof window !== 'undefined' ? (window.devicePixelRatio || 1) * 3 : 3.5);
      await exportElementAsPng(cardRef.current, fileName, {
        pixelRatio: highResScale,
        backgroundColor: '#FFFFFF'
      });
    } finally {
      setDownloading(null);
    }
  };

  const executeDownloadPdf = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading('pdf');
    try {
      const fileName = `ID_Card_${(cardName || 'Volunteer').replace(/\s+/g, '_')}`;
      const highResScale = (typeof window !== 'undefined' ? (window.devicePixelRatio || 1) * 3 : 3.5);
      await exportElementAsPdf(cardRef.current, fileName, {
        orientation: 'portrait',
        isIdCard: true,
        pixelRatio: highResScale
      });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto p-2 sm:p-4 md:p-6 flex items-start sm:items-center justify-center py-4 sm:py-8 overscroll-contain touch-pan-y">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 gap-2.5 no-print sticky -top-4 bg-white z-10 pt-1">
          <div>
            <h3 className="font-bold text-gray-900 text-base sm:text-lg">
              आधिकारिक स्वयंसेवक पहचान पत्र (ID Card)
            </h3>
            <p className="text-xs text-gray-500 font-medium">Jeevan Jyoti Foundation Official Volunteer Pass</p>
          </div>
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setShowFullFormEdit(!showFullFormEdit)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                showFullFormEdit
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{showFullFormEdit ? 'कार्ड देखें' : 'फॉर्म भरें / संपादित करें'}</span>
            </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                  photoUrl
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{photoUrl ? 'फोटो बदलें' : 'फोटो *'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!photoUrl) {
                    setPhotoError('पहचान पत्र हेतु फोटो अनिवार्य है!');
                    return;
                  }
                  setShareModalTab('whatsapp');
                  setShareModalOpen(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                title="Send ID Card to WhatsApp Number"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!photoUrl) {
                    setPhotoError('पहचान पत्र हेतु फोटो अनिवार्य है!');
                    return;
                  }
                  setShareModalTab('email');
                  setShareModalOpen(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#0024B8] hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                title="Send ID Card to Email Address"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>ईमेल</span>
              </button>

              {/* Certificate Language Toggle */}
              <CertificateLanguageToggle
                language={certLanguage}
                onLanguageChange={setCertLanguage}
              />

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold cursor-pointer"
                title="Print ID Card"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>प्रिंट</span>
              </button>
              <button
                type="button"
                onClick={() => handleInitiateDownload('jpg')}
                disabled={downloading !== null}
                title="Download ID Card JPG (300 DPI)"
                className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloading === 'jpg' ? 'JPG...' : 'JPG'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleInitiateDownload('pdf')}
                disabled={downloading !== null}
                title="Download ID Card PDF"
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#8B0000] hover:bg-[#700000] text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs disabled:opacity-50"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{downloading === 'pdf' ? 'PDF...' : 'PDF'}</span>
              </button>

              {/* 📜 NEW: Swayam Sewak Appointment Letter on Letterhead */}
              <button
                type="button"
                onClick={() => setAppointmentModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg text-xs font-black cursor-pointer shadow-md border border-amber-300 transition-all hover:scale-102"
                title="संस्था के अधिकृत लेटरहेड पर स्वयंसेवक नियुक्ति पत्र (Appointment Letter) खोलें व डाउनलोड करें"
              >
                <FileText className="w-3.5 h-3.5 text-yellow-200" />
                <span>📜 नियुक्ति पत्र</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Top Dual Document Download Hub (ID Card & Appointment Letter) */}
          <div className="mt-2 mb-2.5 p-3 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 border-2 border-amber-300 shadow-xs flex flex-wrap items-center justify-between gap-2.5 no-print">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#8B0000] text-amber-300 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                📁
              </span>
              <div>
                <span className="text-xs font-black text-[#8B0000] block leading-tight">
                  स्वयंसेवक दस्तावेज़ डाउनलोड केंद्र (Dual Document Hub):
                </span>
                <span className="text-[10.5px] text-gray-700 font-medium">
                  नीचे दोनों आधिकारिक दस्तावेज़ 300 DPI में डाउनलोड करें:
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Option 1: ID Card Download */}
              <div className="inline-flex items-center bg-white rounded-xl border border-emerald-400 p-0.5 shadow-2xs">
                <span className="text-[11px] font-black text-emerald-900 px-2 flex items-center gap-1">
                  <span>🪪 ID कार्ड:</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleInitiateDownload('jpg')}
                  disabled={downloading !== null}
                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-black cursor-pointer shadow-2xs disabled:opacity-50"
                  title="ID कार्ड JPG डाउनलोड करें"
                >
                  {downloading === 'jpg' ? '...' : 'JPG'}
                </button>
                <button
                  type="button"
                  onClick={() => handleInitiateDownload('pdf')}
                  disabled={downloading !== null}
                  className="ml-1 px-2.5 py-1 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-black cursor-pointer shadow-2xs disabled:opacity-50"
                  title="ID कार्ड PDF डाउनलोड करें"
                >
                  {downloading === 'pdf' ? '...' : 'PDF'}
                </button>
              </div>

              {/* Option 2: Appointment Letter Download */}
              <button
                type="button"
                onClick={() => setAppointmentModalOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs border border-amber-300 hover:scale-102"
                title="संस्था के अधिकृत लेटरहेड पर A4 नियुक्ति पत्र (Appointment Letter) खोलें व डाउनलोड करें"
              >
                <FileText className="w-3.5 h-3.5 text-yellow-200" />
                <span>📜 अपॉइंटमेंट लेटर डाउनलोड (A4)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowFullFormEdit(!showFullFormEdit)}
                className="text-[11px] font-bold text-slate-600 hover:text-amber-800 underline flex items-center gap-1 cursor-pointer ml-1"
              >
                <span>{showFullFormEdit ? '✕ संपादन बंद' : '✏️ संपादन'}</span>
              </button>
            </div>
          </div>

        {/* Photo Uploader Section (Only visible if user opens edit drawer) */}
        {showFullFormEdit && (
          <div className="pt-3 no-print">
            <CandidatePhotoUploader
              photoUrl={photoUrl}
              onPhotoChange={(url) => {
                setPhotoUrl(url);
                setPhotoError(null);
              }}
              onPhotoRemove={() => setPhotoUrl('')}
              required={false}
              label="स्वयंसेवक का पासपोर्ट फोटो (Volunteer Photo - कैमरा या गैलरी)"
              subLabel="पहचान पत्र पर रंगीन फोटो मुद्रित करने हेतु (गैलरी से चुनें या लाइव कैमरा से खींचें)"
            />
          </div>
        )}

        {/* Full Form Edit Drawer */}
        {showFullFormEdit && (
          <div className="bg-amber-50/95 border-2 border-amber-300 rounded-xl p-3.5 my-3 no-print space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <div className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-700" />
                <span>स्वयंसेवक पहचान पत्र विवरण फॉर्म (Live Form Fill)</span>
              </div>
              <span className="text-[10px] font-bold text-green-800 bg-green-100 px-2 py-0.5 rounded">
                कार्ड पर तुरंत अपडेट होगा
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-gray-800 mb-1">
                  स्वयंसेवक का नाम (Volunteer Full Name) *
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="उदा. श्री विकास कुमार / श्रीमती सुनीता देवी"
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Relation & Father/Husband Name */}
              <div className="p-2.5 bg-white rounded-xl border border-amber-200 sm:col-span-2 space-y-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-800 mb-1">
                    संबंध प्रकार (Relation Type) *
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCardRelationType('Father')}
                      className={`py-1 px-2 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                        cardRelationType === 'Father'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      👨‍🦳 पिता (Father)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardRelationType('Husband')}
                      className={`py-1 px-2 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                        cardRelationType === 'Husband'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      💍 पति/जीवनसाथी
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardRelationType('Guardian')}
                      className={`py-1 px-2 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                        cardRelationType === 'Guardian'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      🛡️ अभिभावक
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-800 mb-1">
                    {cardRelationType === 'Husband'
                      ? 'पति / जीवनसाथी का नाम (Husband / Spouse Name) *'
                      : cardRelationType === 'Guardian'
                      ? 'अभिभावक का नाम (Guardian Name) *'
                      : 'पिता का नाम (Father\'s Name) *'}
                  </label>
                  <input
                    type="text"
                    value={cardFatherName}
                    onChange={(e) => setCardFatherName(e.target.value)}
                    placeholder={
                      cardRelationType === 'Husband'
                        ? 'उदा. श्री अमित कुमार (पति / जीवनसाथी का नाम)'
                        : cardRelationType === 'Guardian'
                        ? 'उदा. श्री सुरेश कुमार (अभिभावक का नाम)'
                        : 'उदा. श्री रामेश्वर शर्मा (पिता का नाम)'
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Phone & Blood Group */}
              <div>
                <label className="block text-[11px] font-bold text-gray-800 mb-1">
                  मोबाइल नंबर (Mobile No.) *
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={volunteerPhone.replace('+91-', '')}
                  onChange={(e) => setVolunteerPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10 अंकों का मोबाइल नंबर"
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-800 mb-1">
                  रक्त समूह (Blood Group)
                </label>
                <select
                  value={cardBloodGroup}
                  onChange={(e) => setCardBloodGroup(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
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

              {/* Role & Area */}
              <div>
                <label className="block text-[11px] font-bold text-gray-800 mb-1">
                  पद / भूमिका (Role)
                </label>
                <input
                  type="text"
                  value={cardRole}
                  onChange={(e) => setCardRole(e.target.value)}
                  placeholder="उदा. Dedicated Swayam Sewak"
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-800 mb-1">
                  सेवा क्षेत्र (Service Sector)
                </label>
                <input
                  type="text"
                  value={cardArea}
                  onChange={(e) => setCardArea(e.target.value)}
                  placeholder="उदा. शिक्षा एवं निःशुल्क पाठशाला"
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Vol ID & Issue Date */}
              <div>
                <label className="block text-[11px] font-bold text-gray-800 mb-1">
                  पहचान पत्र क्रमांक (Vol ID)
                </label>
                <input
                  type="text"
                  value={cardId}
                  onChange={(e) => setCardId(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-gray-800">
                    जारी तिथि (Issue Date)
                  </label>
                  <button
                    type="button"
                    onClick={() => setCardJoinDate(formatCertificateIssueDate(new Date()))}
                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                  >
                    🔄 आज की तिथि
                  </button>
                </div>
                <input
                  type="text"
                  value={cardJoinDate}
                  onChange={(e) => setCardJoinDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Address Selector */}
            <div className="pt-2 border-t border-amber-200">
              <label className="block text-[11px] font-bold text-gray-800 mb-1">
                आधिकारिक डाक पता (Official Postal Address) *
              </label>
              <StructuredAddressSelector
                value={address}
                onChange={setAddress}
                required={true}
                compact={true}
                labelPrefix="पहचान पत्र पता"
              />
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />

        <div className="py-4 flex justify-center">
          <div
            ref={cardRef}
            id="swayam-sewak-id-card"
            className="printable-certificate w-[360px] sm:w-[370px] bg-white border-2 border-amber-400 rounded-2xl shadow-2xl overflow-hidden relative select-none text-left"
            style={{
              boxShadow: '0 20px 45px -12px rgba(0,0,0,0.35)',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {/* Background Watermark Pattern */}
            <div
              id="swayam-card-watermark"
              className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0"
            >
              <BrandLogo size={210} watermark opacity={0.06} />
            </div>

            {/* Top Lanyard Clip Indicator Slot */}
            <div className="w-14 h-2 bg-gray-300 rounded-full border border-gray-400 mx-auto mt-1.5 mb-1 shadow-inner relative z-10" />

            {/* Top Header: Gradient Banner with Organization Title */}
            <div className="relative bg-gradient-to-b from-[#8B0000] via-[#750000] to-[#500000] text-white pt-2.5 pb-2.5 px-3 text-center border-b-2 border-amber-400 shadow-md z-10">
              {/* Holographic Seal Indicator in Corner */}
              <div className="absolute top-2 right-2.5 flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-100 to-amber-500 border border-amber-200 flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-3 h-3 text-[#8B0000]" />
                </div>
                <span className="text-[6.5px] text-amber-200 font-bold tracking-tighter mt-0.5">ORIGINAL</span>
              </div>

              {/* Foundation Emblem & Name */}
              <div className="flex items-center justify-center gap-2.5 mb-1">
                <div className="p-0.5 bg-white rounded-full shadow-md shrink-0 border border-amber-300">
                  <BrandLogo size={34} id="swayam-card-top-logo" />
                </div>
                <div className="text-center">
                  <h1 className="font-black text-[14px] leading-tight text-white tracking-tight font-serif drop-shadow-xs">
                    {FOUNDATION_INFO.nameHindi}
                  </h1>
                  <div className="text-[9.5px] font-bold text-amber-300 tracking-wider uppercase mt-0.5 font-sans">
                    {FOUNDATION_INFO.nameEnglish}
                  </div>
                </div>
              </div>

              {/* Official NGO Contact Pill */}
              <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/60 backdrop-blur-xs text-amber-200 shadow-2xs mb-1">
                <span className="text-[8.5px] font-black font-mono tracking-wider text-amber-100">
                  हेल्पलाइन: (+91) 8052361666 • www.jeevanjyotifoundation.org
                </span>
              </div>

              {/* Registration & Accreditation sub-banner */}
              <div className="text-[8px] font-semibold text-amber-100/90 tracking-tight flex items-center justify-center gap-1.5 flex-wrap">
                <span>पंजीकरण: <strong>UP/2018/0207700</strong></span>
                <span>•</span>
                <span>नीति आयोग: <strong>UP/2021/0285918</strong></span>
              </div>

              {/* Golden Badge Header Strip */}
              <div className="mt-1.5 py-0.5 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 rounded-full text-[#8B0000] font-black text-[9.5px] tracking-wider uppercase shadow-xs flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#8B0000]" />
                <span>
                  {certLanguage === 'hi'
                    ? 'आधिकारिक स्वयंसेवक पहचान पत्र'
                    : 'SWAYAM SEWAK OFFICIAL IDENTITY CARD'}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-3.5 space-y-2.5 bg-[#FFFDF9] relative z-10">
              {/* Photo & Identity Section */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative w-22 h-26 overflow-visible flex items-center justify-center">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    title={certLanguage === 'hi' ? 'फोटो अपलोड/बदलने के लिए क्लिक करें' : 'Click to upload/change photo'}
                    className={`relative w-full h-full rounded-xl p-1 bg-gradient-to-b from-amber-400 via-yellow-200 to-amber-500 shadow-md border border-amber-300 flex items-center justify-center cursor-pointer group overflow-hidden ${
                      photoUrl
                        ? 'hover:ring-2 hover:ring-emerald-500'
                        : 'hover:border-red-500'
                    }`}
                  >
                    {photoUrl ? (
                      <>
                        <img
                          src={photoUrl}
                          alt={cardName || 'Volunteer'}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-md border border-white z-25">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <div className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity rounded-lg no-print z-30">
                          <Camera className="w-4 h-4 mb-0.5" />
                          <span className="text-[7pt] font-black">{certLanguage === 'hi' ? 'बदलें' : 'Change'}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center p-2 text-center bg-red-50/80 w-full h-full rounded-lg justify-center">
                        <Camera className="w-6 h-6 text-red-600 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-[7pt] font-black text-red-700 uppercase">
                          {certLanguage === 'hi' ? 'फोटो अनिवार्य' : 'PHOTO *'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Digitally Attested Official Attached Cross Stamp across bottom portion - 100% Complete & Uncut */}
                  {photoUrl && (
                    <div
                      className="absolute -bottom-3 -left-3.5 -right-3.5 pointer-events-none select-none z-20 flex items-center justify-center"
                      style={{
                        transform: 'rotate(-9deg)',
                        transformOrigin: 'center center'
                      }}
                    >
                      <img
                        src="/assets/aistudio/IMG_20261020_133052_0b52a993.png"
                        onError={(e) => {
                          if (e.currentTarget.src !== '/uploads/official_stamp.png') {
                            e.currentTarget.src = '/uploads/official_stamp.png';
                          }
                        }}
                        alt="Official Seal"
                        className="w-[108px] max-w-none h-auto max-h-12 object-contain filter contrast-160 brightness-95 mix-blend-multiply drop-shadow-[0_1px_2px_rgba(20,40,100,0.3)]"
                      />
                    </div>
                  )}
                </div>

                {/* Verified Pill */}
                <div className="mt-1.5 flex items-center justify-center gap-1">
                  <span className={`text-[7.5pt] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-2xs ${
                    photoUrl ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-red-100 text-red-700 border-red-300 animate-pulse'
                  }`}>
                    {photoUrl ? '✓ सत्यापित स्वयंसेवक (VERIFIED)' : '⚠️ फोटो अपलोड करें'}
                  </span>
                  {cardBloodGroup && (
                    <span className="text-[7.5pt] font-black text-red-800 bg-red-100 border border-red-300 px-1.5 py-0.5 rounded-full">
                      {cardBloodGroup}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-black text-slate-900 mt-1 leading-snug">
                  {cardName}
                </h4>
                <div className="inline-block px-3 py-0.5 bg-gradient-to-r from-[#8B0000] to-red-800 text-yellow-300 text-[10px] font-black uppercase tracking-wider rounded-full shadow-xs mt-0.5">
                  {cardRole}
                </div>
              </div>

              {/* Details Key-Value Table (Clean Professional Alignment) */}
              <div className="bg-amber-50/80 rounded-xl p-3 border border-amber-200/90 shadow-2xs space-y-1.5 text-[10px]">
                {/* Row 1: ID No */}
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-1">
                  <span className="text-[#8B0000] font-black flex items-center gap-1">
                    <span>🆔</span>
                    <span>{cardMatter.idNoLabel || 'पहचान पत्र क्रमांक:'}</span>
                  </span>
                  <span className="font-mono font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-300 shadow-2xs">
                    {cardId}
                  </span>
                </div>

                {/* Row 2: Relation / Father Name */}
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-1">
                  <span className="text-slate-600 font-bold">
                    {cardRelationType === 'Husband'
                      ? 'पति (Husband):'
                      : cardRelationType === 'Guardian'
                      ? 'अभिभावक (Guardian):'
                      : 'पिता (Father):'}
                  </span>
                  <span className="font-black text-slate-900 text-right">
                    {cardFatherName}
                  </span>
                </div>

                {/* Row 3: Mobile Phone */}
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-1">
                  <span className="text-slate-600 font-bold">मोबाइल (Mobile):</span>
                  <span className="font-mono font-black text-slate-900 text-right">
                    +91-{volunteerPhone.replace(/[^0-9]/g, '').slice(-10)}
                  </span>
                </div>

                {/* Row 4: Service Area */}
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-1">
                  <span className="text-slate-600 font-bold">{cardMatter.areaLabel || 'सेवा क्षेत्र:'}</span>
                  <span className="font-black text-emerald-800 text-right max-w-[210px] truncate">
                    {cardArea}
                  </span>
                </div>

                {/* Row 5: Postal Address */}
                <div className="flex items-start justify-between border-b border-amber-200/60 pb-1">
                  <span className="text-slate-600 font-bold shrink-0">{cardMatter.addressLabel || 'डाक पता:'}</span>
                  <span className="font-bold text-slate-800 text-right max-w-[210px] leading-tight">
                    {address.wardOrVillage ? `${address.wardOrVillage}, ` : ''}
                    {address.block ? `${address.block}, ` : ''}
                    {address.district || 'गाज़ीपुर'} ({address.state || 'उ.प्र.'})
                  </span>
                </div>

                {/* Row 6: Issue Date */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-bold">
                    {certLanguage === 'hi' ? 'जारी दिनांक:' : 'Issue Date:'}
                  </span>
                  <span className="font-black text-slate-700">
                    {cardJoinDate}
                  </span>
                </div>
              </div>

              {/* Bottom Security, Seal & Signature Block (3-Column Balanced Alignment) */}
              <div className="pt-2 border-t-2 border-amber-300 grid grid-cols-3 items-end gap-1">
                {/* Left: QR Verification */}
                <div className="text-center flex flex-col items-center">
                  <CertificateVerificationQR certificateId={cardId} size="auto" />
                  <span className="text-[7.5px] font-bold text-slate-600 block mt-0.5">
                    स्कैन सत्यापन
                  </span>
                </div>

                {/* Center: Official NGO Round Seal */}
                <div className="text-center flex flex-col items-center justify-center">
                  <NgoRoundSeal size="auto" className="max-w-[62px]" />
                  <span className="text-[7px] font-black text-[#8B0000] uppercase tracking-wider block mt-0.5">
                    आधिकारिक मुहर
                  </span>
                </div>

                {/* Right: Authorized Signature */}
                <div className="text-center flex flex-col items-center">
                  <ShaileshPradhanSignature size="auto" className="w-full max-w-[95px]" />
                  <div className="border-t border-[#8B0000]/40 pt-0.5 w-full text-center">
                    <div className="text-[8.5px] font-black text-slate-900 leading-tight">
                      शैलेश प्रधान
                    </div>
                    <div className="text-[7px] font-bold text-[#8B0000] leading-tight">
                      प्रबंधक एवं सचिव
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Verified Badge */}
              <div className="flex justify-center pt-0.5">
                <OfficialVerifiedBadge
                  certificateId={cardId}
                  verificationDate={cardJoinDate}
                  language={certLanguage}
                  size="compact"
                  theme="gold"
                />
              </div>
            </div>

            {/* Bottom Strip */}
            <div className="bg-slate-950 text-white text-center py-1.5 text-[8px] font-bold tracking-wider border-t border-amber-400 flex items-center justify-around px-3 z-10 relative">
              <span>सेवा • शिक्षा • स्वास्थ्य • स्वावलम्बन</span>
              <span>•</span>
              <span className="font-mono text-amber-300">Reg: UP/2018/0207700</span>
              <span>•</span>
              <span>DIGIPIN: 2J6T226CL2</span>
            </div>
          </div>
        </div>

        {/* OTP Verification Modal for Secure Volunteer ID Card Download */}
        <OtpVerificationModal
          isOpen={isOtpOpen}
          onClose={() => setIsOtpOpen(false)}
          phoneNumber={volunteerPhone}
          onSuccess={handleOtpVerified}
          certificateId={cardId}
          recipientName={cardName}
          certificateType="volunteer_id"
          title="पहचान पत्र डाउनलोड - OTP सत्यापन"
          subtitle="सुरक्षा सत्यापन: स्वयंसेवक पहचान पत्र डाउनलोड करने हेतु पंजीकृत मोबाइल नंबर पर भेजा गया 6-अंकीय OTP सत्यापित करें।"
        />

        {/* Send Certificate / ID Card via WhatsApp & Email Modal */}
        {shareModalOpen && (
          <SendCertificateModal
            isOpen={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
            defaultTab={shareModalTab}
            data={{
              certificateType: 'volunteer_id',
              titleHindi: 'आधिकारिक स्वयंसेवक पहचान पत्र (ID Pass)',
              titleEnglish: 'Official Volunteer Identity Pass Card',
              recipientName: cardName,
              fatherName: cardFatherName,
              recipientPhone: volunteerPhone,
              certificateNo: cardId,
              issueDate: cardJoinDate,
              role: cardRole,
              area: cardArea,
              address: `${address.wardOrVillage || ''}, ${address.block || ''}, ${address.district || ''}`,
              photoUrl: photoUrl || undefined
            }}
          />
        )}

        {/* 📜 Official Swayam Sewak Appointment Letter Modal */}
        {appointmentModalOpen && (
          <AppointmentLetterModal
            isOpen={appointmentModalOpen}
            onClose={() => setAppointmentModalOpen(false)}
            type="volunteer"
            volunteerData={{
              id: cardId,
              name: cardName,
              fatherName: cardFatherName,
              relationType: cardRelationType,
              role: cardRole,
              area: cardArea,
              phone: volunteerPhone,
              photoUrl: photoUrl || safeVol.photoUrl,
              address: `${address.wardOrVillage || ''}, ब्लॉक ${address.block || ''}, जनपद ${address.district || ''}, ${address.state || ''} - 233303`,
              issueDate: cardJoinDate
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SwayamSewakCardModal;
