import React, { useState } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Download } from 'lucide-react';
import { downloadVerificationQrBadge } from '../utils/downloadVerificationQr';

interface CertificateVerificationQRProps {
  certificateId: string;
  size?: number | 'auto' | 'responsive' | 'sm' | 'md' | 'lg';
  logoSize?: number;
  className?: string;
  style?: React.CSSProperties;
  verificationUrl?: string;
  subText?: string;
  showId?: boolean;
  showDownloadButton?: boolean;
  recipientName?: string;
}

/**
 * 0.6 inch in CSS Pixels (at standard 96 DPI: 0.6in * 96px/in = 57.6px ≈ 58px)
 */
const DEFAULT_INCH_0_6_PX = 58;

/**
 * CertificateVerificationQR
 * Renders an official scannable verification QR code with automatic size adjustment
 * according to certificate dimensions, aspect ratio, and layout shape.
 */
export const CertificateVerificationQR: React.FC<CertificateVerificationQRProps> = ({
  certificateId,
  size = 'auto',
  logoSize,
  className = '',
  style,
  verificationUrl,
  subText = 'Scan to Verify & Download',
  showId = true,
  showDownloadButton = false,
  recipientName
}) => {
  const [downloading, setDownloading] = useState(false);
  const defaultBaseUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://jeevanjyotifoundation.org';

  const url = verificationUrl || `${defaultBaseUrl}/?verify=${encodeURIComponent(certificateId)}`;

  // Determine computed numeric QR size
  const computedSize =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 52
      : size === 'lg'
      ? 96
      : size === 'md'
      ? 74
      : 66; // 'auto' / 'responsive' baseline

  const isAuto = size === 'auto' || size === 'responsive';

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDownloading(true);
    try {
      await downloadVerificationQrBadge({
        certificateId,
        recipientName,
        verificationUrl: url
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      id={`qr-container-${certificateId}`}
      className={`flex flex-col items-center justify-center text-center select-none ${className}`}
      style={style}
    >
      {/* Hidden 400px ultra high-res canvas for instantaneous, perfect PNG export */}
      <div className="hidden" aria-hidden="true">
        <QRCodeCanvas
          id={`qr-canvas-hidden-${certificateId}`}
          value={url}
          size={400}
          level="H"
          includeMargin={true}
          marginSize={2}
          fgColor="#0a1128"
          bgColor="#FFFFFF"
        />
      </div>

      {/* Outer QR Card with Crisp White Quiet Border */}
      <div
        className={`relative p-1 sm:p-1.5 bg-white border border-slate-200 rounded-lg sm:rounded-xl shadow-2xs inline-flex items-center justify-center ${
          isAuto ? 'w-full max-w-[clamp(50px,7.5cqw,78px)]' : ''
        }`}
      >
        <div className="w-full h-full flex items-center justify-center">
          <QRCodeSVG
            id={`qr-svg-${certificateId}`}
            value={url}
            size={computedSize}
            level="M"
            includeMargin={true}
            marginSize={2}
            fgColor="#0a1128"
            bgColor="#FFFFFF"
            className={isAuto ? 'w-full h-auto max-w-full aspect-square' : ''}
          />
        </div>
      </div>

      {subText && (
        <p className="mt-1 text-[9px] sm:text-[10px] font-bold text-slate-800 tracking-tight leading-tight max-w-[140px] truncate">
          {subText}
        </p>
      )}

      {showId && (
        <p className="mt-0.5 text-[8.5px] sm:text-[9px] font-mono font-bold text-slate-600 truncate max-w-[140px]">
          ID: {certificateId}
        </p>
      )}

      {showDownloadButton && (
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-[9px] font-bold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          title="सत्यापन QR कोड डाउनलोड करें (Download QR Code)"
        >
          <Download className="w-3 h-3" />
          <span>{downloading ? 'डाउनलोडिंग...' : 'QR डाउनलोड'}</span>
        </button>
      )}
    </div>
  );
};

export default CertificateVerificationQR;

