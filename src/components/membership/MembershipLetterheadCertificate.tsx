// ============================================================================
// JEEVAN JYOTI FOUNDATION - OFFICIAL MEMBERSHIP CERTIFICATE (A4 LETTERHEAD)
// जीवन ज्योति फाउंडेशन - आधिकारिक सदस्यता प्रमाण पत्र (लेटरहेड प्रारूप)
// Perfect A4 (210mm x 297mm) 300 DPI with Member Photo, Seal & Verification QR Code
// ============================================================================

import React, { useRef, useState } from 'react';
import {
  Download,
  Printer,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Award,
  QrCode,
  Calendar,
  Phone,
  MapPin,
  Heart,
  Sparkles,
  UserCheck,
  Check,
  ExternalLink,
  Crown
} from 'lucide-react';
import { NgoMemberRecord } from '../../types/membership';
import { FOUNDATION_INFO } from '../../data/foundationData';
import { OfficialLetterheadA4 } from '../common/OfficialLetterheadA4';
import { QRCodeSVG } from 'qrcode.react';
import { exportElementAsPdf, exportElementAsJpg, directPrintElement } from '../../utils/exportImage';
import { BrandLogo } from '../common/BrandLogo';
import { RoyalCertificateSeal } from '../common/RoyalCertificateSeal';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';
import toast from 'react-hot-toast';

export interface MembershipLetterheadCertificateProps {
  member: NgoMemberRecord;
  id?: string;
  className?: string;
  hideLetterheadBackground?: boolean;
  onClose?: () => void;
}

