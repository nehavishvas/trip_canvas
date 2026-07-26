import { NextRequest } from 'next/server';
import { readDb, writeDb, Blog, BlogTag, Media } from '@/lib/db';
import { verifyJwt } from '@/lib/jwt';
import { cookies } from 'next/headers';

// Helper to generate slugs
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         // Replace spaces with -
    .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
    .replace(/\-\-+/g, '-');      // Replace multiple - with single -
}

// GET all blogs (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get('category');
    const tagSlug = searchParams.get('tag');
    const authorIdStr = searchParams.get('author');
    const search = searchParams.get('search');
    const statusQuery = searchParams.get('status') || 'published'; // Default: published

    const db = await readDb();
    let filteredBlogs = [...db.blogs];

    // Determine authorization status to check if they can see drafts
    let canSeeDrafts = false;
    let currentUser: any = null;
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
      if (token) {
        const payload = verifyJwt(token);
        if (payload && (payload.role === 'admin' || payload.role === 'author')) {
          canSeeDrafts = true;
          currentUser = payload;
        }
      }
    } catch (_) {
      // Ignore auth parsing errors for public list
    }

    // Apply status filter
    if (statusQuery === 'published') {
      filteredBlogs = filteredBlogs.filter(b => b.status === 'published');
    } else if (statusQuery === 'draft') {
      if (canSeeDrafts) {
        filteredBlogs = filteredBlogs.filter(b => b.status === 'draft');
        // Authors can only see their own drafts, admins see all drafts
        if (currentUser && currentUser.role === 'author') {
          filteredBlogs = filteredBlogs.filter(b => b.author_id === currentUser.userId);
        }
      } else {
        return Response.json({ error: 'Unauthorized to view drafts' }, { status: 403 });
      }
    } else if (statusQuery === 'all') {
      if (canSeeDrafts) {
        // Authors see all published + their own drafts
        if (currentUser && currentUser.role === 'author') {
          filteredBlogs = filteredBlogs.filter(b => b.status === 'published' || b.author_id === currentUser.userId);
        }
      } else {
        // Public sees only published
        filteredBlogs = filteredBlogs.filter(b => b.status === 'published');
      }
    }

    // Filter by category slug
    if (categorySlug) {
      const category = db.categories.find(c => c.slug === categorySlug);
      if (category) {
        filteredBlogs = filteredBlogs.filter(b => b.category_id === category.id);
      } else {
        // Category doesn't exist, return empty list
        filteredBlogs = [];
      }
    }

    // Filter by tag slug
    if (tagSlug) {
      const tag = db.tags.find(t => t.slug === tagSlug);
      if (tag) {
        const blogIdsWithTag = db.blog_tags
          .filter(bt => bt.tag_id === tag.id)
          .map(bt => bt.blog_id);
        filteredBlogs = filteredBlogs.filter(b => blogIdsWithTag.includes(b.id));
      } else {
        filteredBlogs = [];
      }
    }

    // Filter by author ID
    if (authorIdStr) {
      const authorId = parseInt(authorIdStr, 10);
      if (!isNaN(authorId)) {
        filteredBlogs = filteredBlogs.filter(b => b.author_id === authorId);
      }
    }

    // Filter by text search (title & content)
    if (search) {
      const query = search.toLowerCase();
      filteredBlogs = filteredBlogs.filter(
        b => b.title.toLowerCase().includes(query) || b.content.toLowerCase().includes(query)
      );
    }

    // Hydrate each blog with Author, Category, Tags, Media
    const hydratedBlogs = filteredBlogs.map(blog => {
      const author = db.users.find(u => u.id === blog.author_id);
      const category = db.categories.find(c => c.id === blog.category_id);
      
      const tagIds = db.blog_tags
        .filter(bt => bt.blog_id === blog.id)
        .map(bt => bt.tag_id);
      const tags = db.tags.filter(t => tagIds.includes(t.id));

      const media = db.media.filter(m => m.blog_id === blog.id);

      return {
        ...blog,
        author: author ? { id: author.id, name: author.name, email: author.email, role: author.role } : null,
        category,
        tags,
        media
      };
    });

    // Sort by created_at desc (newest first)
    hydratedBlogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return Response.json({ blogs: hydratedBlogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create blog post
export async function POST(request: Request) {
  try {
    // Authenticate user
    let token = '';
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value || '';
    }

    if (!token) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = verifyJwt(token);
    if (!payload || (payload.role !== 'admin' && payload.role !== 'author')) {
      return Response.json({ error: 'Unauthorized. Admin or Author role required' }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, category_id, tags = [], status = 'draft', media = [] } = body;

    if (!title || !content || !category_id) {
      return Response.json({ error: 'Title, content, and category are required' }, { status: 400 });
    }

    const db = await readDb();

    // Verify category exists
    const category = db.categories.find(c => c.id === parseInt(category_id, 10));
    if (!category) {
      return Response.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    // Generate Slug
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (db.blogs.find(b => b.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newBlogId = db.blogs.length > 0 ? Math.max(...db.blogs.map(b => b.id)) + 1 : 1;
    const now = new Date().toISOString();

    const newBlog: Blog = {
      id: newBlogId,
      title,
      slug,
      content,
      category_id: parseInt(category_id, 10),
      author_id: payload.userId,
      status: status === 'published' ? 'published' : 'draft',
      created_at: now,
      updated_at: now
    };

    db.blogs.push(newBlog);

    // Save associated tags
    let tagCounter = db.blog_tags.length > 0 ? Math.max(...db.blog_tags.map(bt => bt.id)) + 1 : 1;
    tags.forEach((tagId: number) => {
      const tagExists = db.tags.find(t => t.id === tagId);
      if (tagExists) {
        db.blog_tags.push({
          id: tagCounter++,
          blog_id: newBlogId,
          tag_id: tagId
        });
      }
    });

    // Save associated media
    let mediaCounter = db.media.length > 0 ? Math.max(...db.media.map(m => m.id)) + 1 : 1;
    media.forEach((item: { file_url: string; file_type: 'image' | 'video'; file_name: string }) => {
      db.media.push({
        id: mediaCounter++,
        blog_id: newBlogId,
        file_url: item.file_url,
        file_type: item.file_type || 'image',
        file_name: item.file_name || 'upload',
        created_at: now
      });
    });

    await writeDb(db);

    return Response.json({
      message: 'Blog post created successfully',
      blog: {
        ...newBlog,
        category,
        tags: db.tags.filter(t => tags.includes(t.id)),
        media: db.media.filter(m => m.blog_id === newBlogId)
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating blog:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
