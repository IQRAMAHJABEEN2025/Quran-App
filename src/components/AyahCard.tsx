import React from 'react';
import type { MergedAyah } from '../types';

interface AyahCardProps {
  ayah: MergedAyah;
  index: number;
  showEnglish: boolean;
  showUrdu: boolean;
  arabicLineHeight: number;
  urduLineHeight: number;
}

export const AyahCard: React.FC<AyahCardProps> = ({ 
  ayah, 
  index, 
  showEnglish, 
  showUrdu,
  arabicLineHeight,
  urduLineHeight
}) => {
  // Calculate animation delay based on index for staggered fade-in
  const animationDelay = `${(index % 10) * 0.05}s`;

  return (
    <div 
      className="w-full mb-6 relative animate-fade-in"
      style={{ animationDelay }}
    >
      <div className="
        relative overflow-hidden rounded-2xl 
        bg-glass-light dark:bg-slate-900/60
        backdrop-blur-xl border border-white/40 dark:border-white/5
        shadow-sm hover:shadow-md dark:shadow-none
        transition-all duration-500 ease-out
        p-6 sm:p-8 flex flex-col gap-6
      ">
        {/* Decorative Elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-start justify-between gap-4">
           {/* Number Bubble */}
           <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-500/10 text-sm font-bold text-emerald-700 dark:text-emerald-400">
             {ayah.numberInSurah}
           </div>
        </div>

        {/* Arabic Text */}
        <div className="w-full py-2">
          <p 
            className="font-arabic font-bold text-3xl sm:text-5xl text-right text-slate-800 dark:text-slate-200 drop-shadow-sm" 
            dir="rtl"
            style={{ lineHeight: arabicLineHeight }}
          >
            {ayah.textArabic}
          </p>
        </div>

        {/* Separator (Only if translations are shown) */}
        {(showEnglish || showUrdu) && (
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
        )}

        {/* English Translation */}
        {showEnglish && (
          <div className="flex flex-col gap-2 animate-fade-in">
            <p className="font-sans text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {ayah.textEnglish}
            </p>
          </div>
        )}

        {/* Urdu Translation */}
        {showUrdu && (
          <div className="flex flex-col gap-2 animate-fade-in">
            <p 
              className="font-urdu text-xl sm:text-2xl text-slate-600 dark:text-slate-300 text-right mt-2" 
              dir="rtl"
              style={{ lineHeight: urduLineHeight }}
            >
              {ayah.textUrdu}
            </p>
          </div>
        )}
        
      </div>
    </div>
  );
};