import React from 'react';
import {
  OFFICIAL_PHOTO_CROSS_STAMP_BASE64,
  OFFICIAL_PHOTO_CROSS_STAMP_URL
} from '../../data/officialPhotoStampData';

export interface OfficialPhotoCrossStampProps {
  /**
   * Predefined size presets or custom width in pixels
   * 'xs' = 70px, 'sm' = 85px (ID Cards), 'md' = 110px (Standard Certificates), 'lg' = 135px (A4 full sheet)
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | number;
  /**
   * Rotation angle in degrees (authentic cross stamp look, default: -12deg)
   */
  angle?: number;
  /**
   * Opacity of stamp ink (default: 0.95)
   */
  opacity?: number;
  /**
   * Additional Tailwind classes
   */
  className?: string;
  /**
   * Position placement: 'bottom-right' (standard attestation) | 'bottom-center' | 'bottom-left'
   */
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
}

export const OfficialPhotoCrossStamp: React.FC<OfficialPhotoCrossStampProps> = ({
  size = 'sm',
  angle = -12,
  opacity = 0.94,
  className = '',
  position = 'bottom-right'
}) => {
  const widthPx = typeof size === 'number'
    ? size
    : size === 'xs'
    ? 72
    : size === 'sm'
    ? 88
    : size === 'md'
    ? 112
    : 136;

  // Position offsets so stamp crosses over the lower boundary of the photo
  const positionClasses =
    position === 'bottom-center'
      ? 'bottom-[-6px] left-1/2 -translate-x-1/2'
      : position === 'bottom-left'
      ? 'bottom-[-6px] -left-2'
      : 'bottom-[-4px] -right-2 sm:bottom-[-6px] sm:-right-3';

  return (
    <div
      className={`absolute ${positionClasses} pointer-events-none select-none z-20 transition-transform ${className}`}
      style={{
        transform: `rotate(${angle}deg)`,
        opacity
      }}
      title="आधिकारिक डिजिटल क्रॉस मुहर (Official Digital Attestation Stamp)"
    >
      <img
        src={OFFICIAL_PHOTO_CROSS_STAMP_BASE64 || OFFICIAL_PHOTO_CROSS_STAMP_URL}
        alt="Attested Stamp - Jeevan Jyoti Foundation"
        crossOrigin="anonymous"
        style={{
          width: `${widthPx}px`,
          height: 'auto',
          maxWidth: 'none',
          filter: 'drop-shadow(0 1px 2px rgba(11, 37, 122, 0.35))'
        }}
        className="mix-blend-multiply filter contrast-125"
      />
    </div>
  );
};
