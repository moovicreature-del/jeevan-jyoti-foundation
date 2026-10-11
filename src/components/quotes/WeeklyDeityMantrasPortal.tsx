// ============================================================================
// JEEVAN JYOTI FOUNDATION - WEEKLY DEITIES & POWERFUL TROUBLE-RELIEVING MANTRAS PORTAL
// जीवन ज्योति फाउंडेशन - सप्ताह के प्रत्येक दिन के पूजनीय देवी-देवता एवं अति शक्तिशाली कष्ट निवारण मंत्र
// ============================================================================

import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Copy,
  Check,
  Share2,
  Calendar,
  Flame,
  ShieldCheck,
  Heart,
  Eye,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Sun,
  Moon,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  WEEKLY_DEITY_MANTRAS,
  DAYS_OF_WEEK_META,
  DEITY_FILTER_LIST,
  DayOfWeekKey,
  DeityKey,
  WeeklyDeityMantra,
  getCurrentDayOfWeekKey
} from '../../data/weeklyDeityMantrasData';

// Dedicated Official WhatsApp Icon SVG
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 7.44C8.95 7.44 8.68 7.5 8.46 7.74C8.24 7.97 7.62 8.56 7.62 9.75C7.62 10.95 8.5 12.1 8.62 12.26C8.75 12.43 10.32 14.86 12.74 15.9C13.32 16.15 13.77 16.3 14.12 16.41C14.7 16.6 15.22 16.57 15.64 16.51C16.1 16.44 17.07 15.92 17.27 15.34C17.47 14.77 17.47 14.28 17.41 14.18C17.35 14.07 17.19 14.01 16.95 13.89C16.71 13.77 15.53 13.19 15.31 13.11C15.09 13.03 14.93 12.99 14.77 13.23C14.61 13.47 14.15 14.01 14.01 14.17C13.87 14.33 13.73 14.35 13.49 14.23C13.25 14.11 12.48 13.86 11.57 13.05C10.86 12.42 10.38 11.64 10.24 11.4C10.1 11.16 10.23 11.03 10.35 10.91C10.46 10.8 10.6 10.62 10.72 10.48C10.84 10.34 10.88 10.24 10.96 10.08C11.04 9.92 11 9.78 10.94 9.66C10.88 9.54 10.42 8.41 10.22 7.94C10.03 7.48 9.84 7.54 9.69 7.53C9.55 7.52 9.39 7.52 9.23 7.52L9.11 7.44Z" />
  </svg>
);

interface Props {
  onSelectMantraForPoster: (mantra: WeeklyDeityMantra) => void;
  onSwitchToQuotes: () => void;
}

