import React from 'react';

export interface ThemeArtProps {
  themeId: string;
  size?: number;
  className?: string;
  opacity?: number;
  variant?: 'emblem' | 'watermark' | 'crest';
}

/**
 * High-Fidelity Vector Theme Picture Component for Motivational Quotes Studio
 * According to theme, renders an evocative, theme-related picture.
 */
export const PosterThemePictureSvg: React.FC<ThemeArtProps> = ({
  themeId,
  size = 120,
  className = '',
  opacity = 1,
  variant = 'emblem'
}) => {
  const isWatermark = variant === 'watermark';
  const effectiveOpacity = isWatermark ? 0.15 : opacity;

  switch (themeId) {
    // 1. EDUCATIONAL WISDOM (शिक्षा एवं ज्ञान) - Open Book of Knowledge, Lamp of Wisdom & Laurel
    case 'theme-edu-wisdom':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity: effectiveOpacity }}
        >
          {/* Radial Solar Wisdom Glow */}
          <circle cx="80" cy="80" r="70" fill="url(#edu-glow)" opacity="0.45" />

          {/* Golden Laurel Victory Wreath */}
          <path
            d="M32 90 C30 50 50 28 78 26 M82 26 C110 28 130 50 128 90"
            stroke="#d97706"
            strokeWidth="2.5"
            strokeDasharray="4 6"
            fill="none"
          />

          {/* Open Book of Knowledge (खुली पुस्तक) */}
          <g transform="translate(35, 68)">
            {/* Book Base Spine */}
            <path
              d="M45 42 Q45 36 45 32 M45 42 Q25 44 2 34 L2 6 Q25 14 45 6 Q65 14 88 6 L88 34 Q65 44 45 42 Z"
              fill="#ffffff"
              stroke="#78350f"
              strokeWidth="2"
            />
            {/* Pages Layers */}
            <path d="M45 6 Q25 14 4 7" stroke="#b45309" strokeWidth="1.5" fill="none" />
            <path d="M45 6 Q65 14 86 7" stroke="#b45309" strokeWidth="1.5" fill="none" />
            {/* Left Page Text Lines */}
            <line x1="10" y1="15" x2="38" y2="15" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="10" y1="21" x2="38" y2="21" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="10" y1="27" x2="32" y2="27" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            {/* Right Page Text Lines */}
            <line x1="52" y1="15" x2="80" y2="15" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="52" y1="21" x2="80" y2="21" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="52" y1="27" x2="74" y2="27" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Golden Lamp of Wisdom (ज्ञान दीप / चिराग) floating above book */}
          <g transform="translate(56, 32)">
            {/* Diya Base */}
            <path
              d="M10 28 C10 40 38 40 38 28 C34 32 14 32 10 28 Z"
              fill="url(#gold-lamp)"
              stroke="#78350f"
              strokeWidth="1.5"
            />
            <ellipse cx="24" cy="28" rx="14" ry="4" fill="#fef08a" stroke="#d97706" strokeWidth="1" />
            {/* Flame */}
            <path d="M24 6 C28 14 30 20 24 26 C18 20 20 14 24 6 Z" fill="url(#lamp-flame)" />
            <circle cx="24" cy="18" r="3" fill="#ffffff" />
          </g>

          {/* Quill Pen (कलम) */}
          <g transform="translate(100, 48) rotate(35)">
            <path d="M10 0 C16 8 18 24 10 38 L8 38 C14 24 12 12 6 2 Z" fill="#d97706" />
            <line x1="9" y1="0" x2="9" y2="44" stroke="#78350f" strokeWidth="1.2" />
          </g>

          <defs>
            <radialGradient id="edu-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="gold-lamp" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="lamp-flame" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 2. CAREER & VICTORY (करियर एवं सफलता) - Mountain Summit, Rising Sun & Golden Trophy
    case 'theme-career-gold':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity: effectiveOpacity }}
        >
          {/* Victory Dawn Radiance */}
          <circle cx="80" cy="80" r="72" fill="url(#career-aura)" opacity="0.45" />

          {/* Radiant Rising Sun behind Summit */}
          <circle cx="80" cy="62" r="28" fill="url(#career-sun)" />
          <g stroke="#059669" strokeWidth="2" strokeLinecap="round" opacity="0.6">
            <line x1="80" y1="26" x2="80" y2="18" />
            <line x1="104" y1="36" x2="110" y2="30" />
            <line x1="116" y1="62" x2="124" y2="62" />
            <line x1="56" y1="36" x2="50" y2="30" />
            <line x1="44" y1="62" x2="36" y2="62" />
          </g>

          {/* Soaring Mountain Peaks (पर्वत शिखर) */}
          <polygon points="80,50 115,110 45,110" fill="url(#peak-main)" stroke="#065f46" strokeWidth="1.8" />
          <polygon points="80,50 95,110 45,110" fill="#047857" opacity="0.4" />
          {/* Left Companion Peak */}
          <polygon points="45,75 75,112 15,112" fill="#059669" opacity="0.8" />
          {/* Right Companion Peak */}
          <polygon points="115,75 145,112 85,112" fill="#10b981" opacity="0.8" />

          {/* Golden Victory Laurel & Trophy (विजय ट्रॉफी) */}
          <g transform="translate(62, 74)">
            {/* Trophy Cup Body */}
            <path
              d="M10 8 L26 8 C26 24 10 24 10 8 Z"
              fill="url(#trophy-gold)"
              stroke="#064e3b"
              strokeWidth="1.5"
            />
            {/* Cup Handles */}
            <path d="M10 11 C4 11 4 19 10 19" stroke="#f59e0b" strokeWidth="1.8" fill="none" />
            <path d="M26 11 C32 11 32 19 26 19" stroke="#f59e0b" strokeWidth="1.8" fill="none" />
            {/* Trophy Stem & Pedestal */}
            <rect x="16" y="24" width="4" height="6" fill="#f59e0b" />
            <rect x="12" y="30" width="12" height="4" rx="1" fill="#d97706" stroke="#064e3b" strokeWidth="1" />
            {/* Star of Excellence */}
            <polygon points="18,11 19.5,14.5 23,15 20.5,17.5 21,21 18,19 15,21 15.5,17.5 13,15 16.5,14.5" fill="#ffffff" />
          </g>

          <defs>
            <radialGradient id="career-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#059669" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#065f46" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="career-sun" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="peak-main" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#a7f3d0" />
              <stop offset="80%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
            <linearGradient id="trophy-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#fef08a" />
              <stop offset="80%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 3. DEVOTIONAL & SPIRITUAL (भक्ति एवं आध्यात्म) - Sacred ॐ (Om) & Divine Blooming Lotus
    case 'theme-devo-saffron':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity: effectiveOpacity }}
        >
          {/* Sacred Saffron Halo */}
          <circle cx="80" cy="80" r="70" fill="url(#devo-halo)" opacity="0.5" />

          {/* Ornate Mandala Rays */}
          <circle cx="80" cy="72" r="42" stroke="#ea580c" strokeWidth="1.8" strokeDasharray="4 4" fill="none" opacity="0.6" />

          {/* Divine Calligraphic ॐ (Om) Symbol */}
          <g fill="url(#om-gold)" stroke="#7c2d12" strokeWidth="1.5">
            {/* 3 Curve */}
            <path d="M68 52 C60 48 55 54 55 60 C55 68 64 72 72 72 C64 74 54 80 54 90 C54 100 68 104 78 98 C84 94 88 88 88 82 L82 80 C82 86 78 96 68 96 C62 96 60 92 60 88 C60 80 70 76 78 76 L78 70 C70 70 62 66 62 60 C62 56 66 54 70 56 C74 58 76 62 76 64 L82 62 C82 56 76 48 68 52 Z" />
            {/* Tail Curve */}
            <path d="M75 75 C85 75 96 82 98 94 L104 92 C102 78 88 70 75 70 Z" />
            {/* Crescent & Bindu */}
            <path d="M84 50 C92 50 100 56 102 60 L106 58 C104 52 94 45 84 45 Z" />
            <circle cx="95" cy="44" r="3.5" />
          </g>

          {/* Blooming Sacred Golden Lotus Base (कमल पुष्प) */}
          <g transform="translate(48, 105)">
            {/* Center Petal */}
            <path d="M32 0 C24 -12 40 -12 32 0 Z" fill="#f59e0b" stroke="#7c2d12" strokeWidth="1" />
            {/* Left Petals */}
            <path d="M30 4 C16 -6 24 -12 28 0 Z" fill="#ea580c" stroke="#7c2d12" strokeWidth="1" />
            <path d="M28 8 C6 2 12 -4 24 6 Z" fill="#d97706" stroke="#7c2d12" strokeWidth="1" />
            {/* Right Petals */}
            <path d="M34 4 C48 -6 40 -12 36 0 Z" fill="#ea580c" stroke="#7c2d12" strokeWidth="1" />
            <path d="M36 8 C58 2 52 -4 40 6 Z" fill="#d97706" stroke="#7c2d12" strokeWidth="1" />
          </g>

          <defs>
            <radialGradient id="devo-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#ea580c" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="om-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 4. HUMANITY & COMPASSION (मानवता एवं परोपकार) - Helping Hands, Radiant Heart & Green Sapling
    case 'theme-humanity-emerald':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity: effectiveOpacity }}
        >
          {/* Celestial Compassion Aura */}
          <circle cx="80" cy="80" r="70" fill="url(#hum-aura)" opacity="0.45" />

          {/* Compassionate Radiant Heart (हृदय) */}
          <path
            d="M80 50 C74 38 56 36 48 46 C38 58 44 76 80 102 C116 76 122 58 112 46 C104 36 86 38 80 50 Z"
            fill="url(#heart-grad)"
            stroke="#0284c7"
            strokeWidth="2"
          />

          {/* Inner Light of Compassion */}
          <circle cx="80" cy="62" r="12" fill="#ffffff" opacity="0.6" />

          {/* Sprouting Green Sapling of Life (जीवन ज्योति अंकुर) */}
          <g transform="translate(70, 48)">
            <path d="M10 24 L10 10" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M10 10 C4 2 2 8 10 16 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
            <path d="M10 12 C16 4 18 10 10 18 Z" fill="#4ade80" stroke="#15803d" strokeWidth="1" />
          </g>

          {/* Two Gentle Cupped Helping Hands (सेवा हस्त) */}
          <g stroke="#0369a1" strokeWidth="2" strokeLinecap="round" fill="none">
            {/* Left Hand cupping from bottom left */}
            <path d="M34 104 C40 120 62 126 80 126" />
            <path d="M30 96 C42 110 56 114 74 116" stroke="#0284c7" />
            {/* Right Hand cupping from bottom right */}
            <path d="M126 104 C120 120 98 126 80 126" />
            <path d="M130 96 C118 110 104 114 86 116" stroke="#0284c7" />
          </g>

          <defs>
            <radialGradient id="hum-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#082f49" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="heart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 5. FAMILY & HERITAGE (परिवार एवं संस्कार) - Kalpavriksha Banyan Tree of Heritage & Diya
    case 'theme-family-terracotta':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity: effectiveOpacity }}
        >
          {/* Warm Rose Ochre Family Aura */}
          <circle cx="80" cy="80" r="70" fill="url(#fam-aura)" opacity="0.45" />

          {/* Sacred Banyan Kalpavriksha Canopy (संस्कार वटवृक्ष) */}
          <g fill="url(#tree-canopy)" stroke="#831843" strokeWidth="1.5">
            <circle cx="80" cy="52" r="24" />
            <circle cx="60" cy="58" r="18" />
            <circle cx="100" cy="58" r="18" />
            <circle cx="48" cy="72" r="15" />
            <circle cx="112" cy="72" r="15" />
            <circle cx="80" cy="68" r="22" />
          </g>

          {/* Strong Tree Trunk with Protective Roots */}
          <path
            d="M74 78 C74 95 68 112 55 124 L105 124 C92 112 86 95 86 78 Z"
            fill="#701a75"
            stroke="#4a044e"
            strokeWidth="2"
          />
          {/* Branch Outlines */}
          <path d="M76 84 C68 76 60 74 54 75" stroke="#f472b6" strokeWidth="2" fill="none" />
          <path d="M84 84 C92 76 100 74 106 75" stroke="#f472b6" strokeWidth="2" fill="none" />

          {/* Warm Hearth Diya in Center Trunk Base */}
          <g transform="translate(68, 102)">
            <ellipse cx="12" cy="16" rx="10" ry="3.5" fill="#f59e0b" stroke="#831843" strokeWidth="1" />
            <path d="M12 4 C14 8 16 12 12 15 C8 12 10 8 12 4 Z" fill="#fef08a" />
          </g>

          <defs>
            <radialGradient id="fam-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fce7f3" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#db2777" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#4a044e" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="tree-canopy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="50%" stopColor="#db2777" />
              <stop offset="100%" stopColor="#9d174d" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 6. FRIENDS & BROTHERHOOD (मित्रता एवं भाईचारा) - Clasping Hands of Unity & Twin Stars
    case 'theme-friends-teal':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity: effectiveOpacity }}
        >
          {/* Aqua Breeze Unity Aura */}
          <circle cx="80" cy="80" r="70" fill="url(#friends-aura)" opacity="0.45" />

          {/* Circular Fellowship Ring */}
          <circle cx="80" cy="80" r="48" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5 5" fill="none" opacity="0.7" />

          {/* Interlocking Friendship Hands (मैत्री हस्त) */}
          <g transform="translate(38, 54)">
            {/* Left Arm & Hand */}
            <path
              d="M5 28 L28 28 C34 28 38 22 42 22 L52 28 C56 30 56 36 50 38 L38 38"
              stroke="#0891b2"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Arm & Hand Clasping */}
            <path
              d="M80 28 L56 28 C50 28 46 34 42 34 L32 28 C28 26 28 20 34 18 L46 18"
              stroke="#0e7490"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Interlocked Center Core */}
            <circle cx="42" cy="28" r="8" fill="#cffafe" stroke="#0891b2" strokeWidth="2" />
          </g>

          {/* Twin Guiding Stars of Companionship */}
          <path d="M54 44 L56 50 L62 52 L56 54 L54 60 L52 54 L46 52 L52 50 Z" fill="#06b6d4" />
          <path d="M106 44 L108 50 L114 52 L108 54 L106 60 L104 54 L98 52 L104 50 Z" fill="#06b6d4" />

          <defs>
            <radialGradient id="friends-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#cffafe" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0891b2" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#083344" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      );

    // 7. LIFE & PHILOSOPHY (जीवन दर्शन एवं प्रेरणा) - Zen Lotus on Rippling Water & Dawn Sun
    case 'theme-life-serene':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity: effectiveOpacity }}
        >
          {/* Zen Serene Aura */}
          <circle cx="80" cy="80" r="70" fill="url(#life-aura)" opacity="0.45" />

          {/* Rising Dawn Sun Disc */}
          <circle cx="80" cy="56" r="26" fill="url(#life-sun)" />

          {/* Gentle Rippling Water Concentric Waves */}
          <ellipse cx="80" cy="112" rx="55" ry="14" stroke="#64748b" strokeWidth="1.5" strokeDasharray="6 4" fill="none" />
          <ellipse cx="80" cy="116" rx="42" ry="10" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 4" fill="none" />
          <ellipse cx="80" cy="120" rx="28" ry="7" stroke="#cbd5e1" strokeWidth="1" fill="none" />

          {/* Sacred Zen Lotus Blossom (शांत कमल) */}
          <g transform="translate(48, 76)">
            {/* Center Petal */}
            <path d="M32 0 C24 -18 40 -18 32 0 Z" fill="#ffffff" stroke="#e11d48" strokeWidth="1.5" />
            {/* Left Petals */}
            <path d="M30 4 C14 -8 22 -16 28 0 Z" fill="#fecdd3" stroke="#e11d48" strokeWidth="1.2" />
            <path d="M28 8 C4 -2 10 -8 24 6 Z" fill="#fda4af" stroke="#e11d48" strokeWidth="1" />
            {/* Right Petals */}
            <path d="M34 4 C50 -8 42 -16 36 0 Z" fill="#fecdd3" stroke="#e11d48" strokeWidth="1.2" />
            <path d="M36 8 C60 -2 54 -8 40 6 Z" fill="#fda4af" stroke="#e11d48" strokeWidth="1" />
            {/* Lotus Base */}
            <ellipse cx="32" cy="18" rx="16" ry="5" fill="#334155" />
          </g>

          <defs>
            <radialGradient id="life-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f1f5f9" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#e2e8f0" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="life-sun" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#fecdd3" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>
        </svg>
      );

    // 8. PATRIOTISM & YOUTH (राष्ट्रसेवा एवं युवा शक्ति) - Indian Tiranga Waves, Ashoka Chakra & Torch
    case 'theme-patriot-tricolor':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity: effectiveOpacity }}
        >
          {/* Patriotic Halo */}
          <circle cx="80" cy="80" r="72" fill="url(#patriot-halo)" opacity="0.45" />

          {/* Saffron & Green Swirling Waves */}
          <path
            d="M20 65 C45 45 75 80 110 55 C125 45 138 52 145 58"
            stroke="#f97316"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M20 95 C45 75 75 110 110 85 C125 75 138 82 145 88"
            stroke="#16a34a"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Central Ashoka Chakra Medallion */}
          <circle cx="80" cy="75" r="22" fill="#ffffff" stroke="#1e3a8a" strokeWidth="2.5" />
          <circle cx="80" cy="75" r="4" fill="#1e3a8a" />
          {Array.from({ length: 24 }).map((_, i) => {
            const rad = ((i * 15) * Math.PI) / 180;
            return (
              <line
                key={i}
                x1="80"
                y1="75"
                x2={80 + 20 * Math.cos(rad)}
                y2={75 + 20 * Math.sin(rad)}
                stroke="#1e3a8a"
                strokeWidth="1.2"
              />
            );
          })}

          {/* Flaming Torch of Youth (मशाल) */}
          <g transform="translate(68, 100)">
            {/* Torch Handle */}
            <path d="M12 28 L10 44 L14 44 Z" fill="#92400e" stroke="#451a03" strokeWidth="1" />
            {/* Torch Head */}
            <polygon points="6,28 18,28 15,18 9,18" fill="#d97706" stroke="#451a03" strokeWidth="1" />
            {/* Fire Flame */}
            <path d="M12 4 C15 10 18 14 12 18 C6 14 9 10 12 4 Z" fill="#ef4444" />
            <circle cx="12" cy="14" r="2" fill="#fef08a" />
          </g>

          <defs>
            <radialGradient id="patriot-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#fed7aa" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      );

    // 9 & 10. ROYAL SIGNATURE & DARK MAROON (जीवन ज्योति शाही धवल व महरून) - Imperial Crown & JJF Flame
    case 'theme-royal-maroon':
    case 'theme-dark-maroon':
    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ opacity: effectiveOpacity }}
        >
          {/* Royal Imperial Halo */}
          <circle cx="80" cy="80" r="70" fill="url(#royal-post-aura)" opacity="0.45" />

          {/* Baroque Golden Laurel Circle */}
          <circle cx="80" cy="80" r="50" stroke="#d97706" strokeWidth="2.5" strokeDasharray="6 6" fill="none" />

          {/* Imperial Golden Crown (शाही मुकुट) */}
          <g transform="translate(52, 42)">
            {/* Crown Base */}
            <rect x="6" y="24" width="44" height="6" rx="2" fill="#d97706" stroke="#78350f" strokeWidth="1.2" />
            <circle cx="16" cy="27" r="1.5" fill="#ffffff" />
            <circle cx="28" cy="27" r="1.5" fill="#dc2626" />
            <circle cx="40" cy="27" r="1.5" fill="#ffffff" />
            {/* Crown Peaks (5 points) */}
            <path
              d="M6 24 L10 10 L20 18 L28 6 L36 18 L46 10 L50 24 Z"
              fill="url(#crown-gold)"
              stroke="#78350f"
              strokeWidth="1.5"
            />
            {/* Jewels on peaks */}
            <circle cx="10" cy="10" r="2" fill="#fef08a" />
            <circle cx="28" cy="6" r="3" fill="#dc2626" />
            <circle cx="46" cy="10" r="2" fill="#fef08a" />
          </g>

          {/* Central JJF Divine Flame Medallion (जीवन ज्योति दीप) */}
          <g transform="translate(64, 82)">
            {/* Diya Base */}
            <path d="M4 18 C4 26 28 26 28 18 Z" fill="#d97706" stroke="#8B0000" strokeWidth="1.5" />
            {/* Flame */}
            <path d="M16 2 C20 8 22 12 16 17 C10 12 12 8 16 2 Z" fill="url(#jjf-flame)" />
            <circle cx="16" cy="12" r="2" fill="#ffffff" />
          </g>

          <defs>
            <radialGradient id="royal-post-aura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#d97706" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8B0000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="crown-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#fef08a" />
              <stop offset="80%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="jjf-flame" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#fef08a" />
              <stop offset="80%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
};

