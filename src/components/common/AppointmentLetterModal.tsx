// ============================================================================
// JEEVAN JYOTI FOUNDATION - OFFICIAL APPOINTMENT LETTER (LETTERHEAD FORMAT)
// जीवन ज्योति फाउंडेशन - आधिकारिक नियुक्ति पत्र (लेटरहेड प्रारूप)
// स्वयंसेवक (Volunteer) एवं स्टाफ (Staff) नियुक्ति पत्र हेतु A4 300 DPI प्रिंट-रेडी
// ============================================================================

import React, { useRef, useState } from 'react';
import {
  X,
  Download,
  Printer,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Award,
  UserCheck,
  FileText,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Calendar,
  Building
} from 'lucide-react';
import { FOUNDATION_INFO } from '../../data/foundationData';
import { BrandLogo } from './BrandLogo';
import { ShaileshPradhanSignature, NgoRoundSeal } from '../DigitalSignature';
import { QRCodeSVG } from 'qrcode.react';
import { exportElementAsPdf, exportElementAsPng, exportElementAsJpg, directPrintElement } from '../../utils/exportImage';
import { OfficialLetterheadA4 } from './OfficialLetterheadA4';
import toast from 'react-hot-toast';

export interface VolunteerAppointmentData {
  id: string;
  name: string;
  fatherName?: string;
  relationType?: string;
  role?: string;
  area?: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
  address?: string;
  issueDate?: string;
}

export interface StaffAppointmentData {
  id: string;
  fullName: string;
  fatherOrHusbandName?: string;
  relationType?: string;
  designation: string;
  department: string;
  dutyLocation: string;
  mobile: string;
  email?: string;
  photoUrl?: string;
  bloodGroup?: string;
  qualification?: string;
  dateOfJoining?: string;
  address?: string;
}

export type AppointmentLetterType = 'volunteer' | 'staff';

interface AppointmentLetterDocumentProps {
  id?: string;
  type: AppointmentLetterType;
  volunteerData?: VolunteerAppointmentData;
  staffData?: StaffAppointmentData;
  hideLetterheadBackground?: boolean;
}

/**
 * Pure Letterhead Document Layout (Optimized for standard A4 Portrait Print & 300 DPI PDF)
 */
