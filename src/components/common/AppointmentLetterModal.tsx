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
}

/**
 * Pure Letterhead Document Layout (Optimized for standard A4 Portrait Print & 300 DPI PDF)
 */
export const AppointmentLetterDocument: React.FC<AppointmentLetterDocumentProps> = ({
  id = 'appointment-letter-a4',
  type,
  volunteerData,
  staffData
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
    ? volunteerData?.id || 'JJF-VOL-2026-001'
    : staffData?.id || 'JJF-STF-2026-001';

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
    ? `JJF/APPT-VOL/2026/${candidateId.replace(/[^0-9]/g, '').slice(-4).padStart(4, '0') || '101'}`
    : `JJF/APPT-STF/2026/${candidateId.replace(/[^0-9]/g, '').slice(-4).padStart(4, '0') || '101'}`;

  // Verification URL
  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?verify=${encodeURIComponent(candidateId)}`
    : `https://jeevanjyotifoundation.org/?verify=${encodeURIComponent(candidateId)}`;

  return (
    <div
      id={id}
      className="printable-appointment-letter w-full max-w-[794px] mx-auto bg-[#FCFBF7] text-slate-900 rounded-none shadow-2xl relative select-none print:shadow-none print:m-0 print:w-full print:max-w-none box-border"
      style={{
        minHeight: '1120px',
        padding: '28px 36px',
        border: '3px solid #8B0000',
        outline: '1.5px solid #D4AF37',
        outlineOffset: '-6px',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
      }}
    >
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.04]">
        <BrandLogo size={420} watermark />
      </div>

      <div className="relative z-10 flex flex-col justify-between" style={{ minHeight: '1060px' }}>
        {/* =================================================================== */}
        {/* 1. OFFICIAL LETTERHEAD HEADER                                      */}
        {/* =================================================================== */}
        <div>
          {/* Sanskrit Shloka Mantra Top Ribbon */}
          <div className="text-center pb-1">
            <span className="text-[11px] font-bold text-[#8B0000] tracking-widest uppercase font-serif">
              ॥ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ॥
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 pb-2 border-b-2 border-[#8B0000]">
            {/* Left: Foundation Emblem Logo */}
            <div className="shrink-0 flex flex-col items-center">
              <BrandLogo size={80} className="drop-shadow-xs" />
              <span className="text-[8.5px] font-black uppercase text-[#8B0000] tracking-wider mt-0.5">
                ESTD. 2018
              </span>
            </div>

            {/* Center: Main Letterhead Typography */}
            <div className="flex-1 text-center px-1">
              <h1 className="text-xl sm:text-2xl font-black tracking-wide text-[#8B0000] uppercase font-serif leading-tight">
                {FOUNDATION_INFO.nameEnglish}
              </h1>
              <h2 className="text-base sm:text-lg font-black text-amber-900 tracking-wide leading-tight mt-0.5">
                {FOUNDATION_INFO.nameHindi}
              </h2>
              <p className="text-[10px] font-bold text-emerald-800 tracking-widest uppercase mt-0.5">
                सेवा • शिक्षा • स्वास्थ्य • पर्यावरण • स्वावलंबन • ग्रामोत्थान
              </p>

              {/* Legal Registration Tags */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1 text-[9px] font-bold text-slate-700">
                <span className="bg-amber-100 text-[#8B0000] px-1.5 py-0.5 rounded border border-amber-300">
                  पंजीकरण सं: {FOUNDATION_INFO.regNo} (उ.प्र. शासन)
                </span>
                <span className="bg-blue-50 text-blue-900 px-1.5 py-0.5 rounded border border-blue-200">
                  नीति आयोग UID: {FOUNDATION_INFO.nitiAayogUid}
                </span>
                <span className="bg-emerald-50 text-emerald-900 px-1.5 py-0.5 rounded border border-emerald-200">
                  12A / 10A URN: {FOUNDATION_INFO.urn10A}
                </span>
                <span className="bg-purple-50 text-purple-900 px-1.5 py-0.5 rounded border border-purple-200">
                  PAN: {FOUNDATION_INFO.pan}
                </span>
              </div>

              {/* Head Office Address */}
              <p className="text-[9.5px] text-slate-700 font-medium leading-snug mt-1">
                <strong>केंद्रीय कार्यालय:</strong> {FOUNDATION_INFO.fullAddressHindi}
              </p>
              <p className="text-[9px] text-slate-600 font-medium mt-0.5">
                <strong>Helpline:</strong> {FOUNDATION_INFO.phone} | <strong>Email:</strong> {FOUNDATION_INFO.email} | <strong>Web:</strong> www.jeevanjyotifoundation.org
              </p>
            </div>

            {/* Right: Verification QR & Verified Badge */}
            <div className="shrink-0 flex flex-col items-center text-center">
              <div className="p-1 bg-white border border-amber-300 rounded-lg shadow-2xs">
                <QRCodeSVG value={verifyUrl} size={64} level="M" />
              </div>
              <span className="text-[7.5px] font-bold text-slate-600 mt-1 uppercase tracking-tight">
                Scan to Verify
              </span>
              <span className="text-[7.5px] font-mono font-black text-[#8B0000] leading-none">
                {candidateId}
              </span>
            </div>
          </div>

          {/* Letterhead Accent Stripe (Gold & Maroon) */}
          <div className="h-1 bg-gradient-to-r from-[#8B0000] via-[#D4AF37] to-[#8B0000] w-full mb-3" />

          {/* =================================================================== */}
          {/* 2. DISPATCH REFERENCE & DATE METADATA ROW                          */}
          {/* =================================================================== */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 bg-amber-50/70 px-3 py-1.5 rounded-lg border border-amber-200 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[#8B0000]">पत्रांक संख्या (Ref. No.):</span>
              <span className="font-mono text-slate-900">{refNo}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#8B0000]">दिनांक (Date of Issue):</span>
              <span className="text-slate-900 font-semibold">{issueDate}</span>
            </div>
          </div>

          {/* =================================================================== */}
          {/* 3. RECIPIENT & APPOINTEE PROFILE CARD                              */}
          {/* =================================================================== */}
          <div className="p-3 bg-white rounded-xl border border-slate-300 shadow-2xs mb-3 flex items-start justify-between gap-4">
            <div className="space-y-1 text-xs text-slate-800 flex-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                सेवा में / To,
              </div>
              <div className="text-sm font-black text-slate-950 flex items-center gap-2">
                <span>{recipientName}</span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {isVolunteer ? 'अधिकृत स्वयंसेवक' : 'अधिकृत स्टाफ सदस्य'}
                </span>
              </div>
              <div className="text-[11.5px] text-slate-700">
                <strong>पिता / अभिभावक:</strong> {fatherOrHusband}
              </div>
              <div className="text-[11.5px] text-slate-700">
                <strong>पहचान संख्या ({isVolunteer ? 'Volunteer ID' : 'Staff ID'}):</strong>{' '}
                <span className="font-mono font-black text-[#8B0000]">{candidateId}</span>
              </div>
              <div className="text-[11.5px] text-slate-700">
                <strong>रजिस्टर्ड मोबाइल:</strong> +91 {candidatePhone}
              </div>
              <div className="text-[11px] text-slate-600 leading-tight">
                <strong>पता (Address):</strong> {candidateAddress}
              </div>
            </div>

            {/* Candidate Photo Box with Stamp */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="relative">
                <img
                  src={candidatePhoto}
                  alt={recipientName}
                  className="w-20 h-24 object-cover rounded-lg border-2 border-[#8B0000] shadow-xs bg-white"
                  crossOrigin="anonymous"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 border border-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <span className="text-[7.5px] font-black text-slate-600 uppercase mt-1">
                सत्यापित छायाचित्र
              </span>
            </div>
          </div>

          {/* =================================================================== */}
          {/* 4. SUBJECT BANNER                                                  */}
          {/* =================================================================== */}
          <div className="bg-gradient-to-r from-[#8B0000] via-[#A00000] to-[#8B0000] text-white py-2 px-4 rounded-lg shadow-xs mb-3 text-center border border-amber-300">
            <h3 className="text-xs sm:text-sm font-black tracking-wide">
              {isVolunteer ? (
                <span>विषय: संस्था के अधिकृत मानद स्वयंसेवक (Social Service Volunteer) पद पर नियुक्ति एवं दायित्व पत्र</span>
              ) : (
                <span>विषय: संस्था में आधिकारिक स्टाफ नियुक्ति आदेश (Official Staff Appointment Letter) — {staffData?.designation || 'स्टाफ'}</span>
              )}
            </h3>
          </div>

          {/* =================================================================== */}
          {/* 5. FORMAL BODY CONTENT & APPOINTMENT CLAUSES                        */}
          {/* =================================================================== */}
          <div className="space-y-2.5 text-xs text-slate-800 leading-relaxed">
            <p className="font-medium text-[12px]">
              महोदय / महोदया,
            </p>

            {isVolunteer ? (
              // VOLUNTEER APPOINTMENT LETTER BODY
              <>
                <p className="text-justify text-[11.5px] leading-relaxed">
                  जीवन ज्योति फाउंडेशन प्रबंध समिति आपके समाज सेवा, शिक्षा प्रसार, स्वास्थ्य कल्याण एवं दीन-दुखियों की सहायता के प्रति समर्पण एवं निस्वार्थ सेवा भावना की सराहना करती है। आपकी निष्ठा एवं मानवीय मूल्यों को दृष्टिगत रखते हुए आपको संस्था के <strong>'मानद स्वयंसेवक (Honorary Social Service Volunteer)'</strong> के रूप में सहर्ष नियुक्त एवं अधिकृत किया जाता है।
                </p>

                {/* Key Roles Table / Box */}
                <div className="p-2.5 bg-amber-50/50 rounded-lg border border-amber-200 text-[11px] space-y-1">
                  <div className="font-bold text-[#8B0000] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>नियुक्ति विवरण (Volunteer Deputation Particulars):</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-0.5">
                    <div>• <strong>नियुक्त पद:</strong> {volunteerData?.role || 'Dedicated Swayam Sewak'}</div>
                    <div>• <strong>कार्य प्रकल्प:</strong> {volunteerData?.area || 'शिक्षा एवं सामाजिक सेवा'}</div>
                    <div>• <strong>कार्यक्षेत्र:</strong> जनपद ग़ाज़ीपुर एवं आसपास के ग्रामीण क्षेत्र</div>
                    <div>• <strong>नियुक्ति स्वरूप:</strong> पूर्णतः मानद एवं स्वैच्छिक समाज सेवा</div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1 text-[11px]">
                  <div className="font-bold text-slate-900">
                    दायित्व एवं आचार संहिता (Terms & Code of Conduct):
                  </div>
                  <ul className="list-decimal pl-4 space-y-1 text-slate-700 text-justify">
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
                <p className="text-justify text-[11.5px] leading-relaxed">
                  जीवन ज्योति फाउंडेशन प्रबंध समिति के निर्णय, आपकी शैक्षणिक योग्यता, अनुभव एवं चयन प्रक्रिया के आधार पर आपको संस्था में <strong>'{staffData?.designation || 'स्टाफ सदस्य'}'</strong> के पद पर <strong>'{staffData?.department || 'प्रशासन'}'</strong> विभाग में नियुक्त किया जाता है।
                </p>

                {/* Staff Particulars Table */}
                <div className="overflow-hidden rounded-lg border border-slate-300 text-[11px]">
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      <tr className="bg-amber-50/70 border-b border-slate-200">
                        <td className="py-1.5 px-3 font-bold text-slate-700 w-1/3">पदनाम (Designation):</td>
                        <td className="py-1.5 px-3 font-black text-[#8B0000]">{staffData?.designation}</td>
                        <td className="py-1.5 px-3 font-bold text-slate-700">विभाग (Department):</td>
                        <td className="py-1.5 px-3 font-bold text-slate-900">{staffData?.department}</td>
                      </tr>
                      <tr className="bg-white border-b border-slate-200">
                        <td className="py-1.5 px-3 font-bold text-slate-700">कार्यक्षेत्र (Duty Location):</td>
                        <td className="py-1.5 px-3 font-semibold text-slate-900">{staffData?.dutyLocation}</td>
                        <td className="py-1.5 px-3 font-bold text-slate-700">रक्त समूह (Blood Group):</td>
                        <td className="py-1.5 px-3 font-bold text-red-600">{staffData?.bloodGroup || 'N/A'}</td>
                      </tr>
                      <tr className="bg-amber-50/40">
                        <td className="py-1.5 px-3 font-bold text-slate-700">योग्यता (Qualification):</td>
                        <td className="py-1.5 px-3 font-medium text-slate-800">{staffData?.qualification || 'Graduate'}</td>
                        <td className="py-1.5 px-3 font-bold text-slate-700">प्रभावी तिथि (Effective Date):</td>
                        <td className="py-1.5 px-3 font-bold text-slate-900">{issueDate}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="space-y-1.5 pt-1 text-[11px]">
                  <div className="font-bold text-slate-900">
                    नियम, शर्तें एवं कर्तव्य (Terms & Conditions of Service):
                  </div>
                  <ul className="list-decimal pl-4 space-y-1 text-slate-700 text-justify">
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

            <p className="text-[11px] font-semibold text-emerald-900 pt-1 text-center">
              संस्था आपके उज्ज्वल भविष्य एवं संस्था के साथ सफल, फलदायी समाज-कल्याण यात्रा की कामना करती है।
            </p>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 6. SIGNATORIES & VALIDATION FOOTER                                 */}
        {/* =================================================================== */}
        <div className="pt-3 border-t-2 border-slate-300">
          <div className="grid grid-cols-3 items-end gap-2 text-center pb-2">
            {/* Left: Security QR & Central Registry Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="p-1 bg-white border border-slate-300 rounded shadow-2xs">
                <QRCodeSVG value={verifyUrl} size={62} level="M" />
              </div>
              <span className="text-[7.5px] font-bold text-slate-600 mt-1 uppercase tracking-wider">
                केंद्रीय डेटाबेस सत्यापित
              </span>
              <span className="text-[7.5px] font-mono text-emerald-800 font-bold">
                Status: ACTIVE & VERIFIED
              </span>
            </div>

            {/* Center: Official Round Seal Stamp */}
            <div className="flex flex-col items-center justify-center">
              <NgoRoundSeal size="md" />
            </div>

            {/* Right: Authorized Signatory Block */}
            <div className="flex flex-col items-center justify-center text-center">
              <ShaileshPradhanSignature width={135} />
              <div className="border-t border-[#8B0000] pt-0.5 mt-0.5 w-full max-w-[155px]">
                <div className="text-[10px] font-black text-[#8B0000] tracking-wide">
                  शैलेश प्रधान (Shailesh Pradhan)
                </div>
                <div className="text-[8.5px] font-bold text-slate-800">
                  प्रबंधक / सचिव (Manager / Secretary)
                </div>
                <div className="text-[7.5px] font-semibold text-slate-600 uppercase">
                  जीवन ज्योति फाउंडेशन
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Letterhead Legal Notice Footer */}
          <div className="border-t border-amber-300 pt-1.5 flex flex-wrap items-center justify-between text-[8px] font-semibold text-slate-600">
            <span>
              मानव सेवा ही ईश्वर सेवा है • Dedicated to Healthcare, Education & Rural Empowerment
            </span>
            <span className="text-[#8B0000] font-bold">
              पंजीकृत संस्था (Reg: GAZ/03373) • गाजीपुर, उत्तर प्रदेश, भारत
            </span>
            <span>
              पृष्ठ 1 / 1 (आधिकारिक नियुक्ति दस्तावेज)
            </span>
          </div>
        </div>
      </div>
    </div>
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

      const success = await exportElementAsPdf(documentRef.current, fileName, {
        orientation: 'portrait',
        pixelRatio: 3,
        backgroundColor: '#FCFBF7'
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

  // Download High-Res JPG
  const handleDownloadJpg = async () => {
    if (!documentRef.current) return;
    setIsExporting('jpg');
    try {
      const sanitizedName = recipientName.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `JJF_Appointment_${candidateId}_${sanitizedName}`;
      await exportElementAsJpg(documentRef.current, fileName, {
        pixelRatio: 3,
        quality: 0.98,
        backgroundColor: '#FCFBF7'
      });
      toast.success('JPG छवि सफलतापूर्वक डाउनलोड हुई!');
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
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 bg-slate-200/80 print:p-0 print:bg-white">
          <div className="max-w-[794px] mx-auto overflow-x-auto">
            <div ref={documentRef}>
              <AppointmentLetterDocument
                id="appointment-letter-a4"
                type={type}
                volunteerData={volunteerData}
                staffData={staffData}
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