/**
 * Draws the Theme-Related Picture directly onto HTML5 Canvas at (cx, cy) with diameter size
 * Used during canvas export so saved images & WhatsApp shares have the authentic theme picture!
 */
export function drawThemePictureOnCanvas(
  ctx: CanvasRenderingContext2D,
  themeId: string,
  cx: number,
  cy: number,
  size: number,
  opacity = 1
) {
  ctx.save();
  ctx.globalAlpha = opacity;
  const rad = size / 2;

  // 1. Draw glowing theme backdrop circle
  const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, rad);
  glow.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  glow.addColorStop(0.7, 'rgba(255, 255, 255, 0.15)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, rad, 0, Math.PI * 2);
  ctx.fill();

  // 2. Draw theme-specific artwork on Canvas
  if (themeId === 'theme-edu-wisdom') {
    // Open Book of Knowledge + Wisdom Lamp
    const bW = rad * 0.9;
    const bH = rad * 0.55;
    // Pages
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = Math.max(1.5, size * 0.018);
    ctx.beginPath();
    ctx.moveTo(cx, cy + bH * 0.35);
    ctx.quadraticCurveTo(cx - bW * 0.5, cy + bH * 0.45, cx - bW, cy + bH * 0.2);
    ctx.lineTo(cx - bW, cy - bH * 0.4);
    ctx.quadraticCurveTo(cx - bW * 0.5, cy - bH * 0.2, cx, cy - bH * 0.35);
    ctx.quadraticCurveTo(cx + bW * 0.5, cy - bH * 0.2, cx + bW, cy - bH * 0.4);
    ctx.lineTo(cx + bW, cy + bH * 0.2);
    ctx.quadraticCurveTo(cx + bW * 0.5, cy + bH * 0.45, cx, cy + bH * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Center crease
    ctx.beginPath();
    ctx.moveTo(cx, cy - bH * 0.35);
    ctx.lineTo(cx, cy + bH * 0.35);
    ctx.stroke();

    // Lamp above book
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(cx, cy - bH * 0.55, rad * 0.18, 0, Math.PI * 2);
    ctx.fill();
    // Flame
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(cx, cy - bH * 0.95);
    ctx.quadraticCurveTo(cx + rad * 0.12, cy - bH * 0.7, cx, cy - bH * 0.55);
    ctx.quadraticCurveTo(cx - rad * 0.12, cy - bH * 0.7, cx, cy - bH * 0.95);
    ctx.fill();
  } else if (themeId === 'theme-career-gold') {
    // Mountain Peaks + Rising Sun + Laurel
    // Sun
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(cx, cy - rad * 0.25, rad * 0.35, 0, Math.PI * 2);
    ctx.fill();
    // Mountain
    ctx.fillStyle = '#059669';
    ctx.strokeStyle = '#064e3b';
    ctx.lineWidth = Math.max(1.5, size * 0.018);
    ctx.beginPath();
    ctx.moveTo(cx, cy - rad * 0.35);
    ctx.lineTo(cx + rad * 0.65, cy + rad * 0.45);
    ctx.lineTo(cx - rad * 0.65, cy + rad * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Snow cap
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(cx, cy - rad * 0.35);
    ctx.lineTo(cx + rad * 0.22, cy - rad * 0.05);
    ctx.lineTo(cx - rad * 0.22, cy - rad * 0.05);
    ctx.closePath();
    ctx.fill();
  } else if (themeId === 'theme-devo-saffron') {
    // Sacred Om (ॐ) in Gold
    ctx.font = `bold ${Math.round(size * 0.62)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ea580c';
    ctx.fillText('ॐ', cx, cy - 2);
    // Lotus base
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = Math.max(1.5, size * 0.016);
    ctx.beginPath();
    ctx.arc(cx, cy + rad * 0.35, rad * 0.38, 0.2 * Math.PI, 0.8 * Math.PI, false);
    ctx.stroke();
  } else if (themeId === 'theme-humanity-emerald') {
    // Heart + Sprouting Leaves
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    const hx = cx;
    const hy = cy - rad * 0.1;
    const hw = rad * 0.45;
    ctx.moveTo(hx, hy + hw * 0.7);
    ctx.bezierCurveTo(hx - hw * 1.2, hy - hw * 0.2, hx - hw * 1.2, hy - hw * 0.9, hx - hw * 0.5, hy - hw * 0.9);
    ctx.bezierCurveTo(hx, hy - hw * 0.9, hx, hy - hw * 0.4, hx, hy - hw * 0.2);
    ctx.bezierCurveTo(hx, hy - hw * 0.4, hx, hy - hw * 0.9, hx + hw * 0.5, hy - hw * 0.9);
    ctx.bezierCurveTo(hx + hw * 1.2, hy - hw * 0.9, hx + hw * 1.2, hy - hw * 0.2, hx, hy + hw * 0.7);
    ctx.fill();
    // Leaves
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(cx - 5, cy - rad * 0.38, rad * 0.14, 0, Math.PI * 2);
    ctx.arc(cx + 5, cy - rad * 0.38, rad * 0.14, 0, Math.PI * 2);
    ctx.fill();
  } else if (themeId === 'theme-patriot-tricolor') {
    // Tiranga Swirls + Ashoka Chakra
    // Saffron arc
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = Math.max(3, size * 0.04);
    ctx.beginPath();
    ctx.arc(cx, cy, rad * 0.65, 1.1 * Math.PI, 1.7 * Math.PI);
    ctx.stroke();
    // Green arc
    ctx.strokeStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(cx, cy, rad * 0.65, 0.1 * Math.PI, 0.7 * Math.PI);
    ctx.stroke();
    // Ashoka Chakra center
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = Math.max(1.8, size * 0.022);
    ctx.beginPath();
    ctx.arc(cx, cy, rad * 0.28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
    // 8 spokes
    for (let i = 0; i < 8; i++) {
      const ang = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + rad * 0.28 * Math.cos(ang), cy + rad * 0.28 * Math.sin(ang));
      ctx.stroke();
    }
  } else {
    // Royal Crown / JJF Gold Signature
    ctx.fillStyle = '#d97706';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = Math.max(1.5, size * 0.016);
    // Crown base
    ctx.beginPath();
    ctx.rect(cx - rad * 0.45, cy + rad * 0.1, rad * 0.9, rad * 0.15);
    ctx.fill();
    ctx.stroke();
    // Crown peaks
    ctx.beginPath();
    ctx.moveTo(cx - rad * 0.45, cy + rad * 0.1);
    ctx.lineTo(cx - rad * 0.45, cy - rad * 0.25);
    ctx.lineTo(cx - rad * 0.22, cy - rad * 0.05);
    ctx.lineTo(cx, cy - rad * 0.38);
    ctx.lineTo(cx + rad * 0.22, cy - rad * 0.05);
    ctx.lineTo(cx + rad * 0.45, cy - rad * 0.25);
    ctx.lineTo(cx + rad * 0.45, cy + rad * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Jewels
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(cx, cy - rad * 0.38, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
