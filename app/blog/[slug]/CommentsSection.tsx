'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { MessageSquare, Heart, Send } from 'lucide-react';

interface Comment {
  id: number;
  name: string;
  avatar: string;
  content: string;
  created_at: string;
}

interface CommentsSectionProps {
  blogId: number;
}

// Default initial comments to seed a blog's discussion if none exist in localStorage
const defaultComments: Comment[] = [
  {
    id: 1,
    name: "Marcus Vance",
    avatar: "M",
    content: "This was an incredibly detailed read! The photography recommendations were spot on. Squeezing through that tiny cave entry sounds super thrilling.",
    created_at: "2026-07-24T10:15:30.000Z"
  },
  {
    id: 2,
    name: "Sarah Lin",
    avatar: "S",
    content: "Excellent writeup. I really appreciate the emphasis on eco-tourism and regulations. El Nido is beautiful but keeping it pristine is critical.",
    created_at: "2026-07-24T11:45:00.000Z"
  }
];

export default function CommentsSection({ blogId }: CommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [likes, setLikes] = useState(12);
  const [hasLiked, setHasLiked] = useState(false);

  // Sync state from localStorage on client side mount and when blogId changes
  useEffect(() => {
    const commentsKey = `comments_blog_${blogId}`;
    const likesKey = `likes_blog_${blogId}`;
    const hasLikedKey = `has_liked_blog_${blogId}`;

    const savedComments = localStorage.getItem(commentsKey);
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (e) {
        setComments(defaultComments);
      }
    } else {
      setComments(defaultComments);
      localStorage.setItem(commentsKey, JSON.stringify(defaultComments));
    }

    const savedLikes = localStorage.getItem(likesKey);
    if (savedLikes) {
      setLikes(parseInt(savedLikes, 10));
    } else {
      setLikes(12);
    }

    const savedHasLiked = localStorage.getItem(hasLikedKey);
    setHasLiked(savedHasLiked === 'true');
  }, [blogId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const name = user ? user.name : (authorName.trim() || 'Anonymous Reader');
    const avatar = name.charAt(0).toUpperCase();

    const newComment: Comment = {
      id: Date.now(),
      name,
      avatar,
      content: commentText,
      created_at: new Date().toISOString()
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem(`comments_blog_${blogId}`, JSON.stringify(updatedComments));

    setCommentText('');
    if (!user) setAuthorName('');
  };

  const handleLike = () => {
    let newLikes = likes;
    let newHasLiked = !hasLiked;
    if (hasLiked) {
      newLikes = likes - 1;
    } else {
      newLikes = likes + 1;
    }
    setLikes(newLikes);
    setHasLiked(newHasLiked);
    localStorage.setItem(`likes_blog_${blogId}`, newLikes.toString());
    localStorage.setItem(`has_liked_blog_${blogId}`, newHasLiked.toString());
  };

  return (
    <div className="space-y-6">
      {/* Interaction counters */}
      <div className="flex items-center gap-6 border-b border-zinc-100 pb-4 dark:border-zinc-900">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
            hasLiked ? 'text-rose-500' : 'text-zinc-500 hover:text-rose-500 dark:text-zinc-400'
          }`}
        >
          <Heart className={`h-5 w-5 ${hasLiked ? 'fill-rose-500' : ''}`} />
          <span>{likes} Likes</span>
        </button>
        <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          <MessageSquare className="h-5 w-5" />
          <span>{comments.length} Comments</span>
        </div>
      </div>

      {/* Write Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Join the discussion</h4>
        
        {/* Name Input (only if not logged in) */}
        {!user && (
          <input
            type="text"
            placeholder="Your Name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full max-w-xs rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          />
        )}

        <div className="relative">
          <textarea
            rows={3}
            placeholder={user ? `Comment as ${user.name}...` : "Write a comment..."}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            className="w-full rounded-xl border border-zinc-200 bg-white p-3 pr-12 text-sm text-zinc-900 outline-none transition-all focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          />
          <button
            type="submit"
            className="absolute bottom-3 right-3 rounded-full bg-indigo-600 p-2 text-white hover:bg-indigo-700 active:scale-95 transition-all"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="mt-8 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3 text-sm p-4 bg-zinc-50 rounded-2xl dark:bg-zinc-900/30">
            {/* Avatar block */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
              {comment.avatar}
            </div>
            
            {/* Comment details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-900 dark:text-white">{comment.name}</span>
                <span className="text-[10px] text-zinc-400">
                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
