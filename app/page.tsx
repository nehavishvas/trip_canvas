import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BlogCard from '@/components/BlogCard';
import Carousel from '@/components/Carousel';
import Footer from '@/components/Footer';
import { readDb } from '@/lib/db';
import { 
  Search, 
  Calendar, 
  User, 
  Tag, 
  SlidersHorizontal, 
  RefreshCw, 
  Globe, 
  ArrowRight,
  Compass,
  Cpu,
  Coffee,
  Palette,
  Sparkles,
  Clock,
  BookOpen
} from 'lucide-react';

interface HomePageProps {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    author?: string;
    search?: string;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  // Await the searchParams promise (Next.js 16 convention)
  const filters = await searchParams;
  const activeCategory = filters.category || '';
  const activeTag = filters.tag || '';
  const activeAuthorId = filters.author ? parseInt(filters.author, 10) : null;
  const activeSearch = filters.search || '';

  const db = await readDb();
  
  // Only show published blogs on the public homepage
  let blogs = db.blogs.filter(b => b.status === 'published');

  // Filter by category
  if (activeCategory) {
    const category = db.categories.find(c => c.slug === activeCategory);
    if (category) {
      blogs = blogs.filter(b => b.category_id === category.id);
    } else {
      blogs = [];
    }
  }

  // Filter by tag
  if (activeTag) {
    const tag = db.tags.find(t => t.slug === activeTag);
    if (tag) {
      const blogIdsWithTag = db.blog_tags
        .filter(bt => bt.tag_id === tag.id)
        .map(bt => bt.blog_id);
      blogs = blogs.filter(b => blogIdsWithTag.includes(b.id));
    } else {
      blogs = [];
    }
  }

  // Filter by author
  if (activeAuthorId !== null && !isNaN(activeAuthorId)) {
    blogs = blogs.filter(b => b.author_id === activeAuthorId);
  }

  // Filter by text search
  if (activeSearch) {
    const query = activeSearch.toLowerCase();
    blogs = blogs.filter(
      b => b.title.toLowerCase().includes(query) || b.content.toLowerCase().includes(query)
    );
  }

  // Hydrate blogs with author, category, tags, and media
  const hydratedBlogs = blogs.map(blog => {
    const author = db.users.find(u => u.id === blog.author_id);
    const category = db.categories.find(c => c.id === blog.category_id);
    const tagIds = db.blog_tags.filter(bt => bt.blog_id === blog.id).map(bt => bt.tag_id);
    const blogTags = db.tags.filter(t => tagIds.includes(t.id));
    const media = db.media.filter(m => m.blog_id === blog.id);

    return {
      ...blog,
      author,
      category,
      tags: blogTags,
      media
    };
  });

  // Sort by created_at desc
  hydratedBlogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Featured Blog Post (first published blog post)
  const featuredBlog = hydratedBlogs[0];
  const remainingBlogs = hydratedBlogs.slice(1);

  const hasActiveFilters = activeCategory || activeTag || activeAuthorId || activeSearch;

