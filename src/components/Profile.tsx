
import React from 'react';
import type { User, SurahMeta } from '../types';

interface ProfileProps {
  user: User;
  onSurahClick: (surahNumber: number) => void;
  surahList: SurahMeta[];
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onSurahClick, surahList, onLogout }) => {
  
  const getSurahDetails = (number: number) => {
    return surahList.find(s => s.number === number);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 mb-10 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-emerald-500/20">
          {user.name.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{user.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-4">{user.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
             <span className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium">
               {user.history.length} Surahs Read
             </span>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="px-6 py-2.5 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-bold"
        >
          Sign Out
        </button>
      </div>

      {/* History Section */}
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M3 3v18h18"/><path d="M18 9l-5 5-5-5"/></svg>
        Reading History
      </h2>

      {user.history.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">You haven't read any Surahs yet.</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Your reading history will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.history.map((item, idx) => {
            const details = getSurahDetails(item.surahNumber);
            return (
              <button 
                key={`${item.surahNumber}-${item.timestamp}`}
                onClick={() => onSurahClick(item.surahNumber)}
                className="group flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 hover:shadow-lg hover:shadow-emerald-100 dark:hover:shadow-none transition-all text-left"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                    {item.surahNumber}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.englishName}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      {formatDate(item.timestamp)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                   <p className="font-arabic text-lg text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                     {item.surahName}
                   </p>
                   {details && (
                     <span className="text-[10px] uppercase tracking-wide text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md mt-1 inline-block">
                       {details.revelationType}
                     </span>
                   )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
