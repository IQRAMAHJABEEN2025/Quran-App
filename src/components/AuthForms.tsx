
import React, { useState } from 'react';
import { loginUser, registerUser, loginWithGoogle } from '../services/authService';
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
        // Signup success
        setSuccessMsg("Account created successfully!");
        setTimeout(() => {
          onSuccess(null); 
        }, 500); // Fast redirect
      } else {
        if (!email || !password) throw new Error("All fields are required");
        await loginUser(email, password);
        // Note: onSuccess for login is handled by the onAuthStateChanged listener in App.tsx
      }
    } catch (err: any) {
      let msg = err.message;
      if (msg.includes('auth/email-already-in-use')) msg = "Email is already registered.";
      if (msg.includes('auth/wrong-password')) msg = "Incorrect password.";
      if (msg.includes('auth/user-not-found')) msg = "No account found with this email.";
      if (msg.includes('auth/weak-password')) msg = "Password should be at least 6 characters.";
      setError(msg || "An error occurred");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      // Success is handled by App.tsx listener
    } catch (err: any) {
      console.error("Google Login Error:", err);
      // Show the actual error message to help debugging
      setError(err.message || "Google Sign In failed. Please try again.");
      setLoading(false);
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
            {loading && !error && !successMsg ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              view === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Google Login Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
          <span className="text-xs text-slate-400 font-medium uppercase">Or continue with</span>
          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
        </div>

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-70"
        >
           <svg className="w-5 h-5" viewBox="0 0 24 24">
             <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
             <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
             <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84.81-.81z" fill="#FBBC05"/>
             <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
           </svg>
           Google
        </button>

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