export const MembershipLetterheadCertificate: React.FC<MembershipLetterheadCertificateProps> = ({
  member,
  id = 'membership-letterhead-certificate-a4',
  className = '',
  hideLetterheadBackground = false,
  onClose
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const certNumber =
    member.certificateNumber ||
    (member.id.startsWith('JJF/MEM') ? member.id : `JJF/MEM-CERT/2026/${member.id.replace(/\D/g, '').slice(-3) || '001'}`);

  const issueDateFormatted = member.validFrom
    ? new Date(member.validFrom).toLocaleDateString('hi-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('hi-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?verify=${encodeURIComponent(member.id)}`
    : `https://jeevanjyotifoundation.org/?verify=${encodeURIComponent(member.id)}`;

  const refNo = certNumber;
  const subject = `आधिकारिक संस्था सदस्यता प्रमाण पत्र - ${member.planNameHindi} (Official NGO Membership Certificate)`;

  // Member photo fallback
  const photoSrc = member.photoUrl || '/manager_secretary.webp';

  // Handle PDF Export
  const handleDownloadPdf = async () => {
    const elem = document.getElementById(id);
    if (!elem) {
      toast.error('प्रमाण पत्र एलिमेंट नहीं मिला।');
      return;
    }
    setIsExporting(true);
    const toastId = toast.loading('उच्च-गुणवत्ता A4 लेटरहेड प्रमाण पत्र PDF तैयार हो रहा है...');
    try {
      await exportElementAsPdf(elem, `JJF_Membership_Certificate_${member.id.replace(/[^a-zA-Z0-9]/g, '_')}`);
      toast.success('प्रमाण पत्र PDF सफलतापूर्वक डाउनलोड हो गया!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('PDF डाउनलोड में त्रुटि आई। कृपया प्रिंट विकल्प का प्रयोग करें।', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle JPG Image Export
  const handleDownloadJpg = async () => {
    const elem = document.getElementById(id);
    if (!elem) {
      toast.error('प्रमाण पत्र एलिमेंट नहीं मिला।');
      return;
    }
    setIsExporting(true);
    const toastId = toast.loading('प्रमाण पत्र इमेज तैयार हो रही है...');
    try {
      await exportElementAsJpg(elem, `JJF_Membership_Certificate_${member.id.replace(/[^a-zA-Z0-9]/g, '_')}`);
      toast.success('प्रमाण पत्र इमेज सफलतापूर्वक डाउनलोड हो गई!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('इमेज डाउनलोड में त्रुटि आई।', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Direct Print
  const handlePrint = () => {
    directPrintElement(id);
  };

  // Handle WhatsApp Share
  const handleShareWhatsApp = () => {
    const text = `🎗️ *जीवन ज्योति फाउंडेशन ग़ाज़ीपुर - आधिकारिक सदस्यता प्रमाण पत्र*\n\n` +
      `👤 *सदस्य का नाम:* ${member.fullName}\n` +
      `🆔 *सदस्यता क्रमांक:* ${member.id}\n` +
      `🎖️ *सदस्यता श्रेणी:* ${member.planNameHindi}\n` +
      `📅 *वैधता अवधि:* ${member.validTill || 'आजीवन'}\n` +
      `🏛️ *पंजीकृत संस्था:* जीवन ज्योति फाउंडेशन (UP/2018/0207700)\n\n` +
      `🔗 *ऑनलाइन सत्यापन लिंक:* ${verifyUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Action Toolbar for downloading, printing & sharing */}
      <div className="w-full max-w-[794px] flex items-center justify-between gap-2 p-3 bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 rounded-2xl border-2 border-amber-300 shadow-md mb-4 flex-wrap print:hidden">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-[#8B0000] text-white flex items-center justify-center font-bold">
            <Award className="w-4 h-4" />
          </span>
          <div>
            <div className="text-xs font-black text-gray-900">सदस्यता प्रमाण पत्र (A4 लेटरहेड)</div>
            <div className="text-[10px] text-gray-600 font-mono font-bold">ID: {member.id}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="px-3 py-1.5 bg-[#8B0000] hover:bg-[#6b0000] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="A4 PDF डाउनलोड करें"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF डाउनलोड</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJpg}
            disabled={isExporting}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="PNG/JPG इमेज डाउनलोड करें"
          >
            <Download className="w-3.5 h-3.5" />
            <span>इमेज सेव</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            title="प्रिंट करें"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>प्रिंट</span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            title="व्हाट्सएप पर शेयर करें"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>शेयर</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              बंद करें
            </button>
          )}
        </div>
      </div>

      {/* The Printable A4 300 DPI Document */}
      <div className="overflow-x-auto w-full flex justify-center py-2 bg-slate-100 rounded-2xl shadow-inner border border-slate-300">
        <OfficialLetterheadA4
          id={id}
          refNo={refNo}
          dateStr={issueDateFormatted}
          subject={subject}
          hideLetterheadBackground={hideLetterheadBackground}
          className={`membership-certificate-document shadow-2xl ${className}`}
        >
          {/* Certificate Inner Content Canvas */}
          <div className="relative w-full h-full pt-1 pb-2 flex flex-col justify-between text-slate-900 font-sans leading-relaxed">
            
            {/* 1. TOP TITLE BANNER */}
            <div className="text-center relative pb-1">
              <div className="inline-flex items-center justify-center gap-2 px-6 py-1.5 bg-gradient-to-r from-amber-600 via-[#8B0000] to-amber-600 text-white rounded-full shadow-md border-2 border-amber-300">
                <Crown className="w-4 h-4 text-amber-300" />
                <h2 className="text-sm sm:text-base font-black tracking-widest uppercase font-['Cinzel',serif]">
                  आधिकारिक संस्था सदस्यता प्रमाण पत्र
                </h2>
                <Crown className="w-4 h-4 text-amber-300" />
              </div>
              <div className="text-[10px] font-black tracking-widest text-amber-900 uppercase mt-0.5 font-serif">
                CERTIFICATE OF OFFICIAL NGO MEMBERSHIP
              </div>
            </div>

            {/* 2. MEMBER PROFILE CARD WITH PHOTO & QR CODE */}
            <div className="p-3 bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-amber-50/90 rounded-2xl border-2 border-amber-300 shadow-sm flex items-center justify-between gap-4">
              {/* Member Photo in Royal Gold Frame */}
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="w-[88px] h-[104px] rounded-xl overflow-hidden p-1 bg-gradient-to-br from-amber-300 via-yellow-100 to-amber-500 border-2 border-amber-600 shadow-md">
                  <img
                    src={getOptimizedImageUrl(photoSrc)}
                    alt={member.fullName}
                    className="w-full h-full object-cover object-top rounded-lg"
                    crossOrigin="anonymous"
                  />
                </div>
                <span className="text-[8px] font-black text-amber-900 bg-amber-200 border border-amber-400 px-1.5 py-0.5 rounded-full mt-1 shadow-2xs">
                  सत्यापित सदस्य
                </span>
              </div>

              {/* Member Core Details */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-black text-[#8B0000] font-['Cinzel',serif] tracking-wide">
                    {member.fullName}
                  </span>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white border border-amber-600 shadow-2xs">
                    {member.planNameHindi}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-slate-800">
                  <div>
                    <span className="font-bold text-slate-600">पिता/पति:</span>{' '}
                    <span className="font-semibold">{member.fatherOrHusbandName}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-600">सदस्यता क्रमांक:</span>{' '}
                    <span className="font-mono font-black text-[#3F2B96]">{member.id}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-600">मोबाइल नंबर:</span>{' '}
                    <span className="font-mono font-bold">+91 {member.phone}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-600">पेशा/व्यवसाय:</span>{' '}
                    <span className="font-semibold">{member.occupation || 'समाजसेवा'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-600">पहचान प्रमाण:</span>{' '}
                    <span className="font-semibold uppercase">{member.idProofType} ({member.idProofNumber || 'सत्यापित'})</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-600">रक्त समूह:</span>{' '}
                    <span className="font-black text-red-700">{member.bloodGroup || 'O+'}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-700 truncate pt-0.5">
                  <span className="font-bold text-slate-600">स्थाई पता:</span>{' '}
                  <span>{member.address}, {member.district}, {member.state} - {member.pincode}</span>
                </div>
              </div>

              {/* Scannable Verification QR Code */}
              <div className="shrink-0 flex flex-col items-center bg-white p-2 rounded-xl border border-amber-300 shadow-2xs">
                <QRCodeSVG
                  value={verifyUrl}
                  size={76}
                  level="H"
                  includeMargin={false}
                />
                <span className="text-[8px] font-bold text-slate-500 mt-1 uppercase tracking-tight">
                  स्कैन कर सत्यापन करें
                </span>
              </div>
            </div>

            {/* 3. FORMAL CERTIFICATION DECLARATION TEXT */}
            <div className="my-2 p-3.5 bg-white/95 rounded-2xl border-2 border-amber-200 shadow-2xs space-y-2 text-justify">
              <p className="text-[12px] leading-relaxed text-slate-800 indent-6">
                प्रमाणित किया जाता है कि <strong className="text-slate-950 font-black">{member.fullName}</strong>, 
                आत्मज/पत्नी श्री <strong className="text-slate-950 font-bold">{member.fatherOrHusbandName}</strong>, 
                निवासी <span className="font-medium">{member.address}, {member.district} ({member.state})</span>, 
                संस्था के संविधान, उपनियमों एवं भारतीय सोसायटी पंजीकरण अधिनियम के प्राविधानों के अंतर्गत 
                <strong className="text-[#8B0000] font-black"> जीवन ज्योति फाउंडेशन ग़ाज़ीपुर (उत्तर प्रदेश) </strong> 
                के विधिवत पंजीकृत व अनुमोदित <strong className="text-[#3F2B96] font-black">{member.planNameHindi} ({member.planNameEnglish})</strong> हैं।
              </p>

              <p className="text-[12px] leading-relaxed text-slate-800 indent-6">
                संस्था समाज के अंतिम पंक्ति के निर्धन, बेसहारा व वंचित वर्ग के उत्थान—विशेषकर निःशुल्क सांध्यकालीन बाल शिक्षा, 
                अन्नपूर्णा भोजन सेवा, स्वास्थ्य चिकित्सा शिविर, पर्यावरण संरक्षण एवं महिला स्वावलंबन अभियानों में इनके अमूल्य 
                सहयोग, निःस्वार्थ सेवा भावना एवं सक्रिय भागीदारी की भूरि-भूरि प्रशंसा करती है। संस्था इनके उज्ज्वल भविष्य 
                तथा दीर्घ सामाजिक प्रभाव की हार्दिक मंगलकामना करती है।
              </p>
            </div>

            {/* 4. MEMBERSHIP PARTICULARS SUMMARY TABLE */}
            <div className="rounded-xl overflow-hidden border border-amber-300 shadow-2xs text-[11px]">
              <div className="grid grid-cols-4 bg-gradient-to-r from-amber-600 via-[#8B0000] to-amber-700 text-white font-black text-center py-1">
                <div>सदस्यता श्रेणी</div>
                <div>सदस्यता क्रमांक</div>
                <div>शुल्क भुगतान विवरण</div>
                <div>वैधता अवधि</div>
              </div>
              <div className="grid grid-cols-4 bg-white text-slate-900 font-bold text-center py-2 divide-x divide-amber-200 border-t border-amber-300 items-center">
                <div className="text-amber-900 font-black px-1">{member.planNameHindi}</div>
                <div className="font-mono text-blue-900 font-black">{member.id}</div>
                <div className="text-emerald-800 font-black">
                  ₹{member.paymentAmount.toLocaleString('en-IN')}/- (सफल / {member.transactionRef ? member.transactionRef.slice(-8) : 'ऑनलाइन'})
                </div>
                <div className="text-[#8B0000] font-black">{member.validTill || 'आजीवन (Lifetime)'}</div>
              </div>
            </div>

            {/* 5. STATUTORY COMPLIANCE & LEGAL ACCREDITATIONS */}
            <div className="p-2 bg-amber-50/80 rounded-xl border border-amber-300 text-[10px] text-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>वैधानिक पंजीकरण:</strong> उ०प्र० शासन सोसायटी पंजीकरण क्र०: UP/2018/0207700 • नीति आयोग NGO दर्पण UID: UP/2018/0207700
                </span>
              </div>
              <div className="text-right font-semibold text-slate-600">
                आयकर अधिनियम 12A एवं 80G अधिकृत
              </div>
            </div>

            {/* 6. SIGNATURES & OFFICIAL SEALS ROW */}
            <div className="pt-2 border-t-2 border-amber-300 flex items-end justify-between px-4">
              {/* Left: General Secretary / President Signature */}
              <div className="flex flex-col items-center text-center">
                <div className="h-12 flex items-center justify-center">
                  <img
                    src="/signature-shailesh-royalblue.png"
                    alt="Authorized Signature"
                    className="h-10 object-contain drop-shadow-2xs"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="w-32 border-b-2 border-slate-900 mt-0.5"></div>
                <div className="text-[11px] font-black text-slate-900 mt-0.5">शैलेश प्रधान</div>
                <div className="text-[9px] font-bold text-amber-900">प्रबंधक / सचिव</div>
                <div className="text-[8px] text-slate-600 font-medium">जीवन ज्योति फाउंडेशन</div>
              </div>

              {/* Center: Official Royal Gold Seal & Foundation Stamp */}
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 relative flex items-center justify-center">
                  <img
                    src="/uploads/official_seal.png"
                    alt="Official Embossed Gold Seal"
                    className="w-16 h-16 object-contain drop-shadow-md select-none"
                    crossOrigin="anonymous"
                  />
                </div>

                <div className="w-20 h-14 relative flex items-center justify-center">
                  <img
                    src="/uploads/official_stamp.png"
                    alt="Official Rubber Stamp"
                    className="w-20 h-14 object-contain opacity-90 select-none"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>

              {/* Right: Verification & President Confirmation */}
              <div className="flex flex-col items-center text-center">
                <div className="h-12 flex items-center justify-center">
                  <div className="px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 font-black text-[10px] flex items-center gap-1 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>विधिवत अनुमोदित</span>
                  </div>
                </div>
                <div className="w-32 border-b-2 border-slate-900 mt-0.5"></div>
                <div className="text-[11px] font-black text-slate-900 mt-0.5">कार्यकारिणी मंडल</div>
                <div className="text-[9px] font-bold text-amber-900">केंद्रीय कार्यालय, ग़ाज़ीपुर</div>
                <div className="text-[8px] text-slate-600 font-medium">DIGIPIN: 2J6T226CL2</div>
              </div>
            </div>

          </div>
        </OfficialLetterheadA4>
      </div>
    </div>
  );
};
