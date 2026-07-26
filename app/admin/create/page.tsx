'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import MediaUpload from '@/components/MediaUpload';
import { ArrowLeft, Save, FilePlus, Loader2, Send } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface UploadedMedia {
  file_url: string;
  file_type: 'image' | 'video';
  file_name: string;
}

export default function CreateBlog() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Static options for categories & tags (matching our seed database)
  const categories: Category[] = [
    { id: 1, name: "Travel", slug: "travel" },
    { id: 2, name: "Technology", slug: "technology" },
    { id: 3, name: "Lifestyle", slug: "lifestyle" },
    { id: 4, name: "Design", slug: "design" }
  ];

  const tags: Tag[] = [
    { id: 1, name: "Adventure", slug: "adventure" },
    { id: 2, name: "Wanderlust", slug: "wanderlust" },
    { id: 3, name: "Coding", slug: "coding" },
    { id: 4, name: "Next.js", slug: "nextjs" },
    { id: 5, name: "Minimalist", slug: "minimalist" },
    { id: 6, name: "Productivity", slug: "productivity" }
  ];

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [media, setMedia] = useState<UploadedMedia[]>([]);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'admin' && user.role !== 'author'))) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleTagToggle = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId) {
      alert('Please fill out all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await api.createBlog({
        title,
        content,
        category_id: parseInt(categoryId, 10),
        tags: selectedTags,
        status,
        media
      });
      
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      console.error('Failed to create post:', err);
      alert(err.message || 'Error occurred while creating blog post');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Back Button */}
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to dashboard
        </Link>

        {/* Header Title */}
        <div className="mt-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <FilePlus className="h-7 w-7 text-amber-600 dark:text-amber-400" />
            Write New Post
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Compose your article content, select taxonomies, and attach multiple media files.</p>
        </div>

        {/* Composer Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          
          {/* Post Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Article Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 10 Places to Visit in Switzerland"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-900 outline-none transition-all focus:border-amber-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            />
          </div>

          {/* Category Selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full max-w-xs rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-900 outline-none transition-all focus:border-amber-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Tags Checkbox Checklist */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => {
                const active = selectedTags.includes(tag.id);
                return (
                  <button
                    type="button"
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                      active
                        ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-950 dark:border-white'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-800 dark:hover:bg-zinc-900'
                    }`}
                  >
                    #{tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Media Multi-Uploader */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Attached Media Carousel
            </label>
            <MediaUpload value={media} onChange={setMedia} />
          </div>

          {/* Blog Content body */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Body Content <span className="text-red-500">*</span>
            </label>
            <div className="text-[10px] text-zinc-400 mb-1">
              Supports simple headings format: starting a block with &ldquo;## &rdquo; or &ldquo;### &rdquo; will format as heading titles. Split paragraphs with double newlines.
            </div>
            <textarea
              required
              rows={12}
              placeholder="Start drafting your article content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-900 font-sans outline-none leading-relaxed transition-all focus:border-amber-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            />
          </div>

          {/* Status and Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            {/* Status radio switch */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Publish Status:</span>
              <div className="flex rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`rounded-md px-3 py-1 text-xs font-bold capitalize transition-all ${
                    status === 'draft'
                      ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-white'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`rounded-md px-3 py-1 text-xs font-bold capitalize transition-all ${
                    status === 'published'
                      ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-white'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  Published
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full sm:w-auto">
              <Link
                href="/admin"
                className="flex-1 sm:flex-initial rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-center text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow shadow-orange-500/10 hover:from-amber-500 hover:to-orange-600 disabled:opacity-50 active:scale-[0.98]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : status === 'published' ? (
                  <>
                    <Send className="h-4 w-4" />
                    Publish Post
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Draft
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </main>
    </div>
  );
}
