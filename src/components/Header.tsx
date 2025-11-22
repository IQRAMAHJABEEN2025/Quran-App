import React, { useState, useRef, useEffect } from 'react';
import type { SurahMeta, User } from '../types';

interface HeaderProps {
  view: 'home' | 'surah' | 'login' | 'signup' | 'profile';
  currentSurah: SurahMeta | null;
  onBack: () => void;
  onProfileClick: () => void;
  onLoginClick: () => void;
  currentUser: User | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  darkMode: boolean;
  toggleTheme: () => void;
  translationMode: 'english' | 'urdu' | 'both';
  setTranslationMode: (mode: 'english' | 'urdu' | 'both') => void;
  arabicLineHeight: number;
  setArabicLineHeight: (val: number) => void;
  urduLineHeight: number;
  setUrduLineHeight: (val: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  view,
  currentSurah,
  onBack,
  onProfileClick,
  onLoginClick,
  currentUser,
  searchQuery,
  onSearchChange,
  darkMode, 
  toggleTheme,
  translationMode,
  setTranslationMode,
  arabicLineHeight,
  setArabicLineHeight,
  urduLineHeight,
  setUrduLineHeight
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // If user is not logged in, show a very simplified header
  const isAuthView = !currentUser;

  return (
    <header className="sticky top-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-lg px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
        
        {/* Left Section: Logo or Back Button */}
        <div className="flex-1 flex items-center justify-start w-full md:w-auto">
           {view === 'surah' ? (
             <button 
               onClick={onBack}
               className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
             >
               <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800/50 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
               </div>
               <div className="text-left hidden sm:block">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Back</span>
                  <span className="font-bold text-sm whitespace-nowrap text-slate-900 dark:text-slate-200">{currentSurah?.englishName}</span>
               </div>
             </button>
           ) : (
             <div className="flex items-center gap-2 cursor-default select-none">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-xl font-arabic pt-1 shadow-lg shadow-emerald-500/20">
                   ن
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-100">Noor</span>
             </div>
           )}
        </div>

        {/* Center Section: Search Bar (Only if logged in) */}
        {!isAuthView && (
          <div className="flex-[2] flex justify-center w-full md:w-auto order-last md:order-none">
            {view === 'home' && (
              <div className="relative w-full max-w-md group">
                <input 
                  type="text" 
                  placeholder="Search Surah..." 
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 rounded-full pl-12 pr-6 py-3 text-sm outline-none transition-all duration-300 shadow-sm focus:shadow-md text-center placeholder:text-center text-slate-800 dark:text-slate-200 focus:placeholder-slate-400 placeholder-slate-500 dark:placeholder-slate-400"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Section: Profile & Settings */}
        <div className="flex-1 flex items-center justify-end gap-3 w-full md:w-auto relative" ref={settingsRef}>
          
          {/* Profile Button (Only if logged in) */}
          {currentUser && (
             <button 
                onClick={onProfileClick}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${view === 'profile' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
             >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 text-white flex items-center justify-center font-bold text-sm">
                   {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-medium text-sm text-slate-700 dark:text-slate-200">{currentUser.name.split(' ')[0]}</span>
             </button>
          )}

          {/* Settings Button - ONLY SHOW IF LOGGED IN OR TOGGLE THEME IF NOT */}
          {isAuthView ? (
             <button 
               onClick={toggleTheme}
               className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-all"
               title="Toggle Theme"
             >
               {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
               ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
               )}
             </button>
          ) : (
            <>
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-2.5 rounded-full transition-all duration-300 flex items-center gap-2 ${isSettingsOpen ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50'}`}
                title="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>

              {/* Settings Dropdown */}
              {isSettingsOpen && (
                <div className="absolute top-full right-0 mt-3 w-[calc(100vw-32px)] sm:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-2xl shadow-2xl p-5 animate-fade-in z-50">
                  
                  {/* 1. Appearance */}
                  <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Appearance</h3>
                    <button 
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        {darkMode ? (
                          <><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Dark Mode</>
                        ) : (
                          <><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg> Light Mode</>
                        )}
                      </span>
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${darkMode ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${darkMode ? 'left-6' : 'left-1'}`} />
                      </div>
                    </button>
                  </div>

                  {/* 2. Translations (Only relevant in Surah View) */}
                  {view === 'surah' && (
                    <div className="mb-6">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Translations</h3>
                      <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
                         {['english', 'urdu', 'both'].map((mode) => (
                           <button
                             key={mode}
                             onClick={() => setTranslationMode(mode as any)}
                             className={`py-2 rounded-lg text-xs font-bold capitalize transition-all ${translationMode === mode ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                           >
                             {mode}
                           </button>
                         ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Spacing Controls (Only relevant in Surah View) */}
                  {view === 'surah' && (
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Spacing</h3>
                      
                      {/* Arabic Slider */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-2 font-medium text-slate-600 dark:text-slate-300">
                          <span>Arabic Height</span>
                          <span>{arabicLineHeight.toFixed(1)}</span>
                        </div>
                        <input 
                          type="range" 
                          min="2.0" 
                          max="5.0" 
                          step="0.1"
                          value={arabicLineHeight}
                          onChange={(e) => setArabicLineHeight(parseFloat(e.target.value))}
                          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                      </div>

                      {/* Urdu Slider */}
                      { (translationMode === 'urdu' || translationMode === 'both') && (
                        <div>
                          <div className="flex justify-between text-xs mb-2 font-medium text-slate-600 dark:text-slate-300">
                            <span>Urdu Height</span>
                            <span>{urduLineHeight.toFixed(1)}</span>
                          </div>
                          <input 
                            type="range" 
                            min="1.8" 
                            max="4.5" 
                            step="0.1"
                            value={urduLineHeight}
                            onChange={(e) => setUrduLineHeight(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};