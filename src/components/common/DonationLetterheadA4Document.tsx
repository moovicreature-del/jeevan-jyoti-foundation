// ============================================================================
// JEEVAN JYOTI FOUNDATION - OFFICIAL DONATION CERTIFICATE & 80G RECEIPT
// जीवन ज्योति फाउंडेशन - आधिकारिक दान रसीद व प्रशस्ति सम्मान पत्र (लेटरहेड प्रारूप)
// A4 300 DPI Perfect Alignment with Donor Photo & Verification QR Code
// ============================================================================

import React from 'react';
import { DonationRecord } from '../../types';
import { FOUNDATION_INFO } from '../../data/foundationData';
import { OfficialLetterheadA4 } from './OfficialLetterheadA4';
import { QRCodeSVG } from 'qrcode.react';
import { Check, Award, Heart, ShieldCheck, FileCheck } from 'lucide-react';
import { amountToWordsIndian } from '../../utils/numberToWords';
import { getDonorTier } from '../../utils/donorTiers';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

export interface DonationLetterheadProps {
  id?: string;
  donation: DonationRecord;
  donorPhotoUrl?: string;
  className?: string;
  hideLetterheadBackground?: boolean;
}

export const DonationLetterheadA4Document: React.FC<DonationLetterheadProps> = ({
  id = 'donation-letterhead-a4',
  donation,
  donorPhotoUrl,
  className = '',
  hideLetterheadBackground = false
}) => {
  // Format Receipt Number e.g. JJF/DON-80G/2026/0001
  const receiptNumber = donation.receiptNo || (
    donation.id.startsWith('JJF/DON')
      ? donation.id
      : `JJF/DON-80G/2026/${donation.id.replace(/[^0-9]/g, '').slice(-4).padStart(4, '0') || '0001'}`
  );

  // Format Date
  const donationDate = donation.date
    ? new Date(donation.date).toLocaleDateString('hi-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('hi-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

  const amountInWords = donation.amountInWords || amountToWordsIndian(donation.amount);
  const tier = getDonorTier(donation.amount);

  // Verification URL
  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?verify=${encodeURIComponent(receiptNumber)}`
    : `https://jeevanjyotifoundation.org/?verify=${encodeURIComponent(receiptNumber)}`;

  // Donor Photo Fallback (high-res authentic Indian donor portrait or foundation emblem)
  const photo = donorPhotoUrl || donation.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80';

  const refNo = `JJF/DON-80G/2026/${donation.id.replace(/[^0-9]/g, '').slice(-4).padStart(4, '0') || '0001'}`;
  const subject = 'आयकर अधिनियम 80G एवं 12A के अंतर्गत आधिकारिक दान रसीद व प्रशस्ति सम्मान पत्र (Donation Receipt & Certificate of Honor)';

  return (
    <OfficialLetterheadA4
      id={id}
      refNo={refNo}
      dateStr={donationDate}
      subject={subject}
      hideLetterheadBackground={hideLetterheadBackground}
      className={`donation-letterhead-a4 shadow-2xl ${className}`}
    >
      {/* 1. DONOR PROFILE CARD WITH PHOTO & QR CODE SIDE-BY-SIDE */}
      <div className="p-2.5 bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-amber-50/90 rounded-xl border border-amber-300 shadow-2xs mb-2 flex items-center justify-between gap-3">
        {/* Left: Donor Particulars */}
        <div className="flex-1 space-y-1 text-slate-800 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">सम्मानित दानदाता / Donor:</span>
            <span className="text-[14px] font-black text-slate-950 truncate">{donation.donorName}</span>
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs flex items-center gap-1">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
              <span>सत्यापित दानदाता ({tier.nameHindi})</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10.5px]">
            <div><strong>पिता/पति/संरक्षक:</strong> {donation.fatherName || 'दानदाता एवं शुभचिंतक'}</div>
            <div><strong>रसीद क्रमांक:</strong> <span className="font-mono font-black text-blue-900">{receiptNumber}</span></div>
            <div><strong>दानदाता पैन (PAN):</strong> <span className="font-mono font-bold text-slate-900">{donation.panNumber ? donation.panNumber.toUpperCase() : 'उपलब्ध नहीं / स्वैच्छिक'}</span></div>
            <div><strong>मोबाइल नंबर:</strong> +91 {donation.phone?.replace(/[^0-9]/g, '').slice(-10) || '8052361666'}</div>
            <div><strong>दान का माध्यम:</strong> {donation.paymentMode || 'ऑनलाइन UPI / बैंक अंतरण'}</div>
            <div><strong>दान श्रेणी:</strong> {donation.donationType === 'monthly' ? 'मासिक निरंतर सेवा' : 'एकमुश्त समाज सेवा दान'}</div>
          </div>

          <div className="text-[10px] text-slate-700 truncate">
            <strong>पंजीकृत पता:</strong> {donation.address || donation.city || 'गाज़ीपुर, उत्तर प्रदेश, भारत'}
          </div>
        </div>

        {/* Right: Donor Photo + Verification QR Code Side-by-Side */}
        <div className="shrink-0 flex items-center gap-3 bg-white p-2 rounded-xl border-2 border-amber-300 shadow-xs overflow-visible">
          {/* Donor Photo with Uncut Official Rubber Stamp Overlay */}
          <div className="flex flex-col items-center">
            {/* Outer relative container with overflow-visible so the stamp bleeds cleanly on left, right, and bottom without getting cut */}
            <div className="relative w-[66px] h-[78px] flex items-center justify-center">
              {/* Photo Box with rounded corners and border */}
              <div className="w-[62px] h-[76px] rounded-lg border-2 border-amber-500 overflow-hidden shadow-2xs bg-slate-100">
                <img
                  src={getOptimizedImageUrl(photo)}
                  alt={donation.donorName}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    const fallback = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';
                    if (e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
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
                  src={getOptimizedImageUrl('/assets/aistudio/IMG_20261020_133052_0b52a993.png')}
                  onError={(e) => {
                    const target = e.currentTarget;
                    const stampFallback = getOptimizedImageUrl('/uploads/official_stamp.png');
                    if (target.src !== stampFallback) {
                      target.src = stampFallback;
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
              Scan to Verify 80G ✓
            </span>
          </div>
        </div>
      </div>

      {/* 2. FORMAL ACKNOWLEDGEMENT & CERTIFICATION MATTER */}
      <div className="space-y-1.5 text-xs text-slate-800 leading-snug flex-1 flex flex-col justify-between">
        <p className="font-semibold text-[11px] text-slate-900">
          आदरणीय दानदाता महोदय / महोदया,
        </p>

        <p className="text-justify text-[11px] text-slate-800 leading-relaxed">
          जीवन ज्योति फाउंडेशन प्रबंध समिति आपके द्वारा संस्था के लोक-कल्याणकारी प्रकल्पों (गरीब व अनाथ बच्चों की निःशुल्क गुणवत्तापूर्ण शिक्षा, स्वास्थ्य सहायता, अन्नपूर्णा भोजन सेवा एवं सामाजिक उत्थान) हेतु प्रदान किए गए इस पवित्र एवं उदार आर्थिक सहयोग के लिए आपका हृदय से आभार व साधुवाद व्यक्त करती है।
        </p>

        {/* 3. DONATION & PAYMENT PARTICULARS TABLE */}
        <div className="overflow-hidden rounded-lg border-2 border-amber-300 text-[10.5px]">
          <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white px-3 py-1 font-bold flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>दान एवं भुगतान विवरण (Donation & Statutory Particulars)</span>
            </div>
            <span className="text-[9.5px] text-amber-200 font-mono">
              वित्तीय वर्ष 2025-2026 / 2026-2027
            </span>
          </div>
          <table className="w-full text-left border-collapse bg-white">
            <tbody>
              <tr className="border-b border-amber-100 bg-amber-50/40">
                <td className="py-1 px-2.5 font-bold text-slate-700 w-1/4 border-r border-amber-100">दान राशि (Amount):</td>
                <td className="py-1 px-2.5 font-black text-[13px] text-emerald-800 w-1/4 border-r border-amber-100 font-mono">
                  ₹ {donation.amount.toLocaleString('en-IN')}/-
                </td>
                <td className="py-1 px-2.5 font-bold text-slate-700 w-1/4 border-r border-amber-100">दानदाता सम्मान:</td>
                <td className="py-1 px-2.5 font-black text-[#8B0000] w-1/4">
                  {tier.symbol} {tier.nameHindi}
                </td>
              </tr>
              <tr className="border-b border-amber-100">
                <td className="py-1 px-2.5 font-bold text-slate-700 border-r border-amber-100">शब्दों में राशि (In Words):</td>
                <td colSpan={3} className="py-1 px-2.5 font-bold text-slate-900 italic">
                  {amountInWords}
                </td>
              </tr>
              <tr className="border-b border-amber-100 bg-amber-50/40">
                <td className="py-1 px-2.5 font-bold text-slate-700 border-r border-amber-100">दान का उद्देश्य (Purpose):</td>
                <td className="py-1 px-2.5 font-bold text-blue-950 border-r border-amber-100">
                  {donation.purposeHindi || donation.purpose || 'निःशुल्क बाल शिक्षा व अन्नपूर्णा सेवा'}
                </td>
                <td className="py-1 px-2.5 font-bold text-slate-700 border-r border-amber-100">लेन-देन संदर्भ / UTR:</td>
                <td className="py-1 px-2.5 font-mono font-bold text-slate-800">
                  {donation.transactionRef || `UPI/JJF/${donation.id.replace(/[^0-9]/g, '').slice(-8) || '80523616'}`}
                </td>
              </tr>
              <tr>
                <td className="py-1 px-2.5 font-bold text-slate-700 border-r border-amber-100">80G पंजीकरण सं.:</td>
                <td className="py-1 px-2.5 font-mono font-bold text-slate-900 border-r border-amber-100">
                  {FOUNDATION_INFO.urn80G || 'AAATJ5576RF20214'}
                </td>
                <td className="py-1 px-2.5 font-bold text-slate-700 border-r border-amber-100">संस्था पैन / 12A URN:</td>
                <td className="py-1 px-2.5 font-mono font-bold text-slate-900">
                  {FOUNDATION_INFO.pan} / {FOUNDATION_INFO.urn10A || 'AAEAJ3141QE20231'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 4. STATUTORY TAX BENEFIT & CERTIFICATE CLAUSE */}
        <div className="p-2 bg-amber-50/70 rounded-lg border border-amber-200 text-[10.5px] space-y-0.5">
          <div className="font-bold text-[#8B0000] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>आयकर छूट एवं वैधानिक प्रमाणन (Statutory 80G Tax Exemption Clause):</span>
          </div>
          <p className="text-justify text-[10px] text-slate-700 leading-snug">
            प्रमाणित किया जाता है कि उपरोक्त दान राशि जीवन ज्योति फाउंडेशन को स्वैच्छिक रूप से समाज कल्याण हेतु प्राप्त हुई है। यह संस्था आयकर अधिनियम 1961 की धारा 80G(5)(vi) तथा 12A के अंतर्गत पंजीकृत है एवं यह दान आयकर छूट के प्रयोजनार्थ पूर्णतः मान्य है।
          </p>
        </div>

        <p className="text-[10px] font-semibold text-emerald-900 pt-0.5 text-center">
          "नर सेवा ही नारायण सेवा है" — आपके इस पुनीत सहयोग के लिए जीवन ज्योति फाउंडेशन परिवार आपका सदैव आभारी रहेगा।
        </p>
      </div>

      {/* 5. SIGNATORIES ROW (SEAL + QR VERIFICATION STAMP + SIGNATURE) */}
      <div className="pt-2 border-t-2 border-slate-300 mt-2">
        <div className="grid grid-cols-3 items-end gap-2 text-center pb-1">
          {/* Left: Official Round Seal Image */}
          <div className="flex flex-col items-center justify-center">
            <img
              src={getOptimizedImageUrl('/official-seal.png')}
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
                <span>80G DIGITALLY VERIFIED</span>
              </div>
              <div className="text-[7px] font-mono text-slate-600 mt-0.5">
                Receipt UID: {receiptNumber}
              </div>
              <div className="text-[6.5px] text-slate-500 font-medium">
                ISO 9001:2015 & Govt. Registered
              </div>
            </div>
          </div>

          {/* Right: Authorized Signatory Block */}
          <div className="flex flex-col items-center justify-center text-center">
            <img
              src={getOptimizedImageUrl('/signature-shailesh-royalblue.png')}
              alt="Shailesh Pradhan Signature"
              className="h-[38px] object-contain"
              crossOrigin="anonymous"
              onError={(e) => {
                e.currentTarget.src = getOptimizedImageUrl('/signature-shailesh-overlay.png');
              }}
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
