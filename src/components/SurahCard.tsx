import React from 'react';
import type { SurahMeta } from '../types';

interface SurahCardProps {
  surah: SurahMeta;
  onClick: () => void;
  index: number;
}

export const SurahCard: React.FC<SurahCardProps> = ({ surah, onClick, index }) => {
  const animationDelay = `${(index % 20) * 0.05}s`;

  // Pinterest-inspired palette
  // Dark mode strategy: Unified dark background (slate-800) with subtle colored borders/accents
  // This prevents the "rainbow" look from being too harsh in dark mode.
  const themes = [
    { // Rose
      bg: 'bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-slate-800/60 dark:to-slate-900/60',
      border: 'border-rose-200/60 dark:border-rose-500/20',
      iconBg: 'bg-rose-100 dark:bg-rose-900/20',
      iconText: 'text-rose-600 dark:text-rose-300',
      accentText: 'text-rose-600 dark:text-rose-300',
      hoverShadow: 'hover:shadow-rose-200/50 dark:hover:shadow-none dark:hover:bg-slate-800/80',
    },
    { // Sky
      bg: 'bg-gradient-to-br from-sky-50 to-sky-100/50 dark:from-slate-800/60 dark:to-slate-900/60',
      border: 'border-sky-200/60 dark:border-sky-500/20',
      iconBg: 'bg-sky-100 dark:bg-sky-900/20',
      iconText: 'text-sky-600 dark:text-sky-300',
      accentText: 'text-sky-600 dark:text-sky-300',
      hoverShadow: 'hover:shadow-sky-200/50 dark:hover:shadow-none dark:hover:bg-slate-800/80',
    },
    { // Emerald
      bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-slate-800/60 dark:to-slate-900/60',
      border: 'border-emerald-200/60 dark:border-emerald-500/20',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/20',
      iconText: 'text-emerald-600 dark:text-emerald-300',
      accentText: 'text-emerald-600 dark:text-emerald-300',
      hoverShadow: 'hover:shadow-emerald-200/50 dark:hover:shadow-none dark:hover:bg-slate-800/80',
    },
    { // Violet
      bg: 'bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-slate-800/60 dark:to-slate-900/60',
      border: 'border-violet-200/60 dark:border-violet-500/20',
      iconBg: 'bg-violet-100 dark:bg-violet-900/20',
      iconText: 'text-violet-600 dark:text-violet-300',
      accentText: 'text-violet-600 dark:text-violet-300',
      hoverShadow: 'hover:shadow-violet-200/50 dark:hover:shadow-none dark:hover:bg-slate-800/80',
    },
    { // Amber
      bg: 'bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-slate-800/60 dark:to-slate-900/60',
      border: 'border-amber-200/60 dark:border-amber-500/20',
      iconBg: 'bg-amber-100 dark:bg-amber-900/20',
      iconText: 'text-amber-600 dark:text-amber-300',
      accentText: 'text-amber-600 dark:text-amber-300',
      hoverShadow: 'hover:shadow-amber-200/50 dark:hover:shadow-none dark:hover:bg-slate-800/80',
    },
    { // Teal
      bg: 'bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-slate-800/60 dark:to-slate-900/60',
      border: 'border-teal-200/60 dark:border-teal-500/20',
      iconBg: 'bg-teal-100 dark:bg-teal-900/20',
      iconText: 'text-teal-600 dark:text-teal-300',
      accentText: 'text-teal-600 dark:text-teal-300',
      hoverShadow: 'hover:shadow-teal-200/50 dark:hover:shadow-none dark:hover:bg-slate-800/80',
    }
  ];

  const theme = themes[index % themes.length];

  return (
    <button
      onClick={onClick}
      className="group relative w-full text-left animate-fade-in"
      style={{ animationDelay }}
    >
      <div className={`
        relative overflow-hidden rounded-3xl 
        ${theme.bg}
        backdrop-blur-md border ${theme.border}
        shadow-sm hover:shadow-xl ${theme.hoverShadow}
        transition-all duration-500 ease-out
        hover:-translate-y-2
        p-6 flex flex-col gap-4 h-full
      `}>
        
        {/* Top Row: Number and Chevron */}
        <div className="flex items-center justify-between w-full">
           <div className={`w-12 h-12 rounded-2xl ${theme.iconBg} flex items-center justify-center backdrop-blur-sm shadow-inner transition-colors duration-500`}>
              <span className={`font-bold text-lg ${theme.iconText}`}>
                {surah.number}
              </span>
           </div>
           
           <div className="w-8 h-8 rounded-full bg-white/50 dark:bg-slate-700/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={theme.accentText}><path d="m9 18 6-6-6-6"/></svg>
           </div>
        </div>

        {/* Middle: Names */}
        <div className="mt-2">
           <div className="flex items-baseline justify-between mb-1">
             <h3 className="font-sans font-bold text-xl text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
               {surah.englishName}
             </h3>
           </div>
           <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3">
             {surah.englishNameTranslation}
           </p>
           <p className={`font-arabic text-2xl ${theme.accentText} opacity-90 text-right`} dir="rtl">
             {surah.name}
           </p>
        </div>

        {/* Bottom: Stats Pills */}
        <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-black/5 dark:border-white/5">
           <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/60 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 backdrop-blur-sm">
             {surah.numberOfAyahs} Ayahs
           </span>
           <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/60 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 backdrop-blur-sm">
             {surah.revelationType}
           </span>
        </div>

      </div>
    </button>
  );
};