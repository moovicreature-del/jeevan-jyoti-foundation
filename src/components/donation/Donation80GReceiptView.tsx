// ============================================================================
// JEEVAN JYOTI FOUNDATION - OFFICIAL DONATION RECEIPT (A4 PDF READY)
// आधिकारिक दान रसीद - जीवन ज्योति फाउंडेशन
// ============================================================================

import React, { useRef, useState } from 'react';
import {
  Download,
  Printer,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Globe,
  FileCheck,
  Copy,
  Check,
  X,
  ExternalLink,
  Sparkles,
  Award
} from 'lucide-react';
import { DonationRecord } from '../../types';
import { FOUNDATION_INFO } from '../../data/foundationData';
import { BrandLogo } from '../common/BrandLogo';
import { RoyalFourCorners, RoyalCenterFlourish } from '../common/RoyalCertificateBorder';
import { ShaileshPradhanSignatureBlock, NgoRoundSeal } from '../DigitalSignature';
import { RoyalCertificateSeal } from '../common/RoyalCertificateSeal';
import { CertificateVerificationQR } from '../CertificateVerificationQR';
import { amountToWordsIndian } from '../../utils/numberToWords';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { exportElementAsPdf } from '../../utils/exportImage';
import toast from 'react-hot-toast';
import { SendCertificateModal, CertificateShareData } from '../SendCertificateModal';
import { triggerDonationReceiptEmail } from '../../services/emailService';
import { useDonationPaymentSettings } from '../../hooks/useDonationPaymentSettings';
import { OfficialVerifiedBadge } from '../common/OfficialVerifiedBadge';
import { OtpVerificationModal } from '../OtpVerificationModal';
import { getCertificateById } from '../../services/certificateRegistryService';
import { DonationLetterheadA4Document } from '../common/DonationLetterheadA4Document';

interface Props {
  donation: DonationRecord;
  onClose?: () => void;
  onDonationSelect?: (don: DonationRecord) => void;
}

