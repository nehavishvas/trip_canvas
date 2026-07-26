import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Compass, Globe, Users, HeartHandshake, ArrowRight, Mail, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const team = [
    {
      name: "Marcus Vance",
      role: "Founder & Editor-in-Chief",
      bio: "Avid explorer and photographer. Marcus has travelled to over 50 countries, capturing remote landscapes and documenting indigenous cultures.",
      avatar: "M",
      color: "from-violet-500 to-indigo-500"
    },
    {
      name: "Sarah Lin",
      role: "Lead Travel Curator",
      bio: "Wanderlust specialist. Sarah designs our thematic itineraries, focusing on sustainable eco-tourism and authentic local experiences.",
      avatar: "S",
      color: "from-emerald-500 to-teal-500"
    },
    {
      name: "Jane Doe",
      role: "Tech Journalist & Writer",
      bio: "Web developer turned travel writer. Jane covers the intersection of modern workspace design, digital nomadism, and emerging tech.",
      avatar: "J",
      color: "from-amber-500 to-rose-500"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#faf8f5] dark:bg-[#0c0b0a] text-zinc-900 dark:text-zinc-50">
      
      {/* Decorative Glow Blobs for Glassmorphic Depth */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-3xl dark:bg-amber-500/5" />
      <div className="pointer-events-none absolute top-1/2 -left-60 h-[500px] w-[500px] rounded-full bg-rose-500/5 blur-3xl dark:bg-rose-500/2" />
      <div className="pointer-events-none absolute -bottom-40 right-20 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5" />

      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-24 relative z-10 font-sans">
        
        {/* About Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-[1.2rem] bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 shadow-sm border border-amber-500/20">
            <Compass className="h-6 w-6 animate-spin-slow" />
          </div>
          <h1 className="text-4xl font-black font-serif tracking-tight text-zinc-900 dark:text-white sm:text-6xl leading-tight">
            Charting the World through <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">Storytelling</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            TripCanvas was born out of a desire to merge two worlds: the raw thrill of globe-trotting exploration and the clean, functional design of modern technology. We curate immersive visual logs, detailed journals, and technology break-downs.
          </p>
        </section>

        {/* Our Story Grid */}
        <section className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-serif tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Who We Are & What We Believe
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-550 dark:text-zinc-400">
              We believe travel is not just about visiting places; it is about building deep connections, understanding local heritage, and finding places that change your perspective. 
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-550 dark:text-zinc-400">
              Our curators spend weeks on locations testing equipment, mapping local secret spots, and compiling extensive guides so that you get access to genuine, reliable, and authentic information.
            </p>
            
            <div className="flex gap-4 pt-4">
              <Link 
                href="/" 
                className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 px-6 py-3.5 text-xs font-bold text-white hover:bg-amber-500 hover:text-zinc-950 transition-all dark:bg-white dark:text-zinc-950 dark:hover:bg-amber-400 shadow-md active:scale-95"
              >
                Explore Publications
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200/80 bg-white/40 backdrop-blur-md px-6 py-3.5 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:bg-zinc-800 active:scale-95"
              >
                Work With Us
              </Link>
            </div>
          </div>

          {/* Visual Platform Showcase Cards */}
          <div className="relative aspect-video rounded-[2.2rem] overflow-hidden bg-gradient-to-tr from-amber-500 to-orange-600 p-8 shadow-2xl text-white border border-white/10 group">
            <div className="absolute inset-0 bg-black/10 group-hover:scale-105 transition-transform duration-700" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider">TripCanvas Magazine</span>
                <span className="text-xs font-bold text-amber-100">Est. 2026</span>
              </div>
              
              <div className="space-y-2">
                <span className="text-2xl font-black block font-serif tracking-tight">Our Core Mission</span>
                <p className="text-xs text-amber-50 leading-relaxed max-w-sm">
                  &ldquo;To construct the world&apos;s most beautiful, responsive, and reliable travel documentation platform for modern nomads and creative minds.&rdquo;
                </p>
              </div>

              <div className="flex gap-6 border-t border-white/20 pt-4 text-center">
                <div>
                  <span className="block text-xl font-black text-white">50+</span>
                  <span className="text-[9px] text-amber-100 uppercase tracking-widest font-extrabold">Destinations</span>
                </div>
                <div>
                  <span className="block text-xl font-black text-white">100%</span>
                  <span className="text-[9px] text-amber-100 uppercase tracking-widest font-extrabold">Independent</span>
                </div>
                <div>
                  <span className="block text-xl font-black text-white">10K+</span>
                  <span className="text-[9px] text-amber-100 uppercase tracking-widest font-extrabold">Subscribers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Philosophy Section */}
        <section className="space-y-10">
          <div className="text-center space-y-2 max-w-md mx-auto">
            <h3 className="text-2xl font-bold font-serif tracking-tight text-zinc-900 dark:text-white">Our Core Philosophy</h3>
            <p className="text-xs text-zinc-400">These fundamental principles guide every guide we write and upload.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="group rounded-[2.2rem] border border-zinc-200/50 bg-white/40 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-amber-500/20 dark:border-zinc-800/80 dark:bg-zinc-900/20 dark:hover:border-amber-500/25 space-y-4">
              <div className="inline-flex rounded-xl bg-amber-500/10 p-3 text-amber-600 transition-transform duration-300 group-hover:scale-110 dark:bg-amber-500/15 dark:text-amber-400">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-zinc-900 dark:text-white transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400">Global Curiosity</h3>
              <p className="text-xs leading-relaxed text-zinc-550 dark:text-zinc-400">
                We seek out the path less travelled. From pristine hidden lagoons to digital nomad hot spots, our goal is to inspire readers to explore the world with fresh eyes.
              </p>
            </div>

            <div className="group rounded-[2.2rem] border border-zinc-200/50 bg-white/40 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-amber-500/20 dark:border-zinc-800/80 dark:bg-zinc-900/20 dark:hover:border-amber-500/25 space-y-4">
              <div className="inline-flex rounded-xl bg-emerald-500/10 p-3 text-emerald-600 transition-transform duration-300 group-hover:scale-110 dark:bg-emerald-500/15 dark:text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-zinc-900 dark:text-white transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Sustainable Journeys</h3>
              <p className="text-xs leading-relaxed text-zinc-550 dark:text-zinc-400">
                We advocate for responsible travel. Respecting regional conservation limits and leaving zero footprint ensures these fragile ecosystems survive for generations.
              </p>
            </div>

            <div className="group rounded-[2.2rem] border border-zinc-200/50 bg-white/40 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-amber-500/20 dark:border-zinc-800/80 dark:bg-zinc-900/20 dark:hover:border-amber-500/25 space-y-4">
              <div className="inline-flex rounded-xl bg-rose-500/10 p-3 text-rose-600 transition-transform duration-300 group-hover:scale-110 dark:bg-rose-500/15 dark:text-rose-400">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-zinc-900 dark:text-white transition-colors group-hover:text-rose-600 dark:group-hover:text-rose-400">Author Authenticity</h3>
              <p className="text-xs leading-relaxed text-zinc-550 dark:text-zinc-400">
                No generic feeds here. Every writeup represents raw, firsthand journals penned by writers who have spent days on location, experiencing the details.
              </p>
            </div>
          </div>
        </section>

        {/* Team Grid Section */}
        <section className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold font-serif text-zinc-900 dark:text-white flex items-center justify-center gap-2">
              <Users className="h-6 w-6 text-amber-505" />
              Meet the Curators
            </h2>
            <p className="text-xs text-zinc-450 dark:text-zinc-405">The creative minds behind the TripCanvas publication logs.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="group flex flex-col justify-between p-7 rounded-[2.2rem] border border-zinc-200/50 bg-white/40 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:border-amber-500/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] dark:border-zinc-800/80 dark:bg-zinc-900/20 dark:hover:border-amber-500/25 transition-all duration-500"
              >
                <div className="space-y-4">
                  {/* Styled Avatar */}
                  <div className={`flex h-14 w-14 items-center justify-center rounded-[1.2rem] bg-gradient-to-tr ${member.color} text-xl font-bold text-white shadow shadow-indigo-500/10 transition-transform duration-500 group-hover:scale-105`}>
                    {member.avatar}
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-bold font-serif text-zinc-900 dark:text-white text-base group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {member.name}
                    </h4>
                    <span className="inline-block rounded-lg bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/30 dark:border-zinc-800/30 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-400">
                      {member.role}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Social icons links mock */}
                <div className="flex gap-3 mt-6 border-t border-zinc-200/40 dark:border-zinc-800/40 pt-4 text-zinc-400">
                  <a href="#" className="hover:text-amber-500 transition-colors"><Globe className="h-4 w-4" /></a>
                  <a href="#" className="hover:text-amber-500 transition-colors"><Mail className="h-4 w-4" /></a>
                  <a href="#" className="hover:text-amber-500 transition-colors"><FileText className="h-4 w-4" /></a>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

