'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { 
  Search, 
  PenTool, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown, 
  User, 
  Globe,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

function NavbarContent() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Sync theme status on client mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  // Sync navbar search input with URL search param
  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchQuery(query);
    } else {
      setSearchQuery('');
    }
  }, [searchParams]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-[#faf8f5]/80 backdrop-blur-lg dark:border-zinc-800/40 dark:bg-[#0c0b0a]/80 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-md shadow-orange-500/20">
              <Globe className="h-5 w-5 animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Trip<span className="font-serif italic font-medium text-amber-500">Canvas</span>
            </span>
          </Link>
          
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                pathname === '/' 
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' 
                  : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              Explore
            </Link>
            <Link
              href="/about"
              className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                pathname === '/about' 
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' 
                  : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                pathname === '/contact' 
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' 
                  : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex max-w-md flex-1 items-center px-6">
          <div className="relative w-full">
            <Search className="absolute top-2.5 left-3.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search journals, destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-zinc-200/80 bg-zinc-100/50 py-2 pr-10 pl-9.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:text-white dark:placeholder:text-zinc-500 dark:hover:border-zinc-700 dark:focus:border-amber-500 dark:focus:bg-zinc-950 dark:focus:ring-amber-500/10"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={clearSearch}
                className="absolute top-2 right-3.5 rounded-full p-0.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-350"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Action / User Section */}
        <div className="flex items-center gap-4">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="rounded-full border border-zinc-200 bg-zinc-50 p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            aria-label="Toggle theme"
            type="button"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
            ) : (
              <Sun className="h-4 w-4 transition-transform duration-300 hover:rotate-45" />
            )}
          </button>
          
          {/* Quick Write Button for Authors/Admins */}
          {user && (user.role === 'admin' || user.role === 'author') && (
            <Link 
              href="/admin/create" 
              className="hidden md:flex items-center gap-1.5 rounded-full bg-zinc-950 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-amber-500 hover:text-zinc-950 active:scale-95 dark:bg-white dark:text-zinc-950 dark:hover:bg-amber-400"
            >
              <PenTool className="h-3.5 w-3.5" />
              Write Journal
            </Link>
          )}

          {/* User Account Controls */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 p-1 pr-2.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-xs font-bold text-white shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden max-w-[100px] truncate text-zinc-700 dark:text-zinc-300 sm:inline">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>

              {/* Account Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-2xl border border-zinc-200 bg-white p-2 shadow-lg ring-1 ring-black/5 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="border-b border-zinc-100/60 px-3 py-2.5 text-xs dark:border-zinc-900">
                    <p className="font-bold text-zinc-900 dark:text-white">{user.name}</p>
                    <p className="mt-0.5 truncate text-zinc-500 dark:text-zinc-400">{user.email}</p>
                    <span className="mt-1.5 inline-block rounded-md bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                      {user.role}
                    </span>
                  </div>

                  <div className="mt-1.5 space-y-0.5">
                    {/* Dashboard Option */}
                    {(user.role === 'admin' || user.role === 'author') && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
                      >
                        <LayoutDashboard className="h-4 w-4 text-zinc-400" />
                        Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-zinc-950 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-amber-500 hover:text-zinc-950 active:scale-95 dark:bg-white dark:text-zinc-950 dark:hover:bg-amber-400"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-1 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white p-4 space-y-4 dark:border-zinc-800 dark:bg-zinc-950 md:hidden animate-in slide-in-from-top duration-200">
          
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:hidden">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-1.5 pl-9 text-sm text-zinc-900 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            />
          </form>

          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Explore Blogs
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Contact Us
            </Link>
            {user && (user.role === 'admin' || user.role === 'author') && (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Dashboard
                </Link>
                <Link
                  href="/admin/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  <PenTool className="h-4 w-4" />
                  Write New Post
                </Link>
              </>
            )}
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-lg bg-zinc-900 py-2.5 text-center text-sm font-semibold text-white dark:bg-white dark:text-zinc-900"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            <div className="h-5 w-24 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          </div>
          <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        </div>
      </header>
    }>
      <NavbarContent />
    </Suspense>
  );
}