export const Donation80GReceiptView: React.FC<Props> = ({
  donation,
  onClose
}) => {
  const { settings: paymentSettings } = useDonationPaymentSettings();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [donorPhotoUrl, setDonorPhotoUrl] = useState<string>(donation.photoUrl || '');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [letterheadMode, setLetterheadMode] = useState<'full' | 'stationery'>('full');
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareModalTab, setShareModalTab] = useState<'whatsapp' | 'email'>('whatsapp');
  const [isSendingEmailDirect, setIsSendingEmailDirect] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'pdf' | 'print' | null>(null);
  const [emailStatusMessage, setEmailStatusMessage] = useState<string | null>(
    donation.email ? `रसीद ईमेल पर भेजी गई: ${donation.email}` : null
  );

  // Format Receipt Number e.g. JJF/DON/2026/0001
  const receiptNumber = donation.receiptNo || (
    donation.id.startsWith('JJF/DON')
      ? donation.id
      : `JJF/DON/2026/${donation.id.replace(/[^0-9]/g, '').slice(-4).padStart(4, '0') || '0001'}`
  );

  // Format Date
  const donationDate = donation.date
    ? new Date(donation.date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

  const amountInWords = donation.amountInWords || amountToWordsIndian(donation.amount);

  // Direct Verification URL
  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?verify=${encodeURIComponent(receiptNumber)}`
    : `https://jeevanjyotifoundation.org/?verify=${encodeURIComponent(receiptNumber)}`;

  // Handle Instant A4 PDF Download
  const executeDownloadPdf = async () => {
    if (!receiptRef.current) return;
    setIsGeneratingPdf(true);
    const toastId = toast.loading('उच्च गुणवत्ता A4 दान रसीद PDF तैयार हो रही है...');

    try {
      const fileName = `Donation_Receipt_${receiptNumber.replace(/[\/\\]/g, '_')}_${donation.donorName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      const success = await exportElementAsPdf(receiptRef.current, fileName, {
        orientation: 'portrait',
        pixelRatio: 2.5,
        backgroundColor: '#FFFFFF',
        isFullBleedA4: true
      });

      if (success) {
        toast.success('दान रसीद PDF सफलतापूर्वक डाउनलोड हो गई!', { id: toastId });
      } else {
        throw new Error('PDF export returned false');
      }
    } catch (err) {
      console.error('PDF Generation error:', err);
      toast.error('PDF बनाने में त्रुटि आई। कृपया प्रिंट विकल्प का प्रयोग करें।', { id: toastId });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const checkAdminApproval = (): boolean => {
    // Check direct donation record approval status
    if (donation.approvalStatus && donation.approvalStatus !== 'approved') {
      const statusHindi = donation.approvalStatus === 'rejected' ? 'अस्वीकृत (Rejected)' : 'लंबित (Pending Approval)';
      toast.error(`⚠️ यह दान रसीद अभी एडमिन द्वारा स्वीकृत नहीं है (स्थिति: ${statusHindi})। एडमिन अप्रूवल के बाद ही डाउनलोड संभव है।`, { duration: 6000 });
      return false;
    }

    // Also check certificate registry if registered as 80G receipt item
    const regItem = getCertificateById(receiptNumber) || getCertificateById(donation.id);
    if (regItem && regItem.approvalStatus && regItem.approvalStatus !== 'approved') {
      const statusHindi = regItem.approvalStatus === 'rejected' ? 'अस्वीकृत (Rejected)' : 'लंबित (Pending Approval)';
      toast.error(`⚠️ यह दान रसीद अभी एडमिन द्वारा स्वीकृत नहीं है (स्थिति: ${statusHindi})। एडमिन अप्रूवल के बाद ही डाउनलोड संभव है।`, { duration: 6000 });
      return false;
    }

    return true;
  };

  const handleInitiateDownloadPdf = () => {
    if (!checkAdminApproval()) return;
    setPendingAction('pdf');
    setIsOtpOpen(true);
  };

  // Handle Native Print
  const handleInitiatePrint = () => {
    if (!checkAdminApproval()) return;
    setPendingAction('print');
    setIsOtpOpen(true);
  };

  const handleOtpVerified = () => {
    if (pendingAction === 'pdf') {
      executeDownloadPdf();
    } else if (pendingAction === 'print') {
      window.print();
    }
    setPendingAction(null);
  };

  // Copy Verification Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopiedLink(true);
    toast.success('सत्यापन लिंक कॉपी हो गया!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Handle Instant Direct Automated Email Trigger with PDF Receipt
  const handleDirectEmailResend = async () => {
    const targetEmail = donation.email || prompt('कृपया दान रसीद PDF प्राप्त करने हेतु ईमेल पता दर्ज करें:', 'moovicreature@gmail.com');
    if (!targetEmail || !targetEmail.includes('@')) {
      toast.error('मान्य ईमेल पता दर्ज करना आवश्यक है।');
      return;
    }

    setIsSendingEmailDirect(true);
    const toastId = toast.loading(`ईमेल (${targetEmail}) पर PDF रसीद भेजी जा रही है...`);

    try {
      const result = await triggerDonationReceiptEmail({
        donation: {
          ...donation,
          email: targetEmail
        }
      });

      if (result.success) {
        setEmailStatusMessage(`दान रसीद PDF सफलतापूर्वक भेजी गई: ${targetEmail}`);
        toast.success(`📩 दान रसीद PDF आपके ईमेल (${targetEmail}) पर प्रेषित हो गई!`, { id: toastId });
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('ईमेल प्रेषण में समस्या आई। शेयर डायलॉग खोला जा रहा है...', { id: toastId });
      setShareModalTab('email');
      setShareModalOpen(true);
    } finally {
      setIsSendingEmailDirect(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-200 print:border-0 print:shadow-none my-auto">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 print:hidden border-b border-amber-500/30">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="font-bold text-sm sm:text-base text-amber-200">
                आधिकारिक दान रसीद (Official Donation Receipt)
              </span>
              <span className="text-[11px] text-gray-300 block">
                रसीद क्रमांक: <strong className="font-mono text-white">{receiptNumber}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Letterhead Print Mode Toggle */}
            <div className="flex items-center bg-black/30 p-0.5 rounded-lg border border-white/20 text-xs">
              <button
                type="button"
                onClick={() => setLetterheadMode('full')}
                className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
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
                className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                  letterheadMode === 'stationery'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-amber-100 hover:text-white'
                }`}
                title="केवल मैटर प्रिंट करें (संस्था के छपे हुए लेटरहेड पेपर हेतु)"
              >
                📄 केवल मैटर
              </button>
            </div>

            {/* Direct Send/Resend Email Button */}
            <button
              onClick={handleDirectEmailResend}
              disabled={isSendingEmailDirect}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              title="Automated Email PDF Dispatch"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isSendingEmailDirect ? 'ईमेल भेजी जा रही...' : 'PDF ईमेल भेजें'}</span>
            </button>

            {/* Send on WhatsApp Button */}
            <button
              onClick={() => {
                setShareModalTab('whatsapp');
                setShareModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Send Receipt to WhatsApp Number"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handleInitiatePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer shadow-xs border border-white/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट</span>
            </button>

            {/* Download PDF Button */}
            <button
              onClick={handleInitiateDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs sm:text-sm font-black rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'PDF तैयार हो रही...' : 'डाउनलोड A4 PDF'}</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors ml-1 cursor-pointer"
                title="बंद करें"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Live Email Confirmation Banner if dispatched */}
        {emailStatusMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-800 flex items-center justify-between print:hidden">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {emailStatusMessage}
            </span>
            <span className="text-[11px] font-normal text-emerald-600">
              PDF संलग्न
            </span>
          </div>
        )}

        {/* Photo Uploader / Selector if donor photo needs change */}
        <div className="px-4 py-2 bg-amber-50/70 border-b border-amber-200 print:hidden flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">📜 आधिकारिक A4 लेटरहेड प्रारूप:</span>
            <span className="text-slate-600">फोटो एवं सत्यापन QR कोड सहित 300 DPI A4 पत्र</span>
          </div>
          <div className="flex items-center gap-2">
            {donorPhotoUrl ? (
              <button
                type="button"
                onClick={() => setDonorPhotoUrl('')}
                className="text-[11px] font-bold text-amber-800 hover:text-red-700 underline cursor-pointer"
              >
                डिफ़ॉल्ट फोटो पर लौटें
              </button>
            ) : null}
            <label className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 rounded-lg cursor-pointer shadow-2xs text-[11px]">
              📷 फोटो बदलें
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (ev.target?.result) setDonorPhotoUrl(ev.target.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Certificate Container with Authentic A4 Letterhead Format */}
        <div className="p-2 sm:p-6 bg-slate-200/80 overflow-x-auto flex justify-center print:p-0 print:bg-white">
          <div
            ref={receiptRef}
            id="a4-donation-receipt"
            className="w-[794px] min-w-[794px] max-w-[794px] bg-white print:m-0 print:shadow-none shadow-2xl"
          >
            <DonationLetterheadA4Document
              id="donation-letterhead-print"
              donation={donation}
              donorPhotoUrl={donorPhotoUrl}
              hideLetterheadBackground={letterheadMode === 'stationery'}
            />
          </div>
        </div>
      </div>

      {/* Share / Send via WhatsApp & Email Modal */}
      {shareModalOpen && (
        <SendCertificateModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          defaultTab={shareModalTab}
          data={{
            certificateType: 'donation_80g',
            titleHindi: 'आधिकारिक दान रसीद',
            titleEnglish: 'Official Donation Receipt',
            recipientName: donation.donorName,
            fatherName: donation.fatherName,
            certificateNo: receiptNumber,
            issueDate: donation.date ? new Date(donation.date).toLocaleDateString('en-GB') : undefined,
            recipientPhone: donation.phone,
            recipientEmail: donation.email,
            amount: donation.amount,
            purpose: donation.purposeHindi || donation.purpose || 'General Social Welfare',
            qrVerifyUrl: verifyUrl
          }}
        />
      )}

      {/* Mandatory OTP Verification Modal before PDF Download / Print */}
      {isOtpOpen && (
        <OtpVerificationModal
          isOpen={isOtpOpen}
          onClose={() => setIsOtpOpen(false)}
          phoneNumber={donation.phone || ''}
          onSuccess={handleOtpVerified}
          certificateId={receiptNumber}
          recipientName={donation.donorName}
          certificateType="donation_80g"
          title="दान रसीद - पंजीकृत मोबाइल OTP सत्यापन"
          subtitle="सुरक्षा एवं आधिकारिक सत्यापन हेतु दान पंजीकरण में दर्ज मोबाइल नंबर पर 6-अंकीय OTP सत्यापन अनिवार्य है।"
        />
      )}
    </div>
  );
};

export default Donation80GReceiptView;
