'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
      
      {/* Thumbnail */}
      <Link href={`/blog/${blog.slug}`} className="relative block aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <img
          src={thumbnailUrl}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          loading="lazy"
        />
        {blog.category && (
          <span className="absolute top-3 left-3 rounded bg-zinc-900/90 dark:bg-zinc-100/95 text-white dark:text-zinc-950 px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-bold shadow-sm">
            {blog.category.name}
          </span>
        )}
      </Link>

      {/* Info Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        
        {/* Date & Read Time */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          <span>{formatDate(blog.created_at)}</span>
          <span>·</span>
          <span>{getReadingTime(blog.content)}</span>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-base sm:text-lg font-bold leading-snug text-zinc-900 group-hover:text-amber-500 transition-colors dark:text-white dark:group-hover:text-amber-400">
          <Link href={`/blog/${blog.slug}`} className="line-clamp-2">
            {blog.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="mt-2.5 line-clamp-3 text-xs sm:text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {getExcerpt(blog.content)}
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 3).map(tag => (
              <span 
                key={tag.id}
                className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
          {/* Author */}
          {blog.author && (
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {blog.author.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                {blog.author.name}
              </span>
            </div>
          )}

          {/* Read Link */}
          <Link 
            href={`/blog/${blog.slug}`} 
            className="flex items-center gap-0.5 text-xs font-semibold text-zinc-900 dark:text-white group/read hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            Read Post
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/read:translate-x-0.5" />
          </Link>
        </div>

      </div>

    </article>
  );
}
