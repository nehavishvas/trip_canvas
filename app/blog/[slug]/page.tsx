import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import Footer from '@/components/Footer';
import { readDb } from '@/lib/db';
import { Calendar, User, Clock, ArrowLeft, MessageSquare, Heart, Share2 } from 'lucide-react';
import CommentsSection from './CommentsSection'; // Client component for comment typing

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const db = await readDb();

  // Find the blog
  const blog = db.blogs.find(b => b.slug === slug);
  if (!blog) {
    notFound();
  }

  // Hydrate with author, category, tags, and media
  const author = db.users.find(u => u.id === blog.author_id);
  const category = db.categories.find(c => c.id === blog.category_id);
  const tagIds = db.blog_tags.filter(bt => bt.blog_id === blog.id).map(bt => bt.tag_id);
  const blogTags = db.tags.filter(t => tagIds.includes(t.id));
  const media = db.media.filter(m => m.blog_id === blog.id);

  // Estimate reading time
  const words = blog.content.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  // Custom text formatter to map text blocks to HTML paragraph tags
  const renderContent = (text: string) => {
    return text.split('\n\n').map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // Handle custom headings starting with ###
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={idx} className="mt-8 mb-4 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {trimmed.replace('### ', '')}
          </h4>
        );
      }
      // Handle custom headings starting with ##
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={idx} className="mt-10 mb-4 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            {trimmed.replace('## ', '')}
          </h3>
        );
      }

      // Handle simple list items starting with -
      if (trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').map(item => item.replace('- ', '').trim());
        return (
          <ul key={idx} className="my-6 list-disc pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>{item}</li>
            ))}
          </ul>
        );
      }

      // Handle simple numbered lists starting with 1.
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed.split('\n').map(item => item.replace(/^\d+\.\s/, '').trim());
        return (
          <ol key={idx} className="my-6 list-decimal pl-6 space-y-2 text-zinc-600 dark:text-zinc-400">
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>{item}</li>
            ))}
          </ol>
        );
      }

      // Handle code snippet blocks
      if (trimmed.startsWith('```')) {
        const code = trimmed.replace(/```[a-z]*\n/, '').replace(/\n```$/, '');
        return (
          <pre key={idx} className="my-6 overflow-x-auto rounded-xl bg-zinc-900 p-4 text-xs font-mono text-zinc-100 dark:bg-black">
            <code>{code}</code>
          </pre>
        );
      }

      // Default paragraph
      return (
        <p key={idx} className="mb-5 leading-relaxed text-zinc-700 dark:text-zinc-300 text-base sm:text-lg">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#faf8f5] dark:bg-[#0c0b0a] text-zinc-900 dark:text-zinc-50 font-sans">
      
      {/* Decorative Glow Blobs for Glassmorphic Depth */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-3xl dark:bg-amber-500/5" />
      <div className="pointer-events-none absolute bottom-1/3 -left-60 h-[500px] w-[500px] rounded-full bg-rose-500/5 blur-3xl dark:bg-rose-500/2" />
      
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        
        {/* Back navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to explore
        </Link>

        {/* Article Container */}
        <article className="mt-6 space-y-8">
          
          {/* Article Header */}
          <div className="space-y-4">
            {category && (
              <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {category.name}
              </span>
            )}
            
            <h1 className="text-3xl font-black font-serif tracking-tight text-zinc-900 dark:text-white sm:text-5xl leading-tight">
              {blog.title}
            </h1>

            {/* Meta data row */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-500 border-b border-zinc-200/50 pb-6 dark:border-zinc-800/60">
              {author && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-xs font-extrabold text-white shadow-sm">
                    {author.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="block font-bold text-zinc-800 dark:text-zinc-200">{author.name}</span>
                    <span className="block text-[10px] text-zinc-450 dark:text-zinc-500 uppercase tracking-wider font-semibold">{author.role}</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4 font-semibold uppercase tracking-wider text-[10px] text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-zinc-300 dark:text-zinc-750" />
                  {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-zinc-300 dark:text-zinc-750" />
                  {readingTime} min read
                </span>
              </div>
            </div>
          </div>

          {/* Premium Media Carousel */}
          <section className="my-8">
            <Carousel media={media} />
          </section>

          {/* Article Text Content */}
          <section className="prose prose-zinc max-w-none dark:prose-invert prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-headings:font-serif prose-headings:font-bold">
            {renderContent(blog.content)}
          </section>

          {/* Tags list */}
          {blogTags.length > 0 && (
            <div className="flex flex-wrap gap-2.5 pt-6 border-t border-zinc-200/50 dark:border-zinc-800/60">
              {blogTags.map(tag => (
                <Link
                  key={tag.id}
                  href={`/?tag=${tag.slug}`}
                  className="rounded-xl bg-white/60 border border-zinc-200/50 px-3.5 py-1.5 text-xs font-bold text-zinc-650 hover:border-amber-500/20 dark:bg-zinc-900/40 dark:border-zinc-800 dark:text-zinc-450 dark:hover:bg-zinc-800"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* Author Bio Signature Box */}
          {author && (
            <div className="mt-12 rounded-[2.2rem] border border-zinc-200/50 bg-white/40 p-6 sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/20 backdrop-blur-md flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-xl font-bold text-white shadow shadow-indigo-500/10">
                {author.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-bold font-serif text-zinc-900 dark:text-white">Written by {author.name}</h4>
                <p className="text-xs sm:text-sm text-zinc-550 dark:text-zinc-400 leading-relaxed">
                  A certified content curator sharing detailed logs and writeups across travel destinations, technology breakthroughs, and minimalist designs on TripCanvas.
                </p>
              </div>
            </div>
          )}

          {/* Interactive Comments Section */}
          <section className="pt-10 border-t border-zinc-200/50 dark:border-zinc-800/60">
            <CommentsSection blogId={blog.id} />
          </section>

        </article>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