export const AppointmentLetterDocument: React.FC<AppointmentLetterDocumentProps> = ({
  id = 'appointment-letter-a4',
  type,
  volunteerData,
  staffData,
  hideLetterheadBackground = false
}) => {
  const isVolunteer = type === 'volunteer';

  // Computed Fields
  const recipientName = isVolunteer
    ? volunteerData?.name || 'श्री समाज सेवी'
    : staffData?.fullName || 'श्री स्टाफ सदस्य';

  const fatherOrHusband = isVolunteer
    ? volunteerData?.fatherName || 'श्री समाज सेवी'
    : staffData?.fatherOrHusbandName || 'श्री अभिभावक';

  const candidateId = isVolunteer
    ? volunteerData?.id || 'JJF-VOL-2026-0001'
    : staffData?.id || 'JJF-STF-2026-0001';

  const candidatePhone = isVolunteer
    ? volunteerData?.phone || FOUNDATION_INFO.phone
    : staffData?.mobile || FOUNDATION_INFO.phone;

  const candidatePhoto = isVolunteer
    ? volunteerData?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80'
    : staffData?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80';

  const candidateAddress = isVolunteer
    ? volunteerData?.address || FOUNDATION_INFO.address
    : staffData?.address || FOUNDATION_INFO.address;

  const issueDate = isVolunteer
    ? volunteerData?.issueDate || new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : staffData?.dateOfJoining || new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  // Reference Number
  const refNo = isVolunteer
    ? `JJF/APPT-VOL/2026/${candidateId.replace(/[^0-9]/g, '').slice(-4).padStart(4, '0') || '0001'}`
    : `JJF/APPT-STF/2026/${candidateId.replace(/[^0-9]/g, '').slice(-4).padStart(4, '0') || '0001'}`;

  // Subject line
  const subject = isVolunteer
    ? 'संस्था के अधिकृत मानद स्वयंसेवक (Social Service Volunteer) पद पर नियुक्ति एवं दायित्व पत्र'
    : `संस्था में आधिकारिक स्टाफ नियुक्ति आदेश (Staff Appointment Letter) — ${staffData?.designation || 'स्टाफ सदस्य'}`;

  // Verification URL
  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?verify=${encodeURIComponent(candidateId)}`
    : `https://jeevanjyotifoundation.org/?verify=${encodeURIComponent(candidateId)}`;

  return (
    <OfficialLetterheadA4
      id={id}
      refNo={refNo}
      dateStr={issueDate}
      subject={subject}
      hideLetterheadBackground={hideLetterheadBackground}
      className="printable-appointment-letter shadow-2xl"
    >
      {/* 1. APPOINTEE PROFILE CARD WITH PHOTO & QR CODE SIDE-BY-SIDE */}
      <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-300 shadow-2xs mb-2 flex items-center justify-between gap-3">
        {/* Left: Appointee Data */}
        <div className="flex-1 space-y-1 text-slate-800 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">सेवा में / To:</span>
            <span className="text-[13px] font-black text-slate-950 truncate">{recipientName}</span>
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
              {isVolunteer ? '✓ अधिकृत स्वयंसेवक' : '✓ अधिकृत स्टाफ सदस्य'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10.5px]">
            <div><strong>पिता/पति:</strong> {fatherOrHusband}</div>
            <div><strong>पहचान संख्या:</strong> <span className="font-mono font-black text-blue-900">{candidateId}</span></div>
            <div><strong>पदनाम (Role):</strong> {isVolunteer ? (volunteerData?.role || 'Dedicated Swayam Sewak') : staffData?.designation}</div>
            <div><strong>विभाग (Dept):</strong> {isVolunteer ? (volunteerData?.area || 'शिक्षा एवं सामाजिक सेवा') : staffData?.department}</div>
            <div><strong>रजिस्टर्ड मोबाइल:</strong> +91 {candidatePhone}</div>
            <div><strong>कार्यक्षेत्र (Duty):</strong> {isVolunteer ? 'जनपद ग़ाज़ीपुर एवं ग्रामीण क्षेत्र' : (staffData?.dutyLocation || 'ग़ाज़ीपुर एवं पूर्वांचल')}</div>
          </div>

          <div className="text-[10px] text-slate-700 truncate">
            <strong>पंजीकृत पता (Postal Address):</strong> {candidateAddress}
          </div>
        </div>

        {/* Right: Candidate Photo + Verification QR Code Side-by-Side */}
        <div className="shrink-0 flex items-center gap-3 bg-white p-2 rounded-xl border-2 border-amber-300 shadow-xs overflow-visible">
          {/* Candidate Photo with Uncut Official Rubber Stamp Overlay */}
          <div className="flex flex-col items-center">
            {/* Outer relative container with overflow-visible so the stamp bleeds cleanly on left, right, and bottom without getting cut */}
            <div className="relative w-[66px] h-[78px] flex items-center justify-center">
              {/* Photo Box with rounded corners and border */}
              <div className="w-[62px] h-[76px] rounded-lg border-2 border-amber-500 overflow-hidden shadow-2xs bg-slate-100">
                <img
                  src={candidatePhoto}
                  alt={recipientName}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>

              {/* Verified check badge at top-right of photo */}
              <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5 border border-white z-20 shadow-xs">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>

              {/* Official Attestation Cross Stamp - 100% Complete & Uncut across photo, left, right, and bottom */}
              <div
                className="absolute -bottom-2.5 -left-3.5 -right-3.5 pointer-events-none select-none z-30 flex items-center justify-center"
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
                  className="w-[94px] max-w-none h-auto max-h-12 object-contain filter contrast-160 brightness-95 mix-blend-multiply drop-shadow-[0_1px_2px_rgba(20,40,100,0.3)]"
                />
              </div>
            </div>
            <span className="text-[7.5px] font-black text-slate-700 uppercase mt-0.5 tracking-tight">
              सत्यापित फोटो
            </span>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center">
            <div className="p-1 bg-white border border-slate-300 rounded-lg shadow-2xs">
              <QRCodeSVG value={verifyUrl} size={62} level="M" />
            </div>
            <span className="text-[7.5px] font-black text-emerald-800 uppercase mt-0.5 tracking-tight">
              Scan to Verify ✓
            </span>
          </div>
        </div>
      </div>

      {/* 2. FORMAL APPOINTMENT CLAUSES & POLICIES */}
      <div className="space-y-1.5 text-xs text-slate-800 leading-snug flex-1 flex flex-col justify-between">
        <p className="font-semibold text-[11px] text-slate-900">
          महोदय / महोदया,
        </p>

        {isVolunteer ? (
          // VOLUNTEER APPOINTMENT LETTER BODY
          <>
            <p className="text-justify text-[11px] text-slate-800 leading-relaxed">
              जीवन ज्योति फाउंडेशन प्रबंध समिति आपके समाज सेवा, शिक्षा प्रसार, स्वास्थ्य कल्याण एवं दीन-दुखियों की सहायता के प्रति समर्पण एवं निस्वार्थ सेवा भावना की सराहना करती है। आपकी निष्ठा एवं मानवीय मूल्यों को दृष्टिगत रखते हुए आपको संस्था के <strong>'मानद स्वयंसेवक (Honorary Social Service Volunteer)'</strong> के रूप में सहर्ष नियुक्त एवं अधिकृत किया जाता है।
            </p>

            {/* Key Particulars Box */}
            <div className="p-2 bg-amber-50/60 rounded-lg border border-amber-200 text-[10.5px] space-y-0.5">
              <div className="font-bold text-[#8B0000] flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>नियुक्ति विवरण (Volunteer Deputation Particulars):</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 pt-0.5">
                <div>• <strong>नियुक्त पद:</strong> {volunteerData?.role || 'Dedicated Swayam Sewak'}</div>
                <div>• <strong>कार्य प्रकल्प:</strong> {volunteerData?.area || 'शिक्षा एवं सामाजिक सेवा'}</div>
                <div>• <strong>कार्यक्षेत्र:</strong> जनपद ग़ाज़ीपुर एवं आसपास के ग्रामीण क्षेत्र</div>
                <div>• <strong>नियुक्ति स्वरूप:</strong> पूर्णतः मानद एवं स्वैच्छिक समाज सेवा</div>
              </div>
            </div>

            <div className="space-y-1 text-[10.5px]">
              <div className="font-bold text-slate-900">
                दायित्व एवं आचार संहिता (Terms & Code of Conduct):
              </div>
              <ul className="list-decimal pl-4 space-y-0.5 text-slate-700 text-justify">
                <li>
                  <strong>सामाजिक सेवा में सहभागिता:</strong> आप संस्था के शिक्षा प्रकल्प (निःशुल्क पाठशाला), स्वास्थ्य शिविर, अन्नदान, रक्तदान एवं वृक्षारोपण अभियानों में पूर्ण निष्ठा से सहयोग करेंगे।
                </li>
                <li>
                  <strong>पहचान पत्र की अनिवार्यता:</strong> संस्था द्वारा जारी डिजिटल पहचान पत्र (Volunteer ID Card) कार्यक्षेत्र में अपने पास रखना अनिवार्य होगा।
                </li>
                <li>
                  <strong>संवैधानिक मर्यादा व अनुशासन:</strong> सेवा प्रकल्पों के क्रियान्वयन के दौरान संस्था की प्रतिष्ठा, सामाजिक समरसता एवं सरकारी नियमों का पूर्ण सम्मान सुनिश्चित करेंगे।
                </li>
                <li>
                  <strong>डिजिटल सत्यापन:</strong> यह नियुक्ति पत्र जीवन ज्योति फाउंडेशन के केंद्रीय सर्वर में सुरक्षित रूप से दर्ज है तथा क्यूआर कोड के माध्यम से कभी भी ऑनलाइन सत्यापित किया जा सकता है।
                </li>
              </ul>
            </div>
          </>
        ) : (
          // STAFF APPOINTMENT LETTER BODY
          <>
            <p className="text-justify text-[11px] text-slate-800 leading-relaxed">
              जीवन ज्योति फाउंडेशन प्रबंध समिति के निर्णय, आपकी शैक्षणिक योग्यता, अनुभव एवं चयन प्रक्रिया के आधार पर आपको संस्था में <strong>'{staffData?.designation || 'स्टाफ सदस्य'}'</strong> के पद पर <strong>'{staffData?.department || 'प्रशासन'}'</strong> विभाग में नियुक्त किया जाता है।
            </p>

            {/* Staff Particulars Table */}
            <div className="overflow-hidden rounded-lg border border-slate-300 text-[10.5px]">
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="bg-amber-50/70 border-b border-slate-200">
                    <td className="py-1 px-2.5 font-bold text-slate-700 w-1/4">पदनाम (Designation):</td>
                    <td className="py-1 px-2.5 font-black text-[#8B0000]">{staffData?.designation}</td>
                    <td className="py-1 px-2.5 font-bold text-slate-700 w-1/4">विभाग (Department):</td>
                    <td className="py-1 px-2.5 font-bold text-slate-900">{staffData?.department}</td>
                  </tr>
                  <tr className="bg-white border-b border-slate-200">
                    <td className="py-1 px-2.5 font-bold text-slate-700">कार्यक्षेत्र (Location):</td>
                    <td className="py-1 px-2.5 font-semibold text-slate-900">{staffData?.dutyLocation}</td>
                    <td className="py-1 px-2.5 font-bold text-slate-700">रक्त समूह (Blood):</td>
                    <td className="py-1 px-2.5 font-bold text-red-600">{staffData?.bloodGroup || 'N/A'}</td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="py-1 px-2.5 font-bold text-slate-700">योग्यता (Qualification):</td>
                    <td className="py-1 px-2.5 font-medium text-slate-800">{staffData?.qualification || 'Graduate'}</td>
                    <td className="py-1 px-2.5 font-bold text-slate-700">प्रभावी तिथि (Date):</td>
                    <td className="py-1 px-2.5 font-bold text-slate-900">{issueDate}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-1 text-[10.5px]">
              <div className="font-bold text-slate-900">
                नियम, शर्तें एवं कर्तव्य (Terms & Conditions of Service):
              </div>
              <ul className="list-decimal pl-4 space-y-0.5 text-slate-700 text-justify">
                <li>
                  <strong>दायित्व निर्वहन:</strong> आप अपने आवंटित कार्यक्षेत्र एवं विभाग में संस्था के विकास कार्यों, अभिलेख संधारण, परियोजना निगरानी एवं प्रशासनिक कार्यों का संपादन निर्धारित समय-सारणी के अनुरूप करेंगे।
                </li>
                <li>
                  <strong>आधिकारिक पहचान पत्र:</strong> ड्यूटी के दौरान संस्था द्वारा प्रदत्त 2-Page स्टाफ पहचान पत्र (Staff Identity Card) धारण करना अनिवार्य होगा।
                </li>
                <li>
                  <strong>गोपनीयता व अनुशासन:</strong> संस्था की नीतियों, वित्तीय पारदर्शिता, समयबद्धता एवं सेवा आचार संहिता का पूर्ण निष्ठा से पालन करना अनिवार्य है।
                </li>
                <li>
                  <strong>समीक्षा एवं पुष्टि:</strong> कार्य निष्पादन, त्रैमासिक समीक्षा एवं संस्था के सेवा नियमावली के अंतर्गत सेवा शर्तों का संचालन होगा।
                </li>
              </ul>
            </div>
          </>
        )}

        <p className="text-[10px] font-semibold text-emerald-900 pt-0.5 text-center">
          संस्था आपके उज्ज्वल भविष्य एवं संस्था के साथ सफल, फलदायी समाज-कल्याण यात्रा की मंगलकामना करती है।
        </p>
      </div>

      {/* 3. SIGNATORIES ROW (SEAL + QR VERIFICATION STAMP + SIGNATURE) */}
      <div className="pt-2 border-t-2 border-slate-300 mt-2">
        <div className="grid grid-cols-3 items-end gap-2 text-center pb-1">
          {/* Left: Official Round Seal Image */}
          <div className="flex flex-col items-center justify-center">
            <img
              src="/official-seal.png"
              alt="Official Foundation Seal"
              className="w-[66px] h-[66px] object-contain drop-shadow-xs"
              crossOrigin="anonymous"
            />
            <span className="text-[7.5px] font-black uppercase text-[#8B0000] mt-0.5">
              अधिकृत संस्था सील
            </span>
          </div>

          {/* Center: Central Database Verification Stamp */}
          <div className="flex flex-col items-center justify-center">
            <div className="px-3 py-1 bg-amber-50 rounded-lg border border-amber-300 shadow-2xs text-center">
              <div className="text-[8px] font-black text-emerald-900 uppercase tracking-tight flex items-center justify-center gap-1">
                <span>✓</span>
                <span>DIGITALLY VERIFIED</span>
              </div>
              <div className="text-[7px] font-mono text-slate-600 mt-0.5">
                UID: {candidateId}
              </div>
              <div className="text-[6.5px] text-slate-500 font-medium">
                ISO 9001:2015 & Govt. Registered
              </div>
            </div>
          </div>

          {/* Right: Authorized Signatory Block */}
          <div className="flex flex-col items-center justify-center text-center">
            <img
              src="/signature-shailesh-royalblue.png"
              alt="Shailesh Pradhan Signature"
              className="h-[38px] object-contain"
              crossOrigin="anonymous"
            />
            <div className="border-t border-[#8B0000] pt-0.5 mt-0.5 w-full max-w-[155px]">
              <div className="text-[10px] font-black text-[#8B0000] tracking-wide leading-tight">
                शैलेश प्रधान (Shailesh Pradhan)
              </div>
              <div className="text-[8.5px] font-bold text-slate-800 leading-tight">
                प्रबंधक / राष्ट्रीय सचिव
              </div>
              <div className="text-[7.5px] font-semibold text-slate-600 uppercase leading-tight">
                जीवन ज्योति फाउंडेशन
              </div>
            </div>
          </div>
        </div>
      </div>
    </OfficialLetterheadA4>
  );
};

