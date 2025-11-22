import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/authService';
import type { User } from '../types';

interface AuthFormsProps {
  view: 'login' | 'signup';
  onSwitchView: (view: 'login' | 'signup') => void;
  onSuccess: (user: User | null) => void; // null implies signup success (go to landing)
  onBack: () => void;
}

export const AuthForms: React.FC<AuthFormsProps> = ({ view, onSwitchView, onSuccess, onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (view === 'signup') {
        if (!name || !email || !password) throw new Error("All fields are required");
        await registerUser(name, email, password);
        // Signup success: Don't pass user, pass null to indicate "Go to Landing"
        setSuccessMsg("Account created successfully!");
        setTimeout(() => {
          onSuccess(null); 
        }, 500); // Fast redirect (0.5s)
      } else {
        if (!email || !password) throw new Error("All fields are required");
        const user = await loginUser(email, password);
        onSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      if (view === 'login') setLoading(false); // Keep loading spinner on signup success redirect
    }
  };

  return (
    <div className="max-w-md mx-auto w-full animate-fade-in px-4 relative">
      
      {/* Fixed, highly visible Back Button */}
      <button 
        onClick={onBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-md hover:shadow-lg transition-all text-slate-600 dark:text-slate-200 font-medium group"
      >
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
         <span>Home</span>
      </button>

      {/* Brand Header inside the form card */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl font-arabic pt-1 shadow-xl shadow-emerald-500/30">
           ن
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
           <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
             {view === 'login' ? 'Welcome Back' : 'Join Noor'}
           </h2>
           <p className="text-slate-500 dark:text-slate-400 text-sm">
             {view === 'login' ? 'Sign in to continue your journey.' : 'Create an account to start tracking progress.'}
           </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-sm font-medium flex items-center gap-2 border border-red-100 dark:border-red-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-300 text-sm font-medium flex items-center gap-2 border border-emerald-100 dark:border-emerald-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5 ml-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all dark:text-white"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5 ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1.5 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2 flex justify-center items-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              view === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {view === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => onSwitchView(view === 'login' ? 'signup' : 'login')}
              className="ml-2 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              {view === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};