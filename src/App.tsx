import React, { useEffect, useState, useMemo } from 'react';
import { Header } from './components/Header';
import { AyahCard } from './components/AyahCard';
import { SurahCard } from './components/SurahCard';
import { AuthForms } from './components/AuthForms';
import { LandingPage } from './components/LandingPage';
import { Profile } from './components/Profile';
import { fetchSurahList, fetchSurahData } from './services/quranService';
import { subscribeToAuthChanges, addToHistory, logoutUser } from './services/authService';
import type { SurahMeta, MergedAyah, User } from './types';

const App: React.FC = () => {
  // -- Theme State --
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // -- User State --
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true); // Initial Auth Check

  // -- View State --
  const [view, setView] = useState<'landing' | 'home' | 'surah' | 'login' | 'signup' | 'profile'>('landing');

  // -- Data State --
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);
  const [ayahs, setAyahs] = useState<MergedAyah[]>([]);
  
  // -- UI State --
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [fetchingAyahs, setFetchingAyahs] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // -- Settings State --
  const [translationMode, setTranslationMode] = useState<'english' | 'urdu' | 'both'>('english');
  const [arabicLineHeight, setArabicLineHeight] = useState<number>(3.0);
  const [urduLineHeight, setUrduLineHeight] = useState<number>(2.8);

  // Computed properties
  const showEnglish = translationMode === 'english' || translationMode === 'both';
  const showUrdu = translationMode === 'urdu' || translationMode === 'both';

  // -- Initialize Auth (Firebase) --
  useEffect(() => {
    // This subscription handles session persistence automatically
    // It is now optimized to return a basic user INSTANTLY, then update with history later
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      
      // If user is found and we are on landing/auth pages, redirect to Home
      // This will now happen much faster
      if (user && (view === 'landing' || view === 'login' || view === 'signup')) {
        setView('home');
      }
    });

    return () => unsubscribe();
  }, [view]); // Dependency on view allows it to correct routing if stuck

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

  // -- Fetch Data (Only if Logged In) --
  useEffect(() => {
    const loadData = async () => {
      if (currentUser && surahs.length === 0) {
        setDataLoading(true);
        try {
          const list = await fetchSurahList();
          setSurahs(list);
        } catch (err) {
          setError("Failed to load Surah list.");
        } finally {
          setDataLoading(false);
        }
      }
    };
    if (currentUser) {
      loadData();
    }
  }, [currentUser, surahs.length]);

  // -- Auth Handlers --
  
  // Called when Signup is successful (Login success is handled by subscription)
  const handleAuthSuccess = (user: User | null) => {
    if (user) {
      // If manual login returned user
      setCurrentUser(user);
      setView('home');
    } else {
      // Signup Success -> The subscription will pick up the new user automatically
      // We just set loading/view state here to bridge the millisecond gap
      setAuthLoading(true); 
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setView('landing'); 
    setSurahs([]); 
    setSelectedSurah(null);
  };

  // -- Surah Interaction --
  const handleSurahClick = async (surahNumber: number) => {
    const surah = surahs.find(s => s.number === surahNumber);
    if (!surah) return;

    setSelectedSurah(surah);
    setView('surah');
    setFetchingAyahs(true);
    setError(null);
    setAyahs([]); // Clear previous
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Add to history (async, no need to wait)
    if (currentUser) {
      addToHistory(surah).then(updatedUser => {
        if (updatedUser) setCurrentUser(updatedUser);
      });
    }

    try {
      const data = await fetchSurahData(surah.number);
      setAyahs(data);
    } catch (err) {
      setError("Failed to load Surah content. Please try again.");
    } finally {
      setFetchingAyahs(false);
    }
  };

  // -- Navigation Logic --
  const handleBack = () => {
    if (view === 'surah') {
      setView('home'); // Surah -> Home
      setSelectedSurah(null);
      setAyahs([]);
      setSearchQuery('');
    } else if (view === 'profile') {
      setView('home'); // Profile -> Home
    } else if (view === 'login' || view === 'signup') {
      setView('landing'); // Auth -> Landing
    }
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

  // Prevent flashing while checking firebase auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // -- RENDER: LANDING PAGE (Guest) --
  if (!currentUser && view === 'landing') {
    return (
      <LandingPage 
        onLogin={() => setView('login')}
        onSignup={() => setView('signup')}
      />
    );
  }

  // -- RENDER: AUTH PAGE (Guest) --
  if (!currentUser && (view === 'login' || view === 'signup')) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 font-sans flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="z-10 w-full">
          <AuthForms 
            view={view} 
            onSwitchView={(v) => setView(v)} 
            onSuccess={handleAuthSuccess}
            onBack={handleBack}
          />
        </div>
      </div>
    );
  }

  // -- RENDER: MAIN APP (Authenticated User) --
  // If currentUser is null here (but view isn't landing/auth), we fallback to landing
  if (!currentUser) {
     setView('landing');
     return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 transition-colors duration-500 relative font-sans selection:bg-emerald-200 dark:selection:bg-emerald-900 flex flex-col">
      
      <Header 
        view={view as any}
        currentSurah={selectedSurah}
        onBack={handleBack}
        onProfileClick={() => setView('profile')}
        currentUser={currentUser}
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

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 sm:py-10 transition-all duration-500 flex flex-col">
        
        {/* Loading Initial List */}
        {dataLoading && (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading Noor...</p>
          </div>
        )}

        {/* Profile View */}
        {!dataLoading && view === 'profile' && currentUser && (
          <div>
            <button 
              onClick={handleBack}
              className="mb-6 flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              <span className="text-sm font-bold uppercase tracking-wide">Back to Dashboard</span>
            </button>
            <Profile 
              user={currentUser} 
              onSurahClick={handleSurahClick}
              surahList={surahs}
              onLogout={handleLogout}
            />
          </div>
        )}

        {/* Error State */}
        {error && !dataLoading && (
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
        {!dataLoading && !error && view === 'home' && currentUser && (
          <div className="animate-fade-in">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Surahs</h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Welcome back, <span className="font-semibold text-emerald-600 dark:text-emerald-400">{currentUser.name.split(' ')[0]}</span>.
                </p>
              </div>
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
                    onClick={() => handleSurahClick(surah.number)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* View: SURAH DETAIL (Ayah List) */}
        {!dataLoading && !error && view === 'surah' && (
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
            Developed with ❤️
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-600 mt-2">
             Data provided by <a href="https://alquran.cloud" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">Al-Quran Cloud API</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;