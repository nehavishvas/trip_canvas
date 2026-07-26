'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2, MessageSquare, Globe, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      
      // Clear fields
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#faf8f5] dark:bg-[#0c0b0a] text-zinc-900 dark:text-zinc-50 font-sans">
      
      {/* Glow Blobs for Glassmorphism */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-3xl dark:bg-amber-500/5" />
      <div className="pointer-events-none absolute bottom-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5" />

      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Contact Header */}
        <section className="text-center max-w-3xl mx-auto space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-[1.2rem] bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-500/20 shadow-sm">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-extrabold font-serif tracking-tight text-zinc-900 dark:text-white sm:text-6xl leading-tight">
            Connect With Our <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">Team</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Have questions about writing guidelines, sponsorship inquiries, or technical feedback? Reach out to us below!
          </p>
        </section>

        {/* Contact Columns Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 items-stretch">
          
          {/* LEFT: Info columns (2 spans) - Beautiful gradient panel */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex-1 rounded-[2.2rem] border border-zinc-200/50 bg-white/40 p-8 dark:border-zinc-800/80 dark:bg-zinc-900/20 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.01)] flex flex-col justify-between space-y-10">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Get in Touch</span>
                <h3 className="text-2xl font-bold font-serif tracking-tight text-zinc-900 dark:text-white">
                  TripCanvas Headquarters
                </h3>
                <p className="text-xs text-zinc-550 dark:text-zinc-450 leading-relaxed">
                  We look forward to hearing from you. Our editors respond within 24 business hours to general inquiries and submission drafts.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-white/60 border border-zinc-200/40 p-2.5 shadow-sm text-amber-600 dark:bg-zinc-950 dark:border-zinc-800 dark:text-amber-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider">Email Us</span>
                    <a href="mailto:support@tripcanvas.com" className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-400 hover:underline">
                      support@tripcanvas.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-white/60 border border-zinc-200/40 p-2.5 shadow-sm text-amber-600 dark:bg-zinc-950 dark:border-zinc-800 dark:text-amber-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider">Call Us</span>
                    <a href="tel:+1234567890" className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-400 hover:underline">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-white/60 border border-zinc-200/40 p-2.5 shadow-sm text-amber-600 dark:bg-zinc-950 dark:border-zinc-800 dark:text-amber-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-zinc-400 tracking-wider">Headquarters</span>
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-normal">
                      100 Creative Workspace Way,<br />
                      Suite 500, San Francisco, CA
                    </p>
                  </div>
                </div>
              </div>

              {/* Social handles mock widget */}
              <div className="border-t border-zinc-200/40 dark:border-zinc-800/40 pt-6">
                <span className="block text-[9px] uppercase font-bold text-zinc-450 tracking-wider mb-2">Editorial Guidelines</span>
                <a href="/about" className="inline-flex items-center gap-1 text-xs font-bold text-zinc-950 hover:text-amber-600 dark:text-white dark:hover:text-amber-400 transition-colors">
                  Read about our curators
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form (3 spans) */}
          <div className="lg:col-span-3">
            {success ? (
              <div className="h-full rounded-[2.2rem] border border-zinc-200/50 bg-white/40 backdrop-blur-md p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.01)] dark:border-zinc-800/80 dark:bg-zinc-900/20 flex flex-col justify-center items-center py-20 space-y-4 animate-in zoom-in duration-300">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                  <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold font-serif text-zinc-900 dark:text-white">Message Dispatched!</h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Thank you for writing to TripCanvas. We have received your query and a team member will get back to you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 rounded-full bg-zinc-950 px-6 py-3 text-xs font-bold text-white hover:bg-amber-500 hover:text-zinc-950 dark:bg-white dark:text-zinc-950 dark:hover:bg-amber-400 transition-all active:scale-95"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="rounded-[2.2rem] border border-zinc-200/50 bg-white/40 backdrop-blur-md p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.01)] dark:border-zinc-800/80 dark:bg-zinc-900/20">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-2xl border border-zinc-200 bg-white/60 py-3.5 px-4 text-xs text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-white dark:focus:border-amber-500 dark:focus:bg-zinc-950"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full rounded-2xl border border-zinc-200 bg-white/60 py-3.5 px-4 text-xs text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-white dark:focus:border-amber-500 dark:focus:bg-zinc-950"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Writer Proposal, Advertising"
                      className="w-full rounded-2xl border border-zinc-200 bg-white/60 py-3.5 px-4 text-xs text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-white dark:focus:border-amber-500 dark:focus:bg-zinc-950"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Message Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Draft your query details here..."
                      className="w-full rounded-2xl border border-zinc-200 bg-white/60 py-3.5 px-4 text-xs text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-white dark:focus:border-amber-500 dark:focus:bg-zinc-950"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-zinc-950 py-4 text-xs font-bold text-white shadow-md hover:bg-amber-500 hover:text-zinc-950 disabled:opacity-50 active:scale-[0.98] transition-all dark:bg-white dark:text-zinc-950 dark:hover:bg-amber-400"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Transmitting message...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

