'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Navbar from '@/components/Navbar';
import { Mail, Lock, ShieldAlert, Globe, Loader2, User, ArrowRight } from 'lucide-react';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, register, loading: authLoading } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = searchParams.get('redirect') || '';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (redirectPath) {
        router.push(redirectPath);
      } else if (user.role === 'admin' || user.role === 'author') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [user, redirectPath, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await register(name, email, password);
      }
      // Success triggers user state change which redirects via useEffect
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
        <p className="text-sm font-medium text-zinc-500">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[420px]">
      {/* Decorative background glow */}
      <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-tr from-amber-400 to-orange-500 opacity-20 blur-xl transition-all duration-1000 group-hover:opacity-40"></div>
      
      <div className="relative rounded-[2rem] border border-zinc-200/50 bg-white/80 p-8 backdrop-blur-xl shadow-2xl dark:border-zinc-800/50 dark:bg-zinc-950/80">
        <div className="text-center space-y-3 mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/30">
            <Globe className="h-7 w-7 animate-[spin_10s_linear_infinite]" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            {isLogin ? 'Welcome Back' : 'Join TripCanvas'}
          </h2>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {isLogin ? 'Sign in to continue exploring' : 'Create an account to share your journey'}
          </p>
        </div>

        {/* Toggle between Login and Signup */}
        <div className="mb-6 flex rounded-xl bg-zinc-100/50 p-1 dark:bg-zinc-900/50">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all duration-200 ${
              isLogin 
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white' 
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all duration-200 ${
              !isLogin 
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white' 
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50/80 p-4 text-xs font-semibold text-red-600 dark:bg-red-950/30 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
            <ShieldAlert className="h-4 w-4 flex-shrink-0" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5 animate-in fade-in zoom-in-95 duration-300">
              <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute top-3 left-3.5 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-amber-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 pr-4 pl-11 text-sm outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:border-amber-400 dark:focus:bg-zinc-950"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute top-3 left-3.5 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-amber-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="hello@example.com"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 pr-4 pl-11 text-sm outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:border-amber-400 dark:focus:bg-zinc-950"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute top-3 left-3.5 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-amber-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 pr-4 pl-11 text-sm outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:border-amber-400 dark:focus:bg-zinc-950"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5 animate-in fade-in zoom-in-95 duration-300">
              <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute top-3 left-3.5 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-amber-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 pr-4 pl-11 text-sm outline-none transition-all focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:border-amber-400 dark:focus:bg-zinc-950"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-zinc-900 py-3.5 text-sm font-bold text-white transition-all hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-900/20 active:scale-[0.98] disabled:opacity-70 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 dark:hover:shadow-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 to-orange-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-zinc-50 to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-orange-500/10 blur-[100px] pointer-events-none"></div>

        <Suspense fallback={
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
            <p className="text-sm font-medium text-zinc-500">Loading experience...</p>
          </div>
        }>
          <AuthForm />
        </Suspense>
      </main>

      <footer className="border-t border-zinc-200/50 bg-white/50 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/50 py-6 text-center text-xs font-medium text-zinc-400">
        <p>&copy; {new Date().getFullYear()} TripCanvas. All rights reserved.</p>
      </footer>
    </div>
  );
}
