import React from 'react';
import { Sparkles, Award } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';
import { PosterThemePictureSvg } from '../quotes/posterThemeArt';

export type PosterThemeGraphicKey =
  | 'auto'
  | 'diya'
  | 'education'
  | 'career'
  | 'devotional'
  | 'humanity'
  | 'patriotism'
  | 'life'
  | 'family'
  | 'friends'
  | 'festivals'
  | 'none';

export interface JJFOfficialAttachedPosterProps {
  salutation?: string; // e.g. "प्रिय देशवासियों," or "प्रिय श्री प्रकाश नारायण चौबे जी,"
  headline?: string; // e.g. "दिवाली के पावन पर्व की हार्दिक शुभकामनाएं!"
  message?: string; // e.g. "यह दिवाली आपके जीवन में सुख, समृद्धि, खुशहाली और नई रोशनी लेकर आए।"
  subMessage?: string; // e.g. Sanskrit Shloka or secondary dedication
  recipientName?: string;
  recipientTitle?: string;
  recipientPhoto?: string;
  signoff?: string; // default: "- जीवन ज्योति फाउंडेशन, गाज़ीपुर"
  showDiya?: boolean; // default: true
  themeCategory?: string; // e.g. "educational", "career", "festivals", etc.
  themeGraphic?: PosterThemeGraphicKey; // specific graphic override
  customCenterImage?: string; // optional user custom center graphic
  customBgPhoto?: string; // Optional custom background photo (Daily Wisdom)
  bgOverlayDarkness?: number; // 0 to 90 (default: 45)
  bgBlur?: number; // 0 to 12 (default: 0)
  symbolEmoji?: string;
  festivalId?: string;
  className?: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  id?: string;
}

/**
 * Resolves the theme graphic based on explicit override, festivalId, or quote category.
 */
export function resolvePosterGraphic(
  themeGraphic?: PosterThemeGraphicKey,
  themeCategory?: string,
  festivalId?: string,
  showDiya?: boolean
): PosterThemeGraphicKey {
  if (themeGraphic && themeGraphic !== 'auto') {
    return themeGraphic;
  }
  if (festivalId) {
    const f = festivalId.toLowerCase();
    if (f.includes('diwali') || f.includes('deepawali') || f.includes('dhanteras') || f.includes('deepotsav')) {
      return 'diya';
    }
    if (f.includes('chhath')) return 'devotional';
    if (f.includes('holi')) return 'festivals';
    if (f.includes('navratri') || f.includes('durga') || f.includes('dussehra')) return 'devotional';
    if (f.includes('shivratri') || f.includes('krishna') || f.includes('ganesh')) return 'devotional';
    if (f.includes('republic') || f.includes('independence')) return 'patriotism';
    return 'diya';
  }
  if (themeCategory) {
    switch (themeCategory) {
      case 'educational':
        return 'education';
      case 'career':
        return 'career';
      case 'devotional':
        return 'devotional';
      case 'humanity':
        return 'humanity';
      case 'patriotism':
        return 'patriotism';
      case 'life':
        return 'life';
      case 'family':
        return 'family';
      case 'friends':
        return 'friends';
      case 'festivals':
        return 'diya';
    }
  }
  if (showDiya === false) {
    return 'none';
  }
  return 'diya';
}

/**
 * Central Thematic Graphic Component
 * Faithfully reproduces the ornate golden diya from the attached image when festive/diya,
 * and renders high-fidelity category-specific artwork for education, career, seva, etc.
 */
