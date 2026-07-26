'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  blog: {
    id: number;
    title: string;
    slug: string;
    content: string;
    created_at: string;
    category?: { id: number; name: string; slug: string } | null;
    tags?: { id: number; name: string; slug: string }[];
    author?: { id: number; name: string; email: string } | null;
    media?: { id: number; file_url: string; file_type: 'image' | 'video' }[];
  };
}

export default function BlogCard({ blog }: BlogCardProps) {
  // Get first image as card thumbnail
  const firstImage = blog.media?.find(m => m.file_type === 'image');
  const thumbnailUrl = firstImage?.file_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Estimate reading time
  const getReadingTime = (text: string) => {
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return `${time} min read`;
  };

  // Excerpt of content
  const getExcerpt = (text: string) => {
    const cleanText = text.replace(/[#*`_]/g, '');
    if (cleanText.length <= 130) return cleanText;
    return `${cleanText.substring(0, 130)}...`;
  };

  // Get author gradient color based on name
  const getAvatarGradient = (name: string) => {
    const charCode = name.charCodeAt(0) || 0;
    if (charCode % 3 === 0) return 'from-amber-400 to-orange-500';
    if (charCode % 3 === 1) return 'from-violet-500 to-indigo-600';
    return 'from-emerald-400 to-teal-600';
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-[2.2rem] border border-zinc-200/70 bg-white/50 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-amber-500/30 dark:border-zinc-800/80 dark:bg-zinc-900/30 dark:hover:border-amber-500/25 dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
      
      {/* Thumbnail */}
      <Link href={`/blog/${blog.slug}`} className="relative block aspect-[16/10] w-full overflow-hidden bg-zinc-100/50 dark:bg-zinc-900/50">
        <img
          src={thumbnailUrl}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-0.5"
          loading="lazy"
        />
        {blog.category && (
          <span className="absolute top-4 left-4 rounded-full bg-zinc-950/80 backdrop-blur-md px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/10 shadow-sm">
            {blog.category.name}
          </span>
        )}
      </Link>

      {/* Info Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        
        {/* Date & Read Time */}
        <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600" />
            {formatDate(blog.created_at)}
          </span>
          <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600" />
            {getReadingTime(blog.content)}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3.5 text-lg font-bold font-serif leading-snug tracking-tight text-zinc-900 group-hover:text-amber-600 transition-colors dark:text-white dark:group-hover:text-amber-400">
          <Link href={`/blog/${blog.slug}`} className="line-clamp-2">
            {blog.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="mt-3 line-clamp-3 text-xs sm:text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {getExcerpt(blog.content)}
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 3).map(tag => (
              <span 
                key={tag.id}
                className="rounded-lg bg-zinc-100/50 px-2.5 py-1 text-[10px] font-medium text-zinc-500 border border-zinc-200/40 dark:bg-zinc-900/50 dark:text-zinc-400 dark:border-zinc-800/80"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-6 pt-5 border-t border-zinc-200/40 dark:border-zinc-800/60">
          {/* Author */}
          {blog.author && (
            <div className="flex items-center gap-2.5">
              <div className={`flex h-7.5 w-7.5 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarGradient(blog.author.name)} text-[10px] font-extrabold text-white shadow-sm`}>
                {blog.author.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {blog.author.name}
              </span>
            </div>
          )}

          {/* Read Link */}
          <Link 
            href={`/blog/${blog.slug}`} 
            className="flex items-center gap-1 text-xs font-bold text-zinc-950 dark:text-white group/read hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            Read Post
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/read:translate-x-1" />
          </Link>
        </div>

      </div>

    </article>
  );
}