// ============================================================================
// APPOINTMENT LETTER MODAL (PREVIEW, A4 PDF DOWNLOAD, PRINT, SHARE)
// ============================================================================

interface AppointmentLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: AppointmentLetterType;
  volunteerData?: VolunteerAppointmentData;
  staffData?: StaffAppointmentData;
}

export const AppointmentLetterModal: React.FC<AppointmentLetterModalProps> = ({
  isOpen,
  onClose,
  type,
  volunteerData,
  staffData
}) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [letterheadMode, setLetterheadMode] = useState<'full' | 'stationery'>('full');

  if (!isOpen) return null;

  const isVolunteer = type === 'volunteer';
  const recipientName = isVolunteer ? volunteerData?.name || 'स्वयंसेवक' : staffData?.fullName || 'स्टाफ';
  const candidateId = isVolunteer ? volunteerData?.id || 'JJF-VOL' : staffData?.id || 'JJF-STF';

  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?verify=${encodeURIComponent(candidateId)}`
    : `https://jeevanjyotifoundation.org/?verify=${encodeURIComponent(candidateId)}`;

  // Download High-Definition A4 PDF
  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;
    setIsExporting('pdf');
    const toastId = toast.loading('उच्च-गुणवत्ता A4 नियुक्ति पत्र PDF तैयार हो रही है...');

    try {
      const sanitizedName = recipientName.replace(/[^a-zA-Z0-9]/g, '_');
      const prefix = isVolunteer ? 'JJF_Volunteer_Appointment' : 'JJF_Staff_Appointment';
      const fileName = `${prefix}_${candidateId.replace(/[\/\\]/g, '_')}_${sanitizedName}`;

      const highResScale = (typeof window !== 'undefined' ? (window.devicePixelRatio || 1) * 3 : 3.5);
      const success = await exportElementAsPdf(documentRef.current, fileName, {
        orientation: 'portrait',
        pixelRatio: highResScale,
        backgroundColor: '#FFFFFF',
        isFullBleedA4: true
      });

      if (success) {
        toast.success('नियुक्ति पत्र A4 PDF सफलतापूर्वक डाउनलोड हो गया!', { id: toastId });
      } else {
        throw new Error('PDF Export failed');
      }
    } catch (err) {
      console.error('Appointment letter export error:', err);
      toast.error('PDF बनाने में त्रुटि आई। कृपया प्रिंट विकल्प का प्रयोग करें।', { id: toastId });
    } finally {
      setIsExporting(null);
    }
  };

  // Direct Print
  const handlePrint = () => {
    if (!documentRef.current) return;
    directPrintElement(documentRef.current);
  };

  // Download High-Res JPG (Portrait 1-Page A4)
  const handleDownloadJpg = async () => {
    if (!documentRef.current) return;
    setIsExporting('jpg');
    try {
      const sanitizedName = recipientName.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `JJF_Appointment_${candidateId}_${sanitizedName}`;
      const highResScale = (typeof window !== 'undefined' ? (window.devicePixelRatio || 1) * 3 : 3.5);
      await exportElementAsJpg(documentRef.current, fileName, {
        pixelRatio: highResScale,
        quality: 0.98,
        backgroundColor: '#FFFFFF',
        orientation: 'portrait',
        isFullBleedA4: true
      });
      toast.success('नियुक्ति पत्र JPG छवि (A4 Portrait) सफलतापूर्वक डाउनलोड हुई!');
    } catch (err) {
      console.error('JPG export error:', err);
      toast.error('छवि डाउनलोड में समस्या आई।');
    } finally {
      setIsExporting(null);
    }
  };

  // WhatsApp Share
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*जीवन ज्योति फाउंडेशन (रजि. ग़ाज़ीपुर, उ.प्र.)*\n\n` +
      `📜 *${isVolunteer ? 'आधिकारिक स्वयंसेवक नियुक्ति पत्र' : 'आधिकारिक स्टाफ नियुक्ति पत्र'}*\n` +
      `👤 नाम: ${recipientName}\n` +
      `🆔 पहचान संख्या: ${candidateId}\n` +
      `💼 पद: ${isVolunteer ? (volunteerData?.role || 'स्वयंसेवक') : (staffData?.designation || 'स्टाफ')}\n\n` +
      `🔍 ऑनलाइन सत्यापन लिंक:\n${verifyUrl}\n\n` +
      `_नीति आयोग दर्पण एवं समाज कल्याण पंजीकृत संस्था (Reg. GAZ/03373)_`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Copy Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopiedLink(true);
    toast.success('सत्यापन लिंक कॉपी किया गया!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs p-3 sm:p-5 flex items-center justify-center print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-300 print:border-0 print:shadow-none my-auto flex flex-col max-h-[96vh]">
        {/* Modal Top Control Bar */}
        <div className="bg-gradient-to-r from-[#8B0000] via-[#A00000] to-[#3F2B96] text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 print:hidden border-b-2 border-amber-400 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300 flex items-center justify-center text-amber-300 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white font-['Cinzel',serif]">
                  {isVolunteer ? 'आधिकारिक स्वयंसेवक नियुक्ति पत्र (Appointment Letter)' : 'आधिकारिक स्टाफ नियुक्ति पत्र (Staff Appointment Letter)'}
                </h3>
                <span className="bg-amber-400 text-[#8B0000] text-[9.5px] font-black px-2 py-0.5 rounded-full uppercase">
                  Letterhead Format
                </span>
              </div>
              <p className="text-xs text-amber-100 font-medium">
                {recipientName} ({candidateId}) • उच्च-गुणवत्ता 300 DPI A4 लेटरहेड प्रारूप
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Letterhead Print Mode Toggle */}
            <div className="flex items-center bg-black/25 p-0.5 rounded-xl border border-white/20 text-xs">
              <button
                type="button"
                onClick={() => setLetterheadMode('full')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  letterheadMode === 'full'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-amber-100 hover:text-white'
                }`}
                title="पूरा आधिकारिक लेटरहेड (डिजिटल A4 व सामान्य प्रिंट हेतु)"
              >
                🎨 पूरा लेटरहेड
              </button>
              <button
                type="button"
                onClick={() => setLetterheadMode('stationery')}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                  letterheadMode === 'stationery'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-amber-100 hover:text-white'
                }`}
                title="केवल मैटर प्रिंट करें (संस्था के छपे हुए लेटरहेड पेपर हेतु)"
              >
                📄 केवल मैटर
              </button>
            </div>

            {/* Share WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
              title="WhatsApp पर शेयर करें"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* Direct Print */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs border border-white/30"
              title="सीधा प्रिंट निकालें"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट (Print)</span>
            </button>

            {/* Download JPG */}
            <button
              onClick={handleDownloadJpg}
              disabled={isExporting !== null}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title="JPG छवि डाउनलोड करें"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JPG</span>
            </button>

            {/* Download A4 PDF */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting !== null}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 text-xs sm:text-sm font-black rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
              title="A4 300 DPI PDF डाउनलोड करें"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting === 'pdf' ? 'PDF बन रहा...' : 'डाउनलोड A4 PDF'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer ml-1"
              title="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-2 sm:p-6 overflow-y-auto flex-1 bg-slate-200/80 print:p-0 print:bg-white">
          <div className="max-w-[794px] mx-auto overflow-x-auto pb-4">
            <div
              ref={documentRef}
              id="appointment-letter-export-wrapper"
              className="w-[794px] min-w-[794px] max-w-[794px] mx-auto bg-white shadow-2xl shrink-0"
              style={{
                width: '794px',
                minWidth: '794px',
                maxWidth: '794px'
              }}
            >
              <AppointmentLetterDocument
                id="appointment-letter-a4"
                type={type}
                volunteerData={volunteerData}
                staffData={staffData}
                hideLetterheadBackground={letterheadMode === 'stationery'}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer Ribbon with Copy Verification Link */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 px-4 sm:px-6 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              यह नियुक्ति पत्र डिजिटल रूप से सत्यापित एवं केंद्रीय डेटाबेस में पंजीकृत है।
            </span>
          </div>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-bold transition cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'लिंक कॉपी हो गया!' : 'सत्यापन लिंक कॉपी करें'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