export const PosterCenterThemeGraphic: React.FC<{
  graphicKey: PosterThemeGraphicKey;
  customImage?: string;
}> = ({ graphicKey, customImage }) => {
  if (graphicKey === 'none') return null;

  if (customImage) {
    return (
      <div className="relative w-full flex flex-col items-center justify-center my-2 pointer-events-none select-none">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-44 h-44 rounded-full bg-amber-400/30 blur-2xl pointer-events-none" />
          <img
            src={getOptimizedImageUrl(customImage)}
            alt="Center Thematic Graphic"
            className="relative w-28 sm:w-36 h-28 sm:h-36 object-contain rounded-2xl border-2 border-amber-400/60 shadow-2xl"
          />
        </div>
      </div>
    );
  }

  // 1. FESTIVE ORNATE BRASS DIYA (दीपक) - Centered, radiant, exact match to Image 2
  if (graphicKey === 'diya' || graphicKey === 'festivals') {
    return (
      <div className="relative w-full flex flex-col items-center justify-center my-2 sm:my-3 pointer-events-none select-none">
        <div className="relative flex items-center justify-center">
          {/* Luminous Warm Golden Radiance Halo */}
          <div className="absolute w-56 sm:w-72 h-36 sm:h-44 rounded-full bg-gradient-to-r from-amber-500/35 via-yellow-400/40 to-amber-500/35 blur-2xl pointer-events-none" />
          <img
            src="/assets/jjf_ornate_diya_transparent.png"
            alt="Ornate Auspicious Diya"
            className="relative w-52 sm:w-64 md:w-72 max-w-[85%] h-auto drop-shadow-[0_0_24px_rgba(255,215,0,0.7)] object-contain select-none"
            loading="eager"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/jjf_festive_diya.png';
            }}
          />
        </div>
      </div>
    );
  }

  // 2. EDUCATIONAL & WISDOM (शिक्षा एवं ज्ञान) - Open Book of Knowledge, Lamp of Wisdom, Golden Laurel
  if (graphicKey === 'education') {
    return (
      <div className="relative w-full flex flex-col items-center justify-center my-2 sm:my-3 pointer-events-none select-none">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-48 sm:w-60 h-32 sm:h-40 rounded-full bg-amber-400/25 blur-2xl pointer-events-none" />
          <div className="relative p-2.5 rounded-2xl bg-black/30 border border-amber-400/40 backdrop-blur-xs shadow-xl flex items-center justify-center">
            <PosterThemePictureSvg
              themeId="theme-edu-wisdom"
              size={135}
              className="w-28 sm:w-36 md:w-40 h-auto drop-shadow-[0_0_16px_rgba(255,215,0,0.6)]"
            />
          </div>
        </div>
      </div>
    );
  }

  // 3. CAREER & VICTORY (कर्म एवं सफलता) - Summit Peak, Rising Sun & Victory Trophy
  if (graphicKey === 'career') {
    return (
      <div className="relative w-full flex flex-col items-center justify-center my-2 sm:my-3 pointer-events-none select-none">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-48 sm:w-60 h-32 sm:h-40 rounded-full bg-emerald-400/25 blur-2xl pointer-events-none" />
          <div className="relative p-2.5 rounded-2xl bg-black/30 border border-emerald-400/40 backdrop-blur-xs shadow-xl flex items-center justify-center">
            <PosterThemePictureSvg
              themeId="theme-career-gold"
              size={135}
              className="w-28 sm:w-36 md:w-40 h-auto drop-shadow-[0_0_16px_rgba(16,185,129,0.6)]"
            />
          </div>
        </div>
      </div>
    );
  }

  // 4. DEVOTIONAL & SPIRITUAL (भक्ति एवं आध्यात्म) - Sacred ॐ (Om) & Divine Lotus
  if (graphicKey === 'devotional') {
    return (
      <div className="relative w-full flex flex-col items-center justify-center my-2 sm:my-3 pointer-events-none select-none">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-48 sm:w-60 h-32 sm:h-40 rounded-full bg-amber-400/30 blur-2xl pointer-events-none" />
          <div className="relative p-2.5 rounded-2xl bg-black/30 border border-amber-400/40 backdrop-blur-xs shadow-xl flex items-center justify-center">
            <PosterThemePictureSvg
              themeId="theme-devo-saffron"
              size={135}
              className="w-28 sm:w-36 md:w-40 h-auto drop-shadow-[0_0_16px_rgba(251,191,36,0.65)]"
            />
          </div>
        </div>
      </div>
    );
  }

  // 5. HUMANITY & COMPASSION (मानवता एवं सेवा) - Helping Hands, Radiant Heart & Green Sapling
  if (graphicKey === 'humanity') {
    return (
      <div className="relative w-full flex flex-col items-center justify-center my-2 sm:my-3 pointer-events-none select-none">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-48 sm:w-60 h-32 sm:h-40 rounded-full bg-sky-400/25 blur-2xl pointer-events-none" />
          <div className="relative p-2.5 rounded-2xl bg-black/30 border border-sky-400/40 backdrop-blur-xs shadow-xl flex items-center justify-center">
            <PosterThemePictureSvg
              themeId="theme-humanity-emerald"
              size={135}
              className="w-28 sm:w-36 md:w-40 h-auto drop-shadow-[0_0_16px_rgba(56,189,248,0.6)]"
            />
          </div>
        </div>
      </div>
    );
  }

  // 6. PATRIOTISM & NATION (राष्ट्रसेवा एवं देशभक्ति) - Ashoka Chakra, Flaming Torch & Tiranga Waves
  if (graphicKey === 'patriotism') {
    return (
      <div className="relative w-full flex flex-col items-center justify-center my-2 sm:my-3 pointer-events-none select-none">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-48 sm:w-60 h-32 sm:h-40 rounded-full bg-orange-400/25 blur-2xl pointer-events-none" />
          <div className="relative p-2.5 rounded-2xl bg-black/30 border border-orange-400/40 backdrop-blur-xs shadow-xl flex items-center justify-center">
            <PosterThemePictureSvg
              themeId="theme-patriot-tricolor"
              size={135}
              className="w-28 sm:w-36 md:w-40 h-auto drop-shadow-[0_0_16px_rgba(249,115,22,0.6)]"
            />
          </div>
        </div>
      </div>
    );
  }

  // 7. LIFE & PHILOSOPHY (जीवन दर्शन एवं शांति) - Zen Lotus & Dawn Sun
  if (graphicKey === 'life') {
    return (
      <div className="relative w-full flex flex-col items-center justify-center my-2 sm:my-3 pointer-events-none select-none">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-48 sm:w-60 h-32 sm:h-40 rounded-full bg-rose-400/25 blur-2xl pointer-events-none" />
          <div className="relative p-2.5 rounded-2xl bg-black/30 border border-rose-400/40 backdrop-blur-xs shadow-xl flex items-center justify-center">
            <PosterThemePictureSvg
              themeId="theme-life-serene"
              size={135}
              className="w-28 sm:w-36 md:w-40 h-auto drop-shadow-[0_0_16px_rgba(244,63,94,0.6)]"
            />
          </div>
        </div>
      </div>
    );
  }

  // 8. FAMILY & HERITAGE (परिवार एवं संस्कार) - Kalpavriksha Banyan Tree of Heritage
  if (graphicKey === 'family') {
    return (
      <div className="relative w-full flex flex-col items-center justify-center my-2 sm:my-3 pointer-events-none select-none">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-48 sm:w-60 h-32 sm:h-40 rounded-full bg-pink-400/25 blur-2xl pointer-events-none" />
          <div className="relative p-2.5 rounded-2xl bg-black/30 border border-pink-400/40 backdrop-blur-xs shadow-xl flex items-center justify-center">
            <PosterThemePictureSvg
              themeId="theme-family-terracotta"
              size={135}
              className="w-28 sm:w-36 md:w-40 h-auto drop-shadow-[0_0_16px_rgba(244,114,182,0.6)]"
            />
          </div>
        </div>
      </div>
    );
  }

  // 9. FRIENDS & BROTHERHOOD (मित्रता एवं एकता) - Clasping Hands of Unity & Twin Stars
  if (graphicKey === 'friends') {
    return (
      <div className="relative w-full flex flex-col items-center justify-center my-2 sm:my-3 pointer-events-none select-none">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-48 sm:w-60 h-32 sm:h-40 rounded-full bg-cyan-400/25 blur-2xl pointer-events-none" />
          <div className="relative p-2.5 rounded-2xl bg-black/30 border border-cyan-400/40 backdrop-blur-xs shadow-xl flex items-center justify-center">
            <PosterThemePictureSvg
              themeId="theme-friends-teal"
              size={135}
              className="w-28 sm:w-36 md:w-40 h-auto drop-shadow-[0_0_16px_rgba(6,182,212,0.6)]"
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

/**
 * Universal SVG Golden Lotus Blossom for Poster Bottom Corners
 */
export const GoldenCornerLotus: React.FC<{ className?: string; flipped?: boolean }> = ({
  className = '',
  flipped = false
}) => (
  <svg
    viewBox="0 0 200 160"
    className={`w-28 sm:w-36 h-auto pointer-events-none select-none drop-shadow-md ${
      flipped ? '-scale-x-100' : ''
    } ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="lotusGoldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFA000" />
        <stop offset="50%" stopColor="#FFD54F" />
        <stop offset="100%" stopColor="#FFF9C4" />
      </linearGradient>
    </defs>
    {/* Base radiating petals */}
    <path
      d="M10,150 C30,90 90,60 100,10 C110,60 170,90 190,150 C140,140 120,110 100,100 C80,110 60,140 10,150 Z"
      stroke="url(#lotusGoldGrad)"
      strokeWidth="2.5"
      strokeLinejoin="round"
      opacity="0.9"
    />
    <path
      d="M25,150 C45,100 85,80 100,30 C115,80 155,100 175,150 C135,142 120,120 100,110 C80,120 65,142 25,150 Z"
      stroke="url(#lotusGoldGrad)"
      strokeWidth="2"
      strokeLinejoin="round"
      opacity="0.8"
    />
    <path
      d="M45,150 C60,115 85,95 100,55 C115,95 140,115 155,150 C125,145 115,130 100,125 C85,130 75,145 45,150 Z"
      stroke="url(#lotusGoldGrad)"
      strokeWidth="1.8"
      strokeLinejoin="round"
      opacity="0.75"
    />
    {/* Side Flourish Petals */}
    <path
      d="M10,150 C15,110 40,80 75,70 C55,95 45,120 40,150 Z"
      stroke="url(#lotusGoldGrad)"
      strokeWidth="2"
      opacity="0.7"
    />
    <path
      d="M190,150 C185,110 160,80 125,70 C145,95 155,120 160,150 Z"
      stroke="url(#lotusGoldGrad)"
      strokeWidth="2"
      opacity="0.7"
    />
    {/* Little gold spark dust */}
    <circle cx="100" cy="8" r="3" fill="#FFF9C4" />
    <circle cx="75" cy="50" r="2" fill="#FFD54F" opacity="0.8" />
    <circle cx="125" cy="50" r="2" fill="#FFD54F" opacity="0.8" />
    <circle cx="40" cy="110" r="1.5" fill="#FFA000" opacity="0.7" />
    <circle cx="160" cy="110" r="1.5" fill="#FFA000" opacity="0.7" />
  </svg>
);

/**
 * 4-Point & 8-Point Sparkling Golden Star
 */
export const SparklingGoldStar: React.FC<{
  x: string;
  y: string;
  size?: number;
  opacity?: number;
  animate?: boolean;
}> = ({ x, y, size = 20, opacity = 0.85, animate = false }) => (
  <div
    className={`absolute pointer-events-none select-none ${animate ? 'animate-pulse' : ''}`}
    style={{ left: x, top: y, opacity }}
  >
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path
        d="M20,0 L22,16 L38,18 L22,20 L20,36 L18,20 L2,18 L18,16 Z"
        fill="#FFF9C4"
      />
      <circle cx="20" cy="18" r="3" fill="#FFFFFF" />
      <path
        d="M10,8 L20,18 L10,28 M30,8 L20,18 L30,28"
        stroke="#FFD54F"
        strokeWidth="1"
        opacity="0.6"
      />
    </svg>
  </div>
);

/**
 * JJFOfficialAttachedPoster
 * Faithfully reproduces the attached official social media poster of Jeevan Jyoti Foundation Ghazipur.
 * Features:
 * - Top fieldwork collage header (rural education, medical health camp relief, ration distribution, 3D circular emblem, NITI Aayog ribbon, contact strip).
 * - Glowing undulating golden ribbon wave separator.
 * - Deep royal crimson/maroon gradient backdrop with luminous golden bokeh, sparkling stars, and hanging golden ornament.
 * - Glowing brass Diya (दीपक) with radiant flame and sparkles.
 * - High-contrast, drop-shadowed Hindi typography.
 * - Lower corner golden lotuses & foundation attribution.
 */
export const JJFOfficialAttachedPoster: React.FC<JJFOfficialAttachedPosterProps> = ({
  salutation = 'प्रिय देशवासियों,',
  headline = 'दिवाली के पावन पर्व की\nहार्दिक शुभकामनाएं!',
  message = 'यह दिवाली आपके जीवन में सुख, समृद्धि,\nखुशहाली और नई रोशनी लेकर आए।',
  subMessage,
  recipientName,
  recipientTitle,
  recipientPhoto,
  signoff = '- जीवन ज्योति फाउंडेशन, गाज़ीपुर',
  showDiya = true,
  themeCategory,
  themeGraphic = 'auto',
  customCenterImage,
  customBgPhoto,
  bgOverlayDarkness = 45,
  bgBlur = 0,
  festivalId,
  symbolEmoji = '🪔',
  className = '',
  containerRef,
  id = 'jjf-official-attached-poster'
}) => {
  const resolvedGraphic = resolvePosterGraphic(themeGraphic, themeCategory, festivalId, showDiya);
  return (
    <div
      ref={containerRef as any}
      id={id}
      className={`relative w-full max-w-[500px] mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-[#8B0000] ring-2 ring-[#D4AF37]/80 flex flex-col justify-between select-none ${className}`}
      style={{
        background: 'radial-gradient(ellipse at 50% 35%, #9E1010 0%, #800000 35%, #520000 70%, #2A0000 100%)',
        aspectRatio: '9 / 18.6',
        minHeight: '740px'
      }}
    >
      {/* Optional Custom Background Photo for Daily Wisdom */}
      {customBgPhoto && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src={customBgPhoto}
            alt="Custom Background"
            className="w-full h-full object-cover"
            style={{
              filter: `blur(${bgBlur}px)`,
              transform: bgBlur > 0 ? 'scale(1.08)' : 'scale(1.01)'
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, rgba(40,0,0,0.65) 0%, rgba(0,0,0,${bgOverlayDarkness / 100}) 40%, rgba(20,0,0,0.88) 100%)`
            }}
          />
        </div>
      )}
      {/* =========================================================================
          SECTION 1: TOP FIELDWORK COLLAGE & NGO BRANDING HEADER
          Exact match to attached image: rural school, medical relief, women ration,
          3D circular JJF emblem, NITI Aayog ribbon, contact bar.
         ========================================================================= */}
      <div className="relative w-full shrink-0 z-20">
        <img
          src="/assets/jjf_poster_header_banner.jpg"
          alt="Jeevan Jyoti Foundation Ghazipur Seva Collage Header"
          className="w-full h-auto block select-none pointer-events-none"
          loading="eager"
          decoding="async"
        />

        {/* Seamless Undulating Golden-Orange Ribbon Separator Wave */}
        <div className="relative -mt-3.5 sm:-mt-5 w-full pointer-events-none overflow-hidden">
          <svg
            viewBox="0 0 1104 80"
            className="w-full h-auto block"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="jjfWaveGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E65100" />
                <stop offset="25%" stopColor="#FF9800" />
                <stop offset="55%" stopColor="#FFD54F" />
                <stop offset="75%" stopColor="#FFA000" />
                <stop offset="100%" stopColor="#E65100" />
              </linearGradient>
              <linearGradient id="jjfWaveInnerCrimson" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(128, 0, 0, 0)" />
                <stop offset="100%" stopColor="#800000" />
              </linearGradient>
            </defs>
            {/* Primary Sweeping Golden Wave Ribbon */}
            <path
              d="M -10,15 Q 260,78 550,42 T 1114,35 L 1114,80 L -10,80 Z"
              fill="url(#jjfWaveInnerCrimson)"
            />
            <path
              d="M -10,12 Q 260,75 550,38 T 1114,30"
              stroke="url(#jjfWaveGoldGrad)"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d="M -10,18 Q 260,82 550,45 T 1114,38"
              stroke="#FFE57F"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: MAIN BODY - ROYAL CRIMSON BOKEH, GLOWING DIYA & GREETING
         ========================================================================= */}
      <div className="relative flex-1 flex flex-col justify-between px-5 sm:px-7 py-4 sm:py-6 text-center z-10 overflow-hidden">
        {/* Floating Glowing Bokeh Orbs */}
        <div className="absolute top-4 left-8 w-14 h-14 rounded-full bg-amber-400/20 blur-md pointer-events-none" />
        <div className="absolute top-20 right-10 w-20 h-20 rounded-full bg-amber-300/15 blur-lg pointer-events-none" />
        <div className="absolute bottom-28 left-16 w-16 h-16 rounded-full bg-amber-400/20 blur-md pointer-events-none" />
        <div className="absolute bottom-12 right-12 w-24 h-24 rounded-full bg-amber-300/15 blur-xl pointer-events-none" />

        {/* Hanging Golden Festive Ornament / Bell on Top-Right */}
        <div className="absolute top-1 right-6 sm:right-8 flex flex-col items-center pointer-events-none select-none opacity-90">
          <div className="w-[1.5px] h-10 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-300" />
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-700 shadow-md border border-yellow-100 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
          </div>
        </div>

        {/* Scattered Sparkling Golden Stars (matching the attachment) */}
        <SparklingGoldStar x="12%" y="10%" size={26} opacity={0.9} />
        <SparklingGoldStar x="82%" y="15%" size={22} opacity={0.85} />
        <SparklingGoldStar x="18%" y="38%" size={28} opacity={0.95} />
        <SparklingGoldStar x="88%" y="42%" size={24} opacity={0.8} />
        <SparklingGoldStar x="48%" y="78%" size={20} opacity={0.75} />
        <SparklingGoldStar x="15%" y="68%" size={22} opacity={0.8} />

        {/* Central Greetings / Suvichar Content Area */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center space-y-3 sm:space-y-4 pt-2">
          {/* Salutation / Primary Addressing */}
          <div className="space-y-1">
            <h3
              className="text-xl sm:text-2xl md:text-3xl font-black text-[#FFE57F] tracking-wide font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
              style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.9), 0 0 12px rgba(255, 215, 0, 0.35)' }}
            >
              {recipientName ? `प्रिय ${recipientName} जी,` : salutation}
            </h3>

            {/* Recipient Title (if provided) */}
            {recipientTitle && (
              <p className="text-xs sm:text-sm font-bold text-amber-200/90 tracking-wider">
                ({recipientTitle})
              </p>
            )}
          </div>

          {/* Main Occasion / Festival / Quote Headline */}
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-serif leading-snug tracking-tight max-w-lg mx-auto"
            style={{
              textShadow: '0 3px 8px rgba(0, 0, 0, 0.95), 0 0 16px rgba(255, 235, 127, 0.45)',
              whiteSpace: 'pre-line'
            }}
          >
            {headline}
          </h2>

          {/* Central Thematic Graphic (CENTERED, exactly positioned like in Image 2) */}
          <PosterCenterThemeGraphic
            graphicKey={resolvedGraphic}
            customImage={customCenterImage}
          />

          {/* Wishing Message / Core Blessing Text */}
          <p
            className="text-base sm:text-lg md:text-xl font-bold text-[#FFF8E7] leading-relaxed max-w-md mx-auto pt-1"
            style={{
              textShadow: '0 2px 6px rgba(0, 0, 0, 0.95)',
              whiteSpace: 'pre-line'
            }}
          >
            {message}
          </p>

          {/* Optional Vedic Shloka or Sub-Dedication */}
          {subMessage && (
            <div className="pt-2 px-3 sm:px-4 py-1.5 rounded-xl bg-black/35 border border-amber-300/40 text-amber-200 text-xs sm:text-sm font-serif italic max-w-md mx-auto shadow-inner">
              {subMessage}
            </div>
          )}

          {/* Optional Personalized Recipient Photo Badge */}
          {recipientPhoto && (
            <div className="pt-2 flex items-center justify-center gap-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400 shadow-xl overflow-hidden bg-white/10 p-0.5 shrink-0 ring-4 ring-amber-500/30">
                <img
                  src={getOptimizedImageUrl(recipientPhoto)}
                  alt={recipientName || 'Recipient'}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              {recipientName && (
                <div className="text-left">
                  <div className="text-xs font-black text-amber-300">{recipientName}</div>
                  <div className="text-[10px] text-amber-100/80">{recipientTitle || 'सम्मानित नागरिक'}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* =====================================================================
            SECTION 3: FOOTER SIGNATURE & ORNATE CORNER LOTUSES
           ===================================================================== */}
        <div className="relative w-full z-10 pt-4 pb-1">
          {/* Foundation Attribution Signature */}
          <div
            className="text-base sm:text-lg md:text-xl font-black text-[#FFE082] font-serif tracking-wide drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)]"
            style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.95), 0 0 10px rgba(255, 215, 0, 0.4)' }}
          >
            {signoff}
          </div>

          {/* Bottom Golden Corner Lotuses (Left & Right) */}
          <div className="absolute -bottom-2 -left-3 pointer-events-none">
            <GoldenCornerLotus />
          </div>
          <div className="absolute -bottom-2 -right-3 pointer-events-none">
            <GoldenCornerLotus flipped />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JJFOfficialAttachedPoster;