  // Build query helper for url updates
  const getQueryUrl = (newFilters: { category?: string | null; tag?: string | null; author?: string | null; search?: string | null }) => {
    const current = { ...filters };
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val === null) {
        delete current[key as keyof typeof current];
      } else {
        current[key as keyof typeof current] = val;
      }
    });

    const params = new URLSearchParams();
    Object.entries(current).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });

    const queryStr = params.toString();
    return `/${queryStr ? `?${queryStr}` : ''}`;
  };

  // Helper for category-specific styling/icons
  const getCategoryMeta = (slug: string) => {
    switch (slug.toLowerCase()) {
      case 'travel':
        return { icon: Compass, color: 'text-amber-600 dark:text-amber-400 border-amber-500/20 bg-amber-500/5' };
      case 'technology':
        return { icon: Cpu, color: 'text-indigo-600 dark:text-indigo-400 border-indigo-500/20 bg-indigo-500/5' };
      case 'lifestyle':
        return { icon: Coffee, color: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/5' };
      case 'design':
        return { icon: Palette, color: 'text-rose-600 dark:text-rose-400 border-rose-500/20 bg-rose-500/5' };
      default:
        return { icon: Sparkles, color: 'text-violet-600 dark:text-violet-400 border-violet-500/20 bg-violet-500/5' };
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#faf8f5] dark:bg-[#0c0b0a] text-zinc-900 dark:text-zinc-50">
      
      {/* Decorative Ambient Background Blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-amber-400/10 dark:bg-amber-500/5 blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-[40%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-indigo-400/10 dark:bg-violet-600/5 blur-[130px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute bottom-[10%] left-[20%] w-[30rem] h-[30rem] rounded-full bg-rose-400/5 dark:bg-rose-500/3 blur-[120px] pointer-events-none -z-10" />

      {/* Site Header */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* HERO SECTION: Editorial Featured Post (only show when no filters are active) */}
        {!hasActiveFilters && featuredBlog && (
          <section className="relative overflow-hidden rounded-[2.5rem] bg-[#121110] text-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/5 group">
            {/* Ambient Background Glow inside Hero */}
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 p-8 sm:p-12 lg:p-16 items-center relative z-10">
              
              {/* Left Column: Text & Content (7 columns on desktop) */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 px-3.5 py-1.5 text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                    <Sparkles className="h-3 w-3" /> Editor&apos;s Pick
                  </span>
                  {featuredBlog.category && (
                    <span className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1 text-[10px] font-bold tracking-wider text-zinc-300 uppercase">
                      {featuredBlog.category.name}
                    </span>
                  )}
                </div>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight leading-[1.1] text-zinc-100 group-hover:text-amber-100 transition-colors">
                  <Link href={`/blog/${featuredBlog.slug}`}>
                    {featuredBlog.title}
                  </Link>
                </h2>
                
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed line-clamp-3 max-w-xl">
                  {featuredBlog.content.replace(/[#*`_]/g, '')}
                </p>
                
                {/* Author & Meta */}
                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5 text-xs text-zinc-400">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-extrabold shadow-sm">
                      {featuredBlog.author?.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-200">{featuredBlog.author?.name}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Writer</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-zinc-500" />
                    <span>{new Date(featuredBlog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  <Link
                    href={`/blog/${featuredBlog.slug}`}
                    className="sm:ml-auto inline-flex items-center gap-2 rounded-full bg-white text-zinc-950 px-6 py-3.5 text-xs font-extrabold shadow-lg transition-all duration-300 hover:bg-amber-400 hover:text-zinc-950 hover:shadow-amber-500/20 active:scale-95 group/btn"
                  >
                    Read Journal
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Hero Carousel Banner (5 columns on desktop) */}
              <div className="lg:col-span-5 relative">
                {/* Decorative border Frame */}
                <div className="absolute -inset-1.5 rounded-[2rem] bg-gradient-to-tr from-amber-500/25 to-indigo-500/25 opacity-70 blur-sm group-hover:opacity-100 transition-opacity" />
                
                <div className="relative w-full overflow-hidden rounded-[1.8rem] bg-zinc-850 shadow-2xl">
                  <Carousel media={featuredBlog.media} />
                </div>
              </div>

            </div>
          </section>
        )}

        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* LEFT: Blog Post Feed (8 columns) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Horizontal Categories Navigator */}
            <div className="border-b border-zinc-200/50 dark:border-zinc-800/60 pb-5 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
              <div className="flex gap-2.5">
                <Link
                  href={getQueryUrl({ category: null })}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                    !activeCategory
                      ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white shadow-md'
                      : 'bg-white/50 text-zinc-600 border-zinc-200/60 hover:bg-zinc-100 dark:bg-zinc-900/30 dark:text-zinc-400 dark:border-zinc-800/80 dark:hover:bg-zinc-800/80'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  All Journals
                </Link>
                {db.categories.map(cat => {
                  const meta = getCategoryMeta(cat.slug);
                  const Icon = meta.icon;
                  const isActive = activeCategory === cat.slug;
                  return (
                    <Link
                      key={cat.id}
                      href={getQueryUrl({ category: cat.slug })}
                      className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                        isActive
                          ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white shadow-md'
                          : `bg-white/50 border-zinc-200/60 text-zinc-700 dark:bg-zinc-900/30 dark:border-zinc-800/80 dark:text-zinc-300 ${meta.color}`
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      {cat.name}
                    </Link>
                  );
                })}
              </div>

              {hasActiveFilters && (
                <Link
                  href="/"
                  className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 dark:text-red-400 transition-colors shrink-0 bg-red-500/5 px-4 py-2.5 rounded-full border border-red-500/10 hover:border-red-500/30"
                >
                  <RefreshCw className="h-3.5 w-3.5 animate-spin-reverse" />
                  Reset
                </Link>
              )}
            </div>

            {/* Blogs Feed Header */}
            {hasActiveFilters && (
              <div className="text-zinc-600 dark:text-zinc-400 text-sm">
                Found <span className="font-bold text-zinc-900 dark:text-white">{hydratedBlogs.length}</span> publications matching your search:
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {activeSearch && (
                    <span className="rounded-lg bg-zinc-200/50 border border-zinc-300/30 px-3 py-1 text-xs dark:bg-zinc-900 dark:border-zinc-800">
                      Keyword: &ldquo;{activeSearch}&rdquo;
                    </span>
                  )}
                  {activeCategory && (
                    <span className="rounded-lg bg-zinc-200/50 border border-zinc-300/30 px-3 py-1 text-xs dark:bg-zinc-900 dark:border-zinc-800">
                      Category: {db.categories.find(c => c.slug === activeCategory)?.name}
                    </span>
                  )}
                  {activeTag && (
                    <span className="rounded-lg bg-zinc-200/50 border border-zinc-300/30 px-3 py-1 text-xs dark:bg-zinc-900 dark:border-zinc-800">
                      Tag: #{db.tags.find(t => t.slug === activeTag)?.name}
                    </span>
                  )}
                  {activeAuthorId && (
                    <span className="rounded-lg bg-zinc-200/50 border border-zinc-300/30 px-3 py-1 text-xs dark:bg-zinc-900 dark:border-zinc-800">
                      Author: {db.users.find(u => u.id === activeAuthorId)?.name}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Grid display */}
            {hydratedBlogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-[2rem] bg-white/40 border border-dashed border-zinc-200 dark:bg-zinc-900/10 dark:border-zinc-800/80 backdrop-blur-sm">
                <Search className="h-10 w-10 text-zinc-300 dark:text-zinc-700 animate-pulse" />
                <h3 className="mt-4 text-lg font-bold text-zinc-800 dark:text-zinc-200">No journals found</h3>
                <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500 max-w-sm">
                  Try refining your search keyword or clearing the filters above.
                </p>
                {hasActiveFilters && (
                  <Link
                    href="/"
                    className="mt-6 rounded-full bg-zinc-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 shadow-md"
                  >
                    Clear All Filters
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2">
                {hydratedBlogs.map(blog => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Advanced Filter Sidebar (4 columns) */}
          <aside className="lg:col-span-4 space-y-8 lg:border-l lg:border-zinc-200/50 lg:pl-8 dark:lg:border-zinc-800/60">
            <div className="sticky top-24 space-y-8">
              
              <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white border-b border-zinc-200/50 dark:border-zinc-800/60 pb-3">
                <SlidersHorizontal className="h-4 w-4 text-amber-500" />
                <span className="uppercase tracking-widest text-[11px] font-black">Explore Canvas</span>
              </div>

              {/* Tags Panel */}
              <div className="space-y-4 rounded-[2rem] bg-white/40 dark:bg-zinc-900/20 border border-zinc-200/50 dark:border-zinc-800/80 p-6 backdrop-blur-md">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-amber-500" /> Discover Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {db.tags.map(tag => {
                    const isActive = activeTag === tag.slug;
                    return (
                      <Link
                        key={tag.id}
                        href={getQueryUrl({ tag: isActive ? null : tag.slug })}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all duration-300 ${
                          isActive
                            ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white shadow-sm'
                            : 'bg-white/60 text-zinc-600 border-zinc-200/70 hover:border-amber-500/20 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-850 dark:hover:bg-zinc-900'
                        }`}
                      >
                        #{tag.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Authors Panel */}
              <div className="space-y-4 rounded-[2rem] bg-white/40 dark:bg-zinc-900/20 border border-zinc-200/50 dark:border-zinc-800/80 p-6 backdrop-blur-md">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-amber-500" /> Featured Writers
                </h4>
                <div className="flex flex-col gap-2">
                  {db.users.filter(u => u.role === 'admin' || u.role === 'author').map(author => {
                    const isActive = activeAuthorId === author.id;
                    return (
                      <Link
                        key={author.id}
                        href={getQueryUrl({ author: isActive ? null : author.id.toString() })}
                        className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-semibold border transition-all duration-300 ${
                          isActive
                            ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white shadow-sm'
                            : 'bg-white/60 text-zinc-700 border-zinc-200/70 hover:border-amber-500/20 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-350 dark:border-zinc-850 dark:hover:bg-zinc-900'
                        }`}
                      >
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-extrabold text-white bg-gradient-to-tr ${isActive ? 'from-zinc-800 to-zinc-900 dark:from-zinc-100 dark:to-white text-zinc-950' : 'from-amber-400 to-orange-500'}`}>
                          {author.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-semibold">{author.name}</p>
                          <p className="text-[9px] text-zinc-400 uppercase tracking-wider">Contributor</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Stats Summary Widget */}
              <div className="rounded-[2rem] bg-gradient-to-tr from-amber-500/10 to-indigo-500/10 border border-amber-500/15 p-6 backdrop-blur-md">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-amber-500" /> Platform Insights
                </h4>
                <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-2xl bg-white/70 p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-white/40 dark:bg-zinc-950/70 dark:border-white/5">
                    <span className="block text-2xl font-black text-amber-600 dark:text-amber-400">
                      {db.blogs.filter(b => b.status === 'published').length}
                    </span>
                    <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Journals</span>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-white/40 dark:bg-zinc-950/70 dark:border-white/5">
                    <span className="block text-2xl font-black text-amber-600 dark:text-amber-400">
                      {db.media.length}
                    </span>
                    <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Galleries</span>
                  </div>
                </div>
              </div>

            </div>
          </aside>
          
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
