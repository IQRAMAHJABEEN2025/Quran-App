import React, { useEffect, useState, useMemo } from 'react';
import { Header } from './components/Header';
import { AyahCard } from './components/AyahCard';
import { SurahCard } from './components/SurahCard';
import { fetchSurahList, fetchSurahData } from './services/quranService';
import type { SurahMeta, MergedAyah } from './types';

const App: React.FC = () => {
  // -- Theme State --
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // -- View State --
  const [view, setView] = useState<'home' | 'surah'>('home');

  // -- Data State --
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);
  const [ayahs, setAyahs] = useState<MergedAyah[]>([]);
  
  // -- UI State --
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchingAyahs, setFetchingAyahs] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // -- Settings State --
  const [translationMode, setTranslationMode] = useState<'english' | 'urdu' | 'both'>('english');
  
  // Line Height State (Typography Controls)
  const [arabicLineHeight, setArabicLineHeight] = useState<number>(3.0);
  const [urduLineHeight, setUrduLineHeight] = useState<number>(2.8);

  // Computed properties for passing to components
  const showEnglish = translationMode === 'english' || translationMode === 'both';
  const showUrdu = translationMode === 'urdu' || translationMode === 'both';

  // -- Theme Effect --
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  // -- Fetch Surah List on Mount --
  useEffect(() => {
    const init = async () => {
      try {
        const list = await fetchSurahList();
        setSurahs(list);
        setLoading(false);
      } catch (err) {
        setError("Failed to load Surah list. Please check your connection.");
        setLoading(false);
      }
    };
    init();
  }, []);

  // -- Handle Surah Selection --
  const handleSurahClick = async (surah: SurahMeta) => {
    setSelectedSurah(surah);
    setView('surah');
    setFetchingAyahs(true);
    setError(null);
    setAyahs([]); // Clear previous
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const data = await fetchSurahData(surah.number);
      setAyahs(data);
    } catch (err) {
      setError("Failed to load Surah content. Please try again.");
    } finally {
      setFetchingAyahs(false);
    }
  };

  const handleBackToHome = () => {
    setView('home');
    setSelectedSurah(null);
    setAyahs([]);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // -- Filter Surahs --
  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return surahs;
    const lowerQuery = searchQuery.toLowerCase();
    return surahs.filter(s => 
      s.englishName.toLowerCase().includes(lowerQuery) || 
      s.englishNameTranslation.toLowerCase().includes(lowerQuery) ||
      s.number.toString().includes(lowerQuery)
    );
  }, [surahs, searchQuery]);

  return (
    // Dark mode background changed to Slate 950 (Deep Blue/Black) for softer contrast
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 transition-colors duration-500 relative font-sans">
      
      {/* Content Wrapper */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        <Header 
          view={view}
          currentSurah={selectedSurah}
          onBack={handleBackToHome}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          translationMode={translationMode}
          setTranslationMode={setTranslationMode}
          arabicLineHeight={arabicLineHeight}
          setArabicLineHeight={setArabicLineHeight}
          urduLineHeight={urduLineHeight}
          setUrduLineHeight={setUrduLineHeight}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 sm:py-10 transition-all duration-500">
          
          {/* Loading Initial List */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
               <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
               </div>
               <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Something went wrong</h2>
               <p className="text-slate-600 dark:text-slate-400 max-w-md">{error}</p>
               <button 
                 onClick={() => window.location.reload()}
                 className="mt-6 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium transition-colors shadow-lg shadow-emerald-500/30"
               >
                 Retry
               </button>
            </div>
          )}

          {/* View: HOME (Surah Grid) */}
          {!loading && !error && view === 'home' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Surahs</h2>
                 <p className="text-slate-500 dark:text-slate-400">Select a Surah to read.</p>
              </div>
              
              {filteredSurahs.length === 0 ? (
                <div className="text-center py-20 text-slate-500">No Surahs found matching "{searchQuery}"</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                  {filteredSurahs.map((surah, index) => (
                    <SurahCard 
                      key={surah.number} 
                      surah={surah} 
                      index={index} 
                      onClick={() => handleSurahClick(surah)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* View: SURAH DETAIL (Ayah List) */}
          {!loading && !error && view === 'surah' && (
             <div className="animate-fade-in max-w-4xl mx-auto">
               
               {/* Header Info for Surah */}
               {selectedSurah && !fetchingAyahs && (
                 <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-block mb-4 px-4 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
                       {selectedSurah.revelationType} • {selectedSurah.numberOfAyahs} Ayahs
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {selectedSurah.englishName}
                    </h1>
                    <p className="text-xl font-arabic text-emerald-600 dark:text-emerald-400 mb-4">
                      {selectedSurah.name}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      {selectedSurah.englishNameTranslation}
                    </p>
                 </div>
               )}

               {fetchingAyahs ? (
                 <div className="w-full h-60 flex items-center justify-center">
                   <div className="flex flex-col items-center gap-3">
                     <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
                     <span className="text-sm text-slate-400 font-medium">Loading Surah...</span>
                   </div>
                 </div>
               ) : (
                 <div className="space-y-2">
                   {/* Bismillah Heading - Shown for all surahs except 1 and 9 */}
                   {selectedSurah && selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
                      <div className="text-center mb-10 animate-fade-in mt-[-1rem]">
                          <p className="font-arabic text-4xl sm:text-5xl text-slate-700 dark:text-slate-300 drop-shadow-sm leading-relaxed">
                            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                          </p>
                      </div>
                   )}

                   {ayahs.map((ayah, index) => (
                     <AyahCard 
                       key={ayah.number} 
                       ayah={ayah} 
                       index={index} 
                       showEnglish={showEnglish}
                       showUrdu={showUrdu}
                       arabicLineHeight={arabicLineHeight}
                       urduLineHeight={urduLineHeight}
                     />
                   ))}
                 </div>
               )}
             </div>
          )}

        </main>

        <footer className="mt-auto border-t border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-950/50 backdrop-blur-sm py-6">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-500 font-medium">
              khadijasheikh039@gmail.com
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-600 mt-2">
               Data provided by <a href="https://alquran.cloud" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">Al-Quran Cloud API</a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;