export const WeeklyDeityMantrasPortal: React.FC<Props> = ({
  onSelectMantraForPoster,
  onSwitchToQuotes
}) => {
  const currentDayKey = getCurrentDayOfWeekKey();
  const [selectedDay, setSelectedDay] = useState<DayOfWeekKey>(currentDayKey);
  const [selectedDeity, setSelectedDeity] = useState<DeityKey | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedMantraId, setCopiedMantraId] = useState<string | null>(null);

  const activeDayMeta = DAYS_OF_WEEK_META.find((d) => d.key === selectedDay) || DAYS_OF_WEEK_META[0];
  const todayMeta = DAYS_OF_WEEK_META.find((d) => d.key === currentDayKey) || DAYS_OF_WEEK_META[0];

  // Filter mantras
  const filteredMantras = WEEKLY_DEITY_MANTRAS.filter((m) => {
    // If deity filter is selected, search across all days or selected day
    const matchesDeity = selectedDeity === 'all' || m.deityKey === selectedDeity;
    const matchesDay = selectedDeity !== 'all' ? true : m.dayKey === selectedDay;

    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      m.deityNameHi.toLowerCase().includes(query) ||
      m.deityTitleHi.toLowerCase().includes(query) ||
      m.mantraTitle.toLowerCase().includes(query) ||
      m.sanskritMantra.toLowerCase().includes(query) ||
      m.meaningHi.toLowerCase().includes(query) ||
      m.benefitsHi.toLowerCase().includes(query) ||
      (m.auspiciousOfferingsHi && m.auspiciousOfferingsHi.toLowerCase().includes(query)) ||
      m.tags.some((t) => t.toLowerCase().includes(query));

    return matchesDay && matchesDeity && matchesQuery;
  });

  const handleCopy = (m: WeeklyDeityMantra) => {
    const text = `🕉️ ${m.deityNameHi} — ${m.mantraTitle} 🕉️\n\n${m.sanskritMantra}\n\n✨ बीज मंत्र: ${m.beejaMantra || ''}\n\n📖 सरल अर्थ: ${m.meaningHi}\n\n🌟 कष्ट निवारण फल: ${m.benefitsHi}\n\n🙏 पूज्य देव: ${m.deityNameHi} (${m.dayNameHi})\n\nजीवन ज्योति फाउंडेशन ग़ाज़ीपुर • दैनिक दिव्य कृपा दर्शन\n🌐 ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopiedMantraId(m.id);
    toast.success(`${m.deityNameHi} का कष्ट निवारण मंत्र कॉपी हो गया!`, { icon: '🕉️' });
    setTimeout(() => setCopiedMantraId(null), 2500);
  };

  const handleWhatsAppShare = (m: WeeklyDeityMantra) => {
    const text = `*🕉️ ${m.deityNameHi} — ${m.mantraTitle} 🕉️*\n\n${m.sanskritMantra}\n\n*✨ अर्थ:* ${m.meaningHi}\n\n*🌟 कष्ट निवारण फल:* ${m.benefitsHi}\n\nशुभ ${m.dayNameHi} की मंगलमय शुभकामनाएं 🙏\n_जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर (उ.प्र.)_\n🌐 ${window.location.origin}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* 1. HERO DIVINE BANNER WITH TODAY'S DAY CALLOUT */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 p-5 sm:p-7 shadow-2xl bg-gradient-to-r from-[#2c0b0e] via-[#450a0a] to-[#1c1917]">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>सप्ताह के 7 दिन • 12 पूज्य देवी-देवता • सिद्ध कष्ट निवारण महामंत्र</span>
            </div>

            {/* Today's Live Day Indicator */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs font-black shadow-md border border-amber-300/60">
              <Calendar className="w-3.5 h-3.5" />
              <span>आज: {todayMeta.nameHi} ({todayMeta.icon})</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                {todayMeta.rulingPlanet.split(' ')[0]}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-200 font-serif tracking-wide flex items-center gap-2.5">
              <span>🕉️</span>
              <span>साप्ताहिक देवी-देवता एवं अति शक्तिशाली कष्ट निवारण मंत्र दर्शन</span>
            </h3>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed max-w-4xl">
              भगवान शंकर, माता पार्वती, संकटमोचन हनुमान जी, विघ्नहर्ता गणेश जी, शक्ति स्वरूपा नवदुर्गा, जगत्पालक श्री हरि विष्णु, वासुदेव श्रीकृष्ण, माँ महालक्ष्मी, माँ सरस्वती, न्यायप्रिय शनि देव, भगवान सूर्य देव एवं वेदमाता गायत्री के समस्त संकट, रोग, भय, ग्रह दोष व दारिद्र्य नाशक सिद्ध मंत्र।
            </p>
          </div>

          {/* Today's Special Blessing Notice */}
          <div className="bg-amber-950/60 border border-amber-400/30 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl shrink-0">{todayMeta.icon}</span>
              <div>
                <span className="font-black text-amber-300">
                  आज का विशेष पूजन: {todayMeta.rulingDeity}
                </span>
                <p className="text-slate-300 text-[11px] mt-0.5">{todayMeta.specialTagline}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedDay(currentDayKey);
                setSelectedDeity('all');
              }}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 rounded-xl text-xs font-black shadow transition shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <span>आज के विशेष मंत्र देखें</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. DAY OF THE WEEK TABS (सोमवार से रविवार) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-bold flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>वार / दिन चुनें (Select Day of the Week):</span>
          </span>
          <span className="text-[11px] text-amber-400 font-mono">
            {activeDayMeta.rulingDeity}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {DAYS_OF_WEEK_META.map((day) => {
            const isSelected = selectedDay === day.key && selectedDeity === 'all';
            const isToday = day.key === currentDayKey;
            const count = WEEKLY_DEITY_MANTRAS.filter((m) => m.dayKey === day.key).length;

            return (
              <button
                key={day.key}
                type="button"
                onClick={() => {
                  setSelectedDay(day.key);
                  setSelectedDeity('all');
                }}
                className={`p-3 rounded-2xl text-left transition-all border relative flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500 to-yellow-500 text-slate-950 border-yellow-200 shadow-lg shadow-amber-500/25 scale-[1.02]'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Is Today indicator */}
                {isToday && (
                  <span className={`absolute top-2 right-2 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-slate-950 text-amber-300' : 'bg-red-600 text-white animate-pulse'
                  }`}>
                    आज
                  </span>
                )}

                <div>
                  <div className="text-xl mb-1">{day.icon}</div>
                  <div className="font-black text-sm">{day.nameHi}</div>
                  <div className={`text-[10px] font-mono leading-tight truncate ${
                    isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'
                  }`}>
                    {day.nameEn}
                  </div>
                </div>

                <div className={`mt-2 text-[10px] flex items-center justify-between pt-1.5 border-t ${
                  isSelected ? 'border-slate-900/20 text-slate-950 font-bold' : 'border-slate-800 text-slate-400'
                }`}>
                  <span className="truncate">{day.rulingPlanet.split(' ')[0]}</span>
                  <span className="font-mono bg-black/20 px-1 rounded">{count} मंत्र</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. DEITY FILTER PILLS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <span>पूज्य देवी-देवता अनुसार छांटें (Filter by Deity):</span>
          </span>
          {selectedDeity !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedDeity('all')}
              className="text-[11px] text-amber-400 hover:underline cursor-pointer"
            >
              फ़िल्टर हटाएं (वार अनुसार देखें)
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
          {DEITY_FILTER_LIST.map((d) => {
            const isSelected = selectedDeity === d.key;
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => setSelectedDeity(d.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white border-amber-300 shadow-md scale-105'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{d.icon}</span>
                <span>{d.nameHi}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. SEARCH & STATS BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="मंत्र, देवता, या कष्ट खोजें (उदा. रोग, भय, साढ़ेसाती, दरिद्रता, विद्या, कार्यसिद्धि)..."
            className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-xs text-amber-400 font-bold">
            {filteredMantras.length} सिद्ध मंत्र उपलब्ध
          </span>
          <button
            type="button"
            onClick={onSwitchToQuotes}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
          >
            <span>सुविचार स्टूडियो में जाएं</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5. MANTRAS CARDS GRID */}
      {filteredMantras.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
          <div className="text-4xl">🕉️</div>
          <p className="text-slate-300 font-bold text-sm">कोई मंत्र मेल नहीं खाया</p>
          <p className="text-slate-500 text-xs">कृपया अन्य खोज शब्द या देवी-देवता का चयन करें।</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedDeity('all');
            }}
            className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-black cursor-pointer shadow"
          >
            सभी मंत्र पुनः देखें
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredMantras.map((m) => {
            const isCopied = copiedMantraId === m.id;

            return (
              <div
                key={m.id}
                className="bg-slate-900/90 border-2 border-amber-500/30 hover:border-amber-400/80 rounded-3xl p-5 sm:p-6 shadow-xl transition-all hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between space-y-4 relative overflow-hidden group"
              >
                {/* Decorative Top Accent Bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"
                ></div>

                {/* Header: Deity & Day */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/50 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                        {m.deityIcon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base sm:text-lg font-black text-amber-200 font-serif">
                            {m.deityNameHi}
                          </h4>
                        </div>
                        <p className="text-[11px] text-amber-400/90 font-bold">
                          {m.deityTitleHi}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-950 text-amber-300 border border-amber-400/40">
                        {m.dayNameHi}
                      </span>
                      {m.dayKey === currentDayKey && (
                        <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                          <span>आज का पावन वार</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mantra Title */}
                  <div className="text-xs sm:text-sm font-black text-slate-100 flex items-center gap-1.5 pt-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{m.mantraTitle}</span>
                  </div>
                </div>

                {/* Sacred Sanskrit Mantra Text Box */}
                <div className="bg-gradient-to-b from-slate-950 to-slate-900 border border-amber-500/30 rounded-2xl p-4 sm:p-5 relative shadow-inner">
                  <div className="absolute top-2 right-2 text-amber-500/20 text-3xl font-serif pointer-events-none">
                    ॐ
                  </div>
                  <pre className="font-serif text-sm sm:text-base text-amber-300 font-bold leading-relaxed whitespace-pre-wrap select-all tracking-wide">
                    {m.sanskritMantra}
                  </pre>

                  {m.beejaMantra && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center gap-2 text-xs text-orange-300">
                      <span className="font-black text-amber-400 text-[11px] uppercase tracking-wider bg-orange-950/60 px-2 py-0.5 rounded border border-orange-500/30">
                        बीज मंत्र:
                      </span>
                      <span className="font-bold">{m.beejaMantra}</span>
                    </div>
                  )}
                </div>

                {/* Meaning & Benefits */}
                <div className="space-y-2 text-xs">
                  <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                    <span className="font-bold text-amber-400 flex items-center gap-1 mb-1 text-[11px]">
                      <Info className="w-3 h-3 text-amber-400" />
                      <span>मंत्र का सरल अर्थ:</span>
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {m.meaningHi}
                    </p>
                  </div>

                  <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/20">
                    <span className="font-bold text-emerald-400 flex items-center gap-1 mb-1 text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>अति शक्तिशाली कष्ट निवारण फल व सकारात्मक प्रभाव:</span>
                    </span>
                    <p className="text-emerald-200/90 text-[11px] leading-relaxed font-semibold">
                      {m.benefitsHi}
                    </p>
                  </div>

                  {m.auspiciousOfferingsHi && (
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 px-1">
                      <span className="text-amber-400 font-bold shrink-0">पूजा सामग्री / भोग:</span>
                      <span className="truncate">{m.auspiciousOfferingsHi}</span>
                    </div>
                  )}
                </div>

                {/* Actions: Create Poster (Primary), Copy, WhatsApp */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <button
                    type="button"
                    onClick={() => onSelectMantraForPoster(m)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-xl font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-95 border border-yellow-300"
                  >
                    <span>🎨</span>
                    <span>इस मंत्र का फोटो पोस्टर बनाएं (Create Photo Poster)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(m)}
                      className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-700"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'कॉपी हुआ' : 'मंत्र कॉपी'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleWhatsAppShare(m)}
                      className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs border border-emerald-400/40"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>व्हाट्सएप शेयर</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. BOTTOM PROMOTION BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl shrink-0">
            🎨
          </div>
          <div>
            <div className="font-bold text-amber-300">
              अपनी फोटो व नाम के साथ बनाएं दैनिक भक्ति पोस्टर
            </div>
            <p className="text-slate-300 text-[11px]">
              ऊपर दिए गए किसी भी मंत्र के 'पोस्टर बनाएं' बटन पर क्लिक करके अपनी फोटो, नाम व शहर जोड़ें और तुरंत HD पोस्टर डाउनलोड करें!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSwitchToQuotes}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow transition shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <span>सुविचार जनरेटर खोलें</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default WeeklyDeityMantrasPortal;
