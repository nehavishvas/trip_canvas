'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { 
  FileText, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  Loader2,
  FolderOpen,
  UserCheck
} from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  slug: string;
  created_at: string;
  status: 'draft' | 'published';
  author: { id: number; name: string } | null;
  category: { id: number; name: string } | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      // Fetch blogs. Admins see all, authors see only their own.
      const authorFilter = user?.role === 'author' ? { author: user.id } : {};
      const data = await api.getBlogs({ status: 'all', ...authorFilter });
      if (data && data.blogs) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Failed to load dashboard blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user || (user.role !== 'admin' && user.role !== 'author')) {
        router.push('/login');
      } else {
        fetchBlogs();
      }
    }
  }, [user, authLoading, router]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    
    setDeletingId(id);
    try {
      await api.deleteBlog(id);
      setBlogs(blogs.filter(b => b.id !== id));
    } catch (error) {
      alert('Failed to delete blog post');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (blog: Blog) => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    try {
      await api.updateBlog(blog.id, { status: newStatus });
      setBlogs(blogs.map(b => b.id === blog.id ? { ...b, status: newStatus } : b));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  // Filtered list based on search term & status toggle
  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && b.status === statusFilter;
  });

  // Calculate statistics
  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.status === 'published').length,
    drafts: blogs.filter(b => b.status === 'draft').length,
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
          <p className="text-sm text-zinc-500">Loading dashboard data...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Dashboard Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Welcome back, <span className="font-semibold text-zinc-700 dark:text-zinc-300">{user?.name}</span> ({user?.role})
            </p>
          </div>
          <Link
            href="/admin/create"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow shadow-orange-500/10 transition-all hover:from-amber-500 hover:to-orange-600 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Create New Blog
          </Link>
        </div>

        {/* Statistic Cards Panel */}
        <section className="grid gap-5 grid-cols-1 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 flex items-center gap-4">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Total Posts</span>
              <span className="text-2xl font-black text-zinc-900 dark:text-white">{stats.total}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 flex items-center gap-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Published</span>
              <span className="text-2xl font-black text-zinc-900 dark:text-white">{stats.published}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 flex items-center gap-4">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Drafts</span>
              <span className="text-2xl font-black text-zinc-900 dark:text-white">{stats.drafts}</span>
            </div>
          </div>
        </section>

        {/* Filters and Manager Table */}
        <section className="rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-950">
          
          {/* Table Header Filter Row */}
          <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Toggle tabs */}
            <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900">
              {(['all', 'published', 'draft'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-semibold capitalize transition-all ${
                    statusFilter === tab
                      ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-white'
                      : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-200'
                  }`}
                >
                  {tab === 'all' ? 'All Posts' : tab}
                </button>
              ))}
            </div>

            {/* Local table search input */}
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute top-2.5 left-3.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2 pr-4 pl-10 text-xs text-zinc-900 outline-none hover:border-zinc-300 focus:border-amber-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:border-zinc-700 dark:focus:border-amber-400"
              />
            </div>
          </div>

          {/* Table list */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] uppercase font-bold text-zinc-400 dark:border-zinc-900 dark:bg-zinc-900/10">
                  <th className="py-4 px-6">Blog Post</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Author</th>
                  <th className="py-4 px-6">Date Created</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 px-6 text-center text-sm text-zinc-400">
                      No blog posts match your selection. Write a new one to get started!
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="text-xs transition-colors hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10">
                      
                      {/* Post Title */}
                      <td className="py-4 px-6 font-semibold text-zinc-900 dark:text-white max-w-xs truncate">
                        <Link href={`/blog/${blog.slug}`} className="hover:underline flex items-center gap-1.5">
                          {blog.title}
                          <ExternalLink className="h-3 w-3 text-zinc-400" />
                        </Link>
                      </td>
                      
                      {/* Category */}
                      <td className="py-4 px-6 text-zinc-500 dark:text-zinc-400">
                        {blog.category?.name || 'Uncategorized'}
                      </td>
                      
                      {/* Author */}
                      <td className="py-4 px-6 text-zinc-500 dark:text-zinc-400">
                        {blog.author?.name || 'Unknown'}
                      </td>
                      
                      {/* Date */}
                      <td className="py-4 px-6 text-zinc-400">
                        {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      {/* Status Badges */}
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(blog)}
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold border transition-colors ${
                            blog.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50'
                              : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 dark:hover:bg-zinc-800'
                          }`}
                          title="Click to toggle status"
                        >
                          {blog.status}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap space-x-1">
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="inline-flex rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                          title="View post"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/edit/${blog.id}`}
                          className="inline-flex rounded-lg p-1.5 text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
                          title="Edit post"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          disabled={deletingId === blog.id}
                          className="inline-flex rounded-lg p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30"
                          title="Delete post"
                        >
                          {deletingId === blog.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </section>

      </main>
    </div>
  );
}
