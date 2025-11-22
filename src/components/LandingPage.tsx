import React from 'react';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 font-sans">
      
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar Placeholder */}
      <nav className="w-full px-6 py-6 flex justify-between items-center relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
           <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-xl font-arabic pt-1 shadow-lg shadow-emerald-500/20">
              ن
           </div>
           <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-100">Noor</span>
        </div>
        <button 
           onClick={onLogin}
           className="px-5 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center relative z-10 -mt-10">
        
        <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            The Holy Quran
          </span>
          
          <h1 className="text-5xl sm:text-7xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
            Find Peace in the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Words of Allah</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
            A beautiful, distraction-free space to read, understand, and reflect upon the Quran.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={onSignup}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-1 active:translate-y-0"
            >
              Get Started
            </button>
            <button 
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Feature Preview Cards (Decorative) */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-60 dark:opacity-40 max-w-4xl mx-auto pointer-events-none select-none">
           {[1, 2, 3, 4].map((i) => (
             <div key={i} className="h-32 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 transform rotate-6" style={{ marginTop: i % 2 === 0 ? '2rem' : '0' }}></div>
           ))}
        </div>

      </main>

      <footer className="py-6 text-center text-slate-400 dark:text-slate-600 text-sm relative z-10">
        <p>&copy; 2024 Noor Quran Explorer. All rights reserved.</p>
      </footer>
    </div>
  );
};