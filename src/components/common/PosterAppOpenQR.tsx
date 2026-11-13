import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, ExternalLink, Globe } from 'lucide-react';

export const OFFICIAL_APP_URL = 'https://jeevan-jyoti-foundation-7eso.vercel.app';

export interface PosterAppOpenQRProps {
  size?: number; // Size in pixels (default: 52)
  className?: string;
  variant?: 'pill' | 'badge' | 'minimal' | 'compact' | 'full';
  customUrl?: string;
  labelText?: string;
  subText?: string;
  showClickableUrl?: boolean;
}

/**
 * PosterAppOpenQR
 * Official scannable & clickable QR badge embedded on all posters to open:
 * https://jeevan-jyoti-foundation-7eso.vercel.app directly on click or scan.
 */
export const PosterAppOpenQR: React.FC<PosterAppOpenQRProps> = ({
  size = 52,
  className = '',
  variant = 'pill',
  customUrl,
  labelText = 'ऐप खोलें / स्कैन करें',
  subText = 'https://jeevan-jyoti-foundation-7eso.vercel.app',
  showClickableUrl = true
}) => {
  const appUrl = customUrl || OFFICIAL_APP_URL;

  if (variant === 'compact') {
    return (
      <a
        href={appUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        title={`ऐप खोलें: ${appUrl} (क्लिक करें या स्कैन करें)`}
        className={`relative z-30 pointer-events-auto group inline-flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-105 active:scale-95 ${className}`}
      >
        <div className="p-1 sm:p-1.5 bg-white rounded-xl shadow-md border-2 border-amber-400 ring-2 ring-amber-500/30 group-hover:border-amber-300 group-hover:ring-amber-300">
          <QRCodeSVG
            value={appUrl}
            size={size}
            level="H"
            includeMargin={false}
            fgColor="#0f172a"
            bgColor="#FFFFFF"
            imageSettings={{
              src: '/logo.png',
              height: Math.round(size * 0.25),
              width: Math.round(size * 0.25),
              excavate: true
            }}
          />
        </div>
        <div className="mt-1 px-2 py-0.5 rounded-full bg-black/75 border border-amber-400/70 text-[8px] sm:text-[9px] font-black text-[#FFE082] tracking-tight whitespace-nowrap shadow-xs flex items-center gap-1 group-hover:bg-amber-500 group-hover:text-black transition-colors">
          <ExternalLink className="w-2.5 h-2.5" />
          <span>📲 ऐप खोलें</span>
        </div>
      </a>
    );
  }

  if (variant === 'minimal') {
    return (
      <a
        href={appUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        title={`ऐप खोलें: ${appUrl}`}
        className={`relative z-30 pointer-events-auto p-1 bg-white rounded-lg shadow-sm border border-amber-300 inline-block cursor-pointer transition-transform hover:scale-105 active:scale-95 ${className}`}
      >
        <QRCodeSVG
          value={appUrl}
          size={size}
          level="H"
          includeMargin={false}
          fgColor="#0f172a"
          bgColor="#FFFFFF"
          imageSettings={{
            src: '/logo.png',
            height: Math.round(size * 0.25),
            width: Math.round(size * 0.25),
            excavate: true
          }}
        />
      </a>
    );
  }

  // Default 'pill' variant: Elegant royal golden plaque with QR & direct clickable Vercel link
  return (
    <div className={`relative z-30 pointer-events-auto inline-flex flex-col items-center gap-1.5 ${className}`}>
      <a
        href={appUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        title={`क्लिक करके ऐप खोलें: ${appUrl}`}
        className="group inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-black/65 backdrop-blur-xs border border-amber-400/80 shadow-xl text-left ring-1 ring-amber-400/40 hover:bg-black/85 hover:border-amber-300 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
      >
        {/* Pristine White QR Code Container with Gold Border */}
        <div className="shrink-0 p-1 bg-white rounded-lg shadow-md border border-amber-400/90 flex items-center justify-center group-hover:scale-105 transition-transform">
          <QRCodeSVG
            value={appUrl}
            size={size}
            level="H"
            includeMargin={false}
            fgColor="#0f172a"
            bgColor="#FFFFFF"
            imageSettings={{
              src: '/logo.png',
              height: Math.round(size * 0.26),
              width: Math.round(size * 0.26),
              excavate: true
            }}
          />
        </div>

        {/* Label and Information */}
        <div className="flex flex-col justify-center min-w-0 pr-1">
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-black text-[#FFE082] tracking-wide drop-shadow-xs group-hover:text-yellow-300">
            <Smartphone className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-pulse" />
            <span className="truncate">{labelText}</span>
            <ExternalLink className="w-3 h-3 text-amber-300 ml-0.5 opacity-90" />
          </div>
          <div className="text-[8px] sm:text-[8.5px] text-amber-200 font-mono tracking-wider uppercase font-bold truncate">
            OFFICIAL APP • CLICK TO OPEN
          </div>
          <div className="text-[7.5px] sm:text-[8.5px] text-amber-300 font-mono font-extrabold break-all flex items-center gap-1 underline underline-offset-2">
            <span className="shrink-0">🔗</span>
            <span>{appUrl}</span>
          </div>
        </div>
      </a>

      {/* Prominent Direct Clickable Link Pill */}
      {showClickableUrl && (
        <a
          href={appUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          title={`ऐप ओपन करें: ${appUrl}`}
          className="relative z-30 pointer-events-auto inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200 text-stone-950 font-black text-[8.5px] sm:text-[10px] shadow-md border border-amber-300 transition-all hover:scale-105 active:scale-95 cursor-pointer ring-1 ring-amber-500/40 whitespace-nowrap"
        >
          <Globe className="w-3 h-3 text-stone-900 shrink-0" />
          <span className="font-mono">{appUrl}</span>
          <ExternalLink className="w-2.5 h-2.5 text-stone-900 shrink-0" />
        </a>
      )}
    </div>
  );
};

export default PosterAppOpenQR;
