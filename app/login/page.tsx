'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Navbar from '@/components/Navbar';
import { Mail, Lock, ShieldAlert, Key, Globe, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      await login(email, password);
      // Success triggers user state change which redirects via useEffect
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  const handleQuickLogin = async (presetEmail: string, presetPass: string) => {
    setError('');
    setLoading(true);
    setEmail(presetEmail);
    setPassword(presetPass);

    try {
      await login(presetEmail, presetPass);
    } catch (err: any) {
      setError(err.message || 'Preset login failed');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-sm text-zinc-500">Checking session credentials...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 rounded-3xl border border-zinc-200 bg-white/95 backdrop-blur shadow-xl dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="text-center space-y-2">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-md shadow-orange-500/20">
          <Globe className="h-6 w-6 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Welcome to Trip<span className="font-serif italic font-medium text-amber-500">Canvas</span>
        </h2>
        <p className="text-sm text-zinc-400">Sign in to read and publish incredible logs</p>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-xs font-medium text-red-700 dark:bg-red-950/20 dark:text-red-400">
          <ShieldAlert className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute top-3 left-3 h-4 w-4 text-zinc-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. author@example.com"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pr-4 pl-10 text-sm outline-none transition-all focus:border-amber-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-amber-400 dark:focus:bg-zinc-950"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute top-3 left-3 h-4 w-4 text-zinc-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pr-4 pl-10 text-sm outline-none transition-all focus:border-amber-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-amber-400 dark:focus:bg-zinc-950"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 py-3 text-sm font-semibold text-white transition-all hover:from-amber-500 hover:to-orange-600 disabled:opacity-50 flex items-center justify-center gap-2 shadow shadow-orange-500/10 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Preset Logins for Testing */}
      <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900 space-y-3">
        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          <Key className="h-3 w-3" /> Quick Testing Logins
        </span>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@example.com', 'admin')}
            className="flex flex-col items-center rounded-xl border border-zinc-200 bg-zinc-50/50 p-2.5 text-center text-xs hover:bg-zinc-100 transition-colors dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900"
          >
            <span className="font-bold text-zinc-900 dark:text-white">Admin Preset</span>
            <span className="text-[10px] text-zinc-400">admin / admin</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('author@example.com', 'author')}
            className="flex flex-col items-center rounded-xl border border-zinc-200 bg-zinc-50/50 p-2.5 text-center text-xs hover:bg-zinc-100 transition-colors dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900"
          >
            <span className="font-bold text-zinc-900 dark:text-white">Author Preset</span>
            <span className="text-[10px] text-zinc-400">author / author</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950">
        <Suspense fallback={
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-sm text-zinc-500">Loading form...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>

      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 py-4 text-center text-[10px] text-zinc-400">
        <p>&copy; TripCanvas local mock environment.</p>
      </footer>
    </div>
  );
}
