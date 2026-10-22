import React from 'react';
import { Camera, Check, ShieldCheck } from 'lucide-react';

export const OFFICIAL_STAMP_IMG_PATH = '/assets/aistudio/IMG_20261020_133052_0b52a993.png';
export const OFFICIAL_STAMP_FALLBACK_PATH = '/uploads/official_stamp.png';

interface StampedCandidatePhotoProps {
  /** Candidate/Staff/Volunteer/Donor Photo URL */
  photoUrl?: string;
  /** Name of candidate for alt attribute */
  name?: string;
  /** Width class / styling (default: 'w-24') */
  className?: string;
  /** Aspect ratio or container styling (default: 'aspect-3/4') */
  containerClassName?: string;
  /** Whether to show the digital cross stamp across the bottom (default: true) */
  showStamp?: boolean;
  /** Stamp rotation degrees (default: -12) */
  stampAngle?: number;
  /** Optional click handler (e.g. to open file picker) */
  onClick?: () => void;
  /** Optional hover camera change overlay */
  editable?: boolean;
  /** Optional verified badge display */
  showVerifiedBadge?: boolean;
  /** Verification text label */
  verifiedLabel?: string;
  /** Alt photo placeholder label when no photo */
  emptyLabel?: string;
  /** Stamp size scale: 'sm' | 'md' | 'lg' (default: 'md') */
  stampSize?: 'sm' | 'md' | 'lg';
}

/**
 * डिजिटल क्रॉस मुद्रित पासपोर्ट फोटो कंपोनेंट (Digitally Stamped Candidate Photo)
 * 
 * स्वयंसेवक (Volunteer), स्टाफ (Staff) एवं दानदाता (Donation) फोटो के निचले हिस्से पर
 * आधिकारिक अटैच्ड स्टांप ("प्रबन्धक / सचिव जीवन ज्योति फाउण्डेशन मीरानपुर तहसील-मुहम्मदाबाद जिला-गाजीपुर")
 * को क्रॉस एंगल में डिजिटल रबर स्टैंप इंक प्रभाव के साथ प्रदर्शित करता है।
 */
export const StampedCandidatePhoto: React.FC<StampedCandidatePhotoProps> = ({
  photoUrl,
  name = 'Candidate Photo',
  className = 'w-24',
  containerClassName = 'aspect-3/4',
  showStamp = true,
  stampAngle = -12,
  onClick,
  editable = false,
  showVerifiedBadge = true,
  verifiedLabel = 'सत्यापित (VERIFIED)',
  emptyLabel = 'फोटो आवश्यक *',
  stampSize = 'md'
}) => {
  const stampScaleClass =
    stampSize === 'sm'
      ? 'w-[115%] -bottom-1 -left-2'
      : stampSize === 'lg'
      ? 'w-[130%] -bottom-3 -left-3'
      : 'w-[120%] -bottom-2 -left-2.5';

  return (
    <div className={`relative inline-block select-none ${className}`}>
      {/* Photo Frame Container */}
      <div
        onClick={onClick}
        className={`relative ${containerClassName} w-full rounded-xl overflow-hidden border-2 shadow-md bg-white transition-all ${
          photoUrl
            ? 'border-amber-400'
            : 'border-dashed border-red-400 bg-red-50/50'
        } ${editable && onClick ? 'cursor-pointer hover:ring-2 hover:ring-amber-400 group' : ''}`}
      >
        {photoUrl ? (
          <>
            <img
              src={photoUrl}
              alt={name}
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
            />

            {/* Editable Hover Camera Overlay */}
            {editable && (
              <div className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity rounded-xl no-print z-10">
                <Camera className="w-5 h-5 mb-0.5 text-amber-300" />
                <span className="text-[9px] font-black tracking-tight">बदलें (Change)</span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-red-600">
            <Camera className="w-6 h-6 mb-1 text-red-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase leading-tight">
              {emptyLabel}
            </span>
          </div>
        )}

        {/* Verified Badge on top-right */}
        {photoUrl && showVerifiedBadge && (
          <div
            className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-md border border-white z-10"
            title={verifiedLabel}
          >
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DIGITALLY ATTESTED OFFICIAL CROSS STAMP - 100% UNCUT ACROSS LEFT/RIGHT/BOTTOM */}
      {/* ========================================================================= */}
      {photoUrl && showStamp && (
        <div
          className="absolute -bottom-2.5 -left-3 -right-3 pointer-events-none select-none z-20 flex items-center justify-center"
          style={{
            transform: `rotate(${stampAngle}deg)`,
            transformOrigin: 'center center'
          }}
        >
          {/* Rubber Stamp Image with Realistic Ink Multiply Blending */}
          <div className="relative flex items-center justify-center w-full">
            <img
              src={OFFICIAL_STAMP_IMG_PATH}
              onError={(e) => {
                // Fallback to /uploads/official_stamp.png
                if (e.currentTarget.src !== OFFICIAL_STAMP_FALLBACK_PATH) {
                  e.currentTarget.src = OFFICIAL_STAMP_FALLBACK_PATH;
                }
              }}
              alt="Jeevan Jyoti Foundation Attestation Seal"
              className="w-[125%] max-w-none h-auto max-h-12 sm:max-h-14 object-contain filter contrast-160 brightness-95 mix-blend-multiply drop-shadow-[0_1px_2px_rgba(20,40,100,0.3)]"
            />
          </div>
        </div>
      )}

      {/* Under-Photo Attested Label */}
      {photoUrl && showStamp && (
        <div className="mt-1 flex items-center justify-center gap-1">
          <span className="text-[7.5px] font-black text-blue-900 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded-md shadow-2xs flex items-center gap-0.5 tracking-tight">
            <ShieldCheck className="w-2.5 h-2.5 text-blue-700" />
            <span>डिजिटली प्रमाणित स्टांप</span>
          </span>
        </div>
      )}
    </div>
  );
};
