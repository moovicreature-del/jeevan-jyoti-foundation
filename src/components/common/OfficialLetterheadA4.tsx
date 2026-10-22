// ============================================================================
// JEEVAN JYOTI FOUNDATION - AUTHENTIC A4 LETTERHEAD COMPONENT
// जीवन ज्योति फाउंडेशन - आधिकारिक लेटरहेड (A4 300 DPI परफेक्ट अलाइनमेंट)
// Authentic Official Graphic Letterhead from Attached PDF (210mm x 297mm)
// ============================================================================

import React, { useState } from 'react';
import { FOUNDATION_INFO } from '../../data/foundationData';

export interface OfficialLetterheadA4Props {
  id?: string;
  refNo: string;
  dateStr: string;
  subject: string;
  children: React.ReactNode;
  className?: string;
  hideLetterheadBackground?: boolean; // For printing on pre-printed office stationery paper
  letterheadImageUrl?: string;
}

export const OfficialLetterheadA4: React.FC<OfficialLetterheadA4Props> = ({
  id = 'official-letterhead-a4',
  refNo,
  dateStr,
  subject,
  children,
  className = '',
  hideLetterheadBackground = false,
  letterheadImageUrl = '/assets/aistudio/letterhead.png'
}) => {
  const [imgSrc, setImgSrc] = useState(letterheadImageUrl);

  return (
    <div
      id={id}
      className={`official-letterhead-a4 relative bg-white text-slate-900 box-border mx-auto select-none print:m-0 print:shadow-none ${className}`}
      style={{
        width: '794px',
        height: '1123px',
        minHeight: '1123px',
        maxHeight: '1123px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Segoe UI', Roboto, 'Noto Sans Devanagari', Arial, sans-serif"
      }}
    >
      {/* ===================================================================== */}
      {/* 1. AUTHENTIC HIGH-RES LETTERHEAD GRAPHIC BACKGROUND (FULL BLEED A4)   */}
      {/* ===================================================================== */}
      {!hideLetterheadBackground && (
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
          <img
            src={imgSrc}
            onError={() => {
              if (imgSrc !== '/letterhead.png') {
                setImgSrc('/letterhead.png');
              }
            }}
            alt="Jeevan Jyoti Foundation Official A4 Letterhead"
            className="w-full h-full object-fill block"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. STATIONERY PRINT WATERMARK (Subtle watermark if background hidden)  */}
      {/* ===================================================================== */}
      {hideLetterheadBackground && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-5">
          <img
            src="/official-seal.png"
            alt="Official Watermark Seal"
            className="w-[420px] h-[420px] object-contain"
            crossOrigin="anonymous"
          />
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. DYNAMIC REFERENCE NO, DATE & SUBJECT ROW                            */}
      {/* Clean solid white background overlay to completely prevent             */}
      {/* double-text ghosting over pre-printed scanned letterhead lines         */}
      {/* ===================================================================== */}
      <div
        className={`absolute left-[28px] right-[28px] top-[202px] z-10 flex flex-col justify-between py-1 px-2 rounded-xs ${
          hideLetterheadBackground ? 'bg-transparent' : 'bg-white shadow-[0_0_1px_rgba(0,0,0,0.05)]'
        }`}
        style={{ minHeight: '56px' }}
      >
        {/* Row 1: Ref No on left, Date on right */}
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-900 leading-tight">
          <div className="flex items-baseline gap-1.5 min-w-0 max-w-[60%]">
            <span className="shrink-0 text-slate-950 font-black tracking-tight">पत्रांक / Ref. No.:</span>
            <span className="font-mono font-black text-blue-950 truncate px-1 border-b border-dotted border-blue-900/70 pb-0.5 tracking-wide">
              {refNo}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 shrink-0">
            <span className="text-slate-950 font-black tracking-tight">दिनांक / Date:</span>
            <span className="font-bold text-slate-950 px-1 border-b border-dotted border-slate-700/70 pb-0.5">
              {dateStr}
            </span>
          </div>
        </div>

        {/* Row 2: Subject Line */}
        <div className="flex items-baseline gap-1.5 text-[11px] font-bold text-slate-900 pt-1 leading-tight">
          <span className="shrink-0 text-[#8B0000] font-black tracking-tight">विषय / Subject:</span>
          <span className="flex-1 font-bold text-slate-950 px-1 border-b border-solid border-slate-800/70 pb-0.5 truncate tracking-tight">
            {subject}
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. MAIN MATTER / CONTENT AREA (PERFECT PROFESSIONAL A4 ALIGNMENT)     */}
      {/* Starts right below the Subject line (top: 264px)                      */}
      {/* Ends right above the bottom footer (bottom: 146px)                    */}
      {/* Available vertical height = 713px                                     */}
      {/* ===================================================================== */}
      <div
        className="absolute left-[32px] right-[32px] top-[264px] bottom-[146px] z-10 flex flex-col justify-between overflow-hidden"
      >
        {children}
      </div>
    </div>
  );
};
