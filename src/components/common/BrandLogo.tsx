import React, { useState, useEffect, useMemo } from 'react';
import { useHomeContent } from '../../context/HomeContentContext';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';
import { getCacheBustedImageUrl } from '../../services/offlineCertificateCache';

export interface BrandLogoProps {
  size?: number | string;
  className?: string;
  variant?: 'default' | 'white' | 'dark';
  watermark?: boolean;
  opacity?: number;
  id?: string;
  alt?: string;
  style?: React.CSSProperties;
  interactive?: boolean;
  customLogoUrl?: string;
  forceVector?: boolean;
  onClick?: (e: React.MouseEvent<SVGSVGElement | HTMLImageElement | HTMLDivElement>) => void;
}

/**
 * Universal Inline Vector Emblem for Jeevan Jyoti Foundation Ghazipur
 * Guaranteed 100% offline and network-resilient vector fallback
 */
export const OfficialVectorEmblem: React.FC<{
  size: number | string;
  className?: string;
  id?: string;
  opacity?: number;
  watermark?: boolean;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<SVGSVGElement>) => void;
}> = ({ size, className = '', id, opacity = 1, watermark = false, style = {}, onClick }) => {
  const dimensionStyle: React.CSSProperties = typeof size === 'number'
    ? { width: `${size}px`, height: `${size}px` }
    : { width: size, height: size };

  return (
    <svg
      id={id || 'jjf-official-vector-emblem'}
      width="512"
      height="512"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-full shrink-0 select-none ${className} ${watermark ? 'pointer-events-none' : ''}`}
      style={{
        ...dimensionStyle,
        opacity,
        filter: watermark ? 'contrast(1.08)' : 'drop-shadow(0 2px 5px rgba(0,0,0,0.18))',
        shapeRendering: 'geometricPrecision',
        textRendering: 'geometricPrecision',
        ...style
      }}
      onClick={onClick}
      role="img"
      aria-label="जीवन ज्योति फाउंडेशन आधिकारिक लोगो"
    >
      <defs>
        {/* Upper text arc adjusted for optimal optical balance and letterspacing */}
        <path id="jjfTextArcUpper" d="M 52,256 A 204,204 0 1,1 460,256" fill="none" />
        <path id="jjfTextArcLower" d="M 460,256 A 204,204 0 0,1 52,256" fill="none" />
        <radialGradient id="jjfSunBgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="65%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#FFA000" />
        </radialGradient>
        {/* Crisp text shadow filter for maximum legibility */}
        <filter id="jjfTextGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.75" />
        </filter>
        <radialGradient id="jjfOuterRingGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#3F126D" />
          <stop offset="70%" stopColor="#250842" />
          <stop offset="100%" stopColor="#18042B" />
        </radialGradient>
      </defs>

      {/* 1. Outer Dark Purple Ring with Gold Borders */}
      <circle cx="256" cy="256" r="248" fill="url(#jjfOuterRingGrad)" stroke="#FFD700" strokeWidth="6" />
      <circle cx="256" cy="256" r="242" fill="none" stroke="#FFA000" strokeWidth="2" />

      {/* 2. Upper Curved Text: JEEVAN JYOTI FOUNDATION with Enhanced Legibility and Shadow */}
      <text
        fill="#FFE57F"
        stroke="#1A0330"
        strokeWidth="1.2"
        paintOrder="stroke fill"
        fontFamily="'Cinzel', 'Times New Roman', 'Georgia', serif"
        fontWeight="900"
        fontSize="28.5"
        letterSpacing="4.5"
        filter="url(#jjfTextGlow)"
      >
        <textPath href="#jjfTextArcUpper" startOffset="50%" textAnchor="middle">
          JEEVAN JYOTI FOUNDATION
        </textPath>
      </text>

      {/* 3. Lower Curved Text: GHAZIPUR (U.P.) with Maximum Clarity */}
      <text
        fill="#FFE57F"
        stroke="#1A0330"
        strokeWidth="1.2"
        paintOrder="stroke fill"
        fontFamily="'Cinzel', 'Times New Roman', 'Georgia', serif"
        fontWeight="900"
        fontSize="32"
        letterSpacing="8"
        filter="url(#jjfTextGlow)"
      >
        <textPath href="#jjfTextArcLower" startOffset="50%" textAnchor="middle">
          GHAZIPUR (U.P.)
        </textPath>
      </text>

      {/* 4. Decorative Stars on Sides */}
      <g fill="#FFD700" stroke="#E65100" strokeWidth="0.8">
        <polygon points="54,256 50,250 56,252 59,247 60,253 66,255 60,257 59,263 56,258 50,260" transform="translate(-10, 0) scale(1.2)" />
        <polygon points="458,256 454,250 460,252 463,247 464,253 470,255 464,257 463,263 460,258 454,260" transform="translate(10, 0) scale(1.2)" />
      </g>

      {/* 5. Inner Golden Yellow Circle Field */}
      <circle cx="256" cy="256" r="182" fill="#F9A825" stroke="#2C0C4D" strokeWidth="4" />
      <circle cx="256" cy="256" r="176" fill="none" stroke="#FFF9C4" strokeWidth="1.8" />
      <circle cx="256" cy="256" r="171" fill="none" stroke="#7F5500" strokeWidth="1.2" />

      {/* 6. Radiant Sunburst Background Circle */}
      <circle cx="256" cy="250" r="110" fill="url(#jjfSunBgGrad)" stroke="#FFA000" strokeWidth="2.5" />

      {/* 7. Sunburst Rays */}
      <g opacity="0.9">
        <polygon points="256,250 252,142 260,142" fill="#E64A19" />
        <polygon points="256,250 332,174 338,180" fill="#E64A19" />
        <polygon points="256,250 364,250 364,258" fill="#E64A19" />
        <polygon points="256,250 174,180 180,174" fill="#E64A19" />
        <polygon points="256,250 148,250 148,258" fill="#E64A19" />
      </g>

      {/* Inner Sunburst Border Ring */}
      <circle cx="256" cy="250" r="108" fill="none" stroke="#2C0C4D" strokeWidth="3" />

      {/* 8. Meditating Yogi / Buddha Silhouette in Padmasana (Lotus Pose) */}
      <g fill="#2C0C4D">
        <ellipse cx="256" cy="188" rx="14" ry="17" />
        <circle cx="256" cy="168" r="6" />
        <path d="M 251,204 C 246,207 236,212 226,217 C 220,220 216,227 215,236 C 214,244 216,252 220,265 C 223,273 226,279 230,282 L 230,285 C 220,286 200,288 185,296 C 178,300 180,306 188,307 C 202,308 226,306 242,303 C 248,307 254,308 256,308 C 258,308 264,307 270,303 C 286,306 310,308 324,307 C 332,306 334,300 327,296 C 312,288 292,286 282,285 L 282,282 C 286,279 289,273 292,265 C 296,252 298,244 297,236 C 296,227 292,220 286,217 C 276,212 266,207 261,204 Z" />
        <path d="M 216,242 C 210,252 200,270 192,285 C 188,292 186,298 190,300 C 195,301 202,298 210,288 C 216,280 224,268 226,255 Z" />
        <path d="M 296,242 C 302,252 312,270 320,285 C 324,292 326,298 322,300 C 317,301 310,298 302,288 C 296,280 288,268 286,255 Z" />
        <ellipse cx="256" cy="303" rx="42" ry="10" />
        <ellipse cx="198" cy="300" rx="18" ry="8" transform="rotate(-8, 198, 300)" />
        <ellipse cx="314" cy="300" rx="18" ry="8" transform="rotate(8, 314, 300)" />
      </g>

      {/* 9. ESTD - 2018 Text with High Contrast */}
      <rect x="204" y="316" width="104" height="19" rx="9.5" fill="#FFE082" stroke="#2C0C4D" strokeWidth="1.2" opacity="0.9" />
      <text
        x="256"
        y="330"
        fontFamily="'Cinzel', 'Arial', sans-serif"
        fontWeight="900"
        fontSize="14"
        fill="#2C0C4D"
        textAnchor="middle"
        letterSpacing="2.5"
      >
        ESTD - 2018
      </text>
    </svg>
  );
};

/**
 * BrandLogo - Universal Dynamic NGO Logo Component with Resilient Multi-Tier Fallback
 * Dynamically renders custom uploaded app logo, pristine PNG, or high-precision official JJF vector emblem.
 * Guaranteed to NEVER render null or produce a broken image box.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 200, 
  className = '',
  variant = 'default',
  watermark = false,
  opacity,
  id,
  alt = 'जीवन ज्योति फाउंडेशन आधिकारिक लोगो',
  style = {},
  customLogoUrl,
  forceVector = false,
  onClick
}) => {
  const homeContext = useHomeContent();
  const contextLogo = homeContext?.content?.appLogoUrl || '';

  const [localCustomLogo, setLocalCustomLogo] = useState<string>(() => {
    if (customLogoUrl !== undefined && customLogoUrl !== '') return customLogoUrl;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('jjf_custom_logo');
        if (stored) return stored;
      } catch {
        // Ignore
      }
    }
    return contextLogo || '';
  });

  // Fallback stages:
  // 0: Preferred active URL (cache-busted)
  // 1: /uploads/ngo_logo.png
  // 2: /logo.png
  // 3: /logo.svg
  // 4: Pure Inline Vector SVG Emblem (100% fail-proof)
  const [fallbackStage, setFallbackStage] = useState<number>(0);

  // Sync with contextLogo or customLogoUrl
  useEffect(() => {
    if (customLogoUrl !== undefined) {
      setLocalCustomLogo(customLogoUrl);
      setFallbackStage(0);
    } else if (contextLogo !== undefined) {
      setLocalCustomLogo(contextLogo || '');
      setFallbackStage(0);
    }
  }, [customLogoUrl, contextLogo]);

  // Listen for instant custom events for immediate updates across all components
  useEffect(() => {
    const handleLogoChange = (e: CustomEvent<string>) => {
      const newLogo = typeof e.detail === 'string' ? e.detail : '';
      setLocalCustomLogo(newLogo);
      if (newLogo && typeof window !== 'undefined') {
        localStorage.removeItem('jjf_logo_permanently_deleted');
      }
      setFallbackStage(0);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('jjf-logo-changed' as any, handleLogoChange);
      return () => {
        window.removeEventListener('jjf-logo-changed' as any, handleLogoChange);
      };
    }
  }, []);

  const resolvedSize = typeof size === 'number' 
    ? size 
    : (size === 'xs' ? 24 : size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : size === 'xl' ? 80 : size);

  // Determine active logo URL to render:
  // Priority: 1. explicit prop, 2. context logo, 3. local event state, 4. local storage, 5. official default
  let activeLogoUrl = '';
  const isPermanentlyDeleted = typeof window !== 'undefined' && localStorage.getItem('jjf_logo_permanently_deleted') === 'true';

  if (customLogoUrl !== undefined && customLogoUrl !== '') {
    activeLogoUrl = customLogoUrl;
  } else if (contextLogo && contextLogo.trim()) {
    activeLogoUrl = contextLogo.trim();
  } else if (localCustomLogo && localCustomLogo.trim()) {
    activeLogoUrl = localCustomLogo.trim();
  } else if (typeof window !== 'undefined' && !isPermanentlyDeleted) {
    try {
      activeLogoUrl = localStorage.getItem('jjf_custom_logo') || '';
    } catch {
      activeLogoUrl = '';
    }
  } else {
    activeLogoUrl = '';
  }

  if (activeLogoUrl && (activeLogoUrl.includes('1791445209912') || activeLogoUrl.includes('1791445272050') || activeLogoUrl.includes('ngo_logo.png'))) {
    activeLogoUrl = '';
  }

  // Reset fallbackStage when activeLogoUrl changes
  useEffect(() => {
    setFallbackStage(0);
  }, [activeLogoUrl]);

  const finalOpacity = watermark ? (opacity ?? 0.12) : (opacity ?? 1);

  // If forceVector is requested, or if permanently deleted, or if activeLogoUrl is empty, or fallbackStage >= 3, render the pure SVG directly
  if (forceVector || fallbackStage >= 3 || isPermanentlyDeleted || !activeLogoUrl) {
    return (
      <OfficialVectorEmblem
        id={id || 'jjf-official-brand-logo'}
        size={resolvedSize}
        className={className}
        opacity={finalOpacity}
        watermark={watermark}
        style={style}
        onClick={onClick as any}
      />
    );
  }

  // Calculate current image source based on fallbackStage
  let currentSrc = '';
  if (fallbackStage === 0) {
    currentSrc = getCacheBustedImageUrl(activeLogoUrl);
  } else if (fallbackStage === 1) {
    currentSrc = '/logo.png';
  } else if (fallbackStage === 2) {
    currentSrc = '/logo.svg';
  }

  const handleImageError = () => {
    // Advance to next fallback stage gracefully
    setFallbackStage((prev) => prev + 1);
  };

  const dimensionStyle: React.CSSProperties = typeof resolvedSize === 'number' 
    ? { width: `${resolvedSize}px`, height: `${resolvedSize}px` } 
    : { width: resolvedSize, height: resolvedSize };

  const logoSourceUrl = getOptimizedImageUrl(currentSrc, {
    width: typeof resolvedSize === 'number' ? resolvedSize * 4 : 512,
    quality: 95
  });

  return (
    <img
      id={id || 'jjf-official-brand-logo'}
      data-official-logo="true"
      src={logoSourceUrl}
      alt={alt}
      className={`object-contain rounded-full inline-block shrink-0 ${className} ${watermark ? 'pointer-events-none select-none' : ''}`}
      style={{
        ...dimensionStyle,
        opacity: finalOpacity,
        imageRendering: 'crisp-edges',
        filter: watermark
          ? 'contrast(1.08)'
          : 'contrast(1.08) saturate(1.05) drop-shadow(0 2px 4px rgba(0,0,0,0.14))',
        ...style
      }}
      onError={handleImageError}
      onClick={onClick}
      loading="eager"
      decoding="async"
    />
  );
};

export default BrandLogo;
