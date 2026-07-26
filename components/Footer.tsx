'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Mail, Phone, MapPin, Heart, ArrowUp } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function Footer() {
  const { user } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 transition-colors duration-300 relative z-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-md shadow-orange-500/20">
                <Globe className="h-5 w-5 animate-pulse" />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Trip<span className="font-serif italic font-medium text-amber-500">Canvas</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
              A premium travel and technology logging platform exploring hidden gems and modern tools for software engineers and digital nomads.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">Navigation</h4>
            <ul className="space-y-2.5 text-xs text-zinc-500 dark:text-zinc-400">
              <li>
                <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Explore Publications
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About Our Team
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href={user ? "/admin" : "/login"} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {user ? "Admin Dashboard" : "Contributor Sign In"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Topics / Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">Discover Topics</h4>
            <ul className="space-y-2.5 text-xs text-zinc-500 dark:text-zinc-400">
              <li>
                <Link href="/?category=travel" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Travel Journals
                </Link>
              </li>
              <li>
                <Link href="/?category=technology" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Technology Review
                </Link>
              </li>
              <li>
                <Link href="/?category=lifestyle" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Modern Workspaces
                </Link>
              </li>
              <li>
                <Link href="/?category=design" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  UX/UI Trends
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Coordinate details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">Contact Info</h4>
            <ul className="space-y-3.5 text-xs text-zinc-500 dark:text-zinc-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
                <span>100 Creative Workspace Way,<br />Suite 500, San Francisco, CA</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
                <a href="mailto:support@tripcanvas.com" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  support@tripcanvas.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-zinc-400 shrink-0" />
                <span>+1 (234) 567-890</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider line and bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 dark:text-zinc-500 gap-4">
          <p className="flex items-center gap-1 justify-center sm:justify-start">
            &copy; {new Date().getFullYear()} TripCanvas. Crafted with
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500 animate-pulse" />
            for visual excellence.
          </p>
          
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-white transition-colors"
            type="button"
          >
            Back to Top
            <ArrowUp className="h-3 w-3" />
          </button>
        </div>

      </div>
    </footer>
  );
}
