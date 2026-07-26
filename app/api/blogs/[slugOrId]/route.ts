import { NextRequest } from 'next/server';
import { readDb, writeDb, Blog, BlogTag, Media } from '@/lib/db';
import { verifyJwt } from '@/lib/jwt';
import { cookies } from 'next/headers';

// Helper to check if string is numeric
function isNumeric(value: string) {
  return /^\d+$/.test(value);
}

// GET single blog by slug or ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slugOrId: string }> }
) {
  try {
    const { slugOrId } = await params;
    const db = await readDb();

    let blog: Blog | undefined;
    if (isNumeric(slugOrId)) {
      const id = parseInt(slugOrId, 10);
      blog = db.blogs.find(b => b.id === id);
    }

    if (!blog) {
      blog = db.blogs.find(b => b.slug === slugOrId);
    }

    if (!blog) {
      return Response.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Auth check if post is a draft
    if (blog.status === 'draft') {
      let authorized = false;
      try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (token) {
          const payload = verifyJwt(token);
          if (payload && (payload.role === 'admin' || (payload.role === 'author' && blog.author_id === payload.userId))) {
            authorized = true;
          }
        }
      } catch (_) {}

      if (!authorized) {
        return Response.json({ error: 'Unauthorized to view this draft' }, { status: 403 });
      }
    }

    // Hydrate
    const author = db.users.find(u => u.id === blog!.author_id);
    const category = db.categories.find(c => c.id === blog!.category_id);
    
    const tagIds = db.blog_tags
      .filter(bt => bt.blog_id === blog!.id)
      .map(bt => bt.tag_id);
    const tags = db.tags.filter(t => tagIds.includes(t.id));

    const media = db.media.filter(m => m.blog_id === blog!.id);

    const hydratedBlog = {
      ...blog,
      author: author ? { id: author.id, name: author.name, email: author.email, role: author.role } : null,
      category,
      tags,
      media
    };

    return Response.json({ blog: hydratedBlog });
  } catch (error) {
    console.error('Error fetching single blog:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update blog by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slugOrId: string }> }
) {
  try {
    const { slugOrId } = await params;
    
    // We only support updating by numeric ID via PUT
    if (!isNumeric(slugOrId)) {
      return Response.json({ error: 'Updating blogs requires a numeric ID' }, { status: 400 });
    }
    const blogId = parseInt(slugOrId, 10);

    // Authenticate
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
    if (!payload) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const db = await readDb();
    const blogIndex = db.blogs.findIndex(b => b.id === blogId);
    if (blogIndex === -1) {
      return Response.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const existingBlog = db.blogs[blogIndex];

    // Auth check: Admin can edit anything. Author can edit only their own posts.
    if (payload.role !== 'admin' && !(payload.role === 'author' && existingBlog.author_id === payload.userId)) {
      return Response.json({ error: 'Unauthorized to edit this post' }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, category_id, tags = [], status, media = [] } = body;

    // Update fields if provided
    if (title) {
      existingBlog.title = title;
      // Auto-update slug if title changes
      let baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      let slug = baseSlug;
      let counter = 1;
      while (db.blogs.find(b => b.slug === slug && b.id !== blogId)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      existingBlog.slug = slug;
    }
    if (content) existingBlog.content = content;
    if (category_id) {
      const catExists = db.categories.find(c => c.id === parseInt(category_id, 10));
      if (!catExists) {
        return Response.json({ error: 'Invalid category ID' }, { status: 400 });
      }
      existingBlog.category_id = parseInt(category_id, 10);
    }
    if (status === 'published' || status === 'draft') {
      existingBlog.status = status;
    }
    existingBlog.updated_at = new Date().toISOString();

    db.blogs[blogIndex] = existingBlog;

    // Update Tags (simple wipe and re-insert)
    db.blog_tags = db.blog_tags.filter(bt => bt.blog_id !== blogId);
    let tagCounter = db.blog_tags.length > 0 ? Math.max(...db.blog_tags.map(bt => bt.id)) + 1 : 1;
    tags.forEach((tagId: number) => {
      if (db.tags.find(t => t.id === tagId)) {
        db.blog_tags.push({
          id: tagCounter++,
          blog_id: blogId,
          tag_id: tagId
        });
      }
    });

    // Update Media if a list is provided (if media is passed, we overwrite associated media)
    if (body.media) {
      // Clean up old media
      db.media = db.media.filter(m => m.blog_id !== blogId);
      
      let mediaCounter = db.media.length > 0 ? Math.max(...db.media.map(m => m.id)) + 1 : 1;
      media.forEach((item: { file_url: string; file_type: 'image' | 'video'; file_name: string }) => {
        db.media.push({
          id: mediaCounter++,
          blog_id: blogId,
          file_url: item.file_url,
          file_type: item.file_type || 'image',
          file_name: item.file_name || 'upload',
          created_at: new Date().toISOString()
        });
      });
    }

    await writeDb(db);

    // Get updated tags and media
    const updatedTags = db.tags.filter(t => 
      db.blog_tags.filter(bt => bt.blog_id === blogId).map(bt => bt.tag_id).includes(t.id)
    );
    const updatedMedia = db.media.filter(m => m.blog_id === blogId);
    const category = db.categories.find(c => c.id === existingBlog.category_id);

    return Response.json({
      message: 'Blog post updated successfully',
      blog: {
        ...existingBlog,
        category,
        tags: updatedTags,
        media: updatedMedia
      }
    });

  } catch (error) {
    console.error('Error updating blog:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE blog by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slugOrId: string }> }
) {
  try {
    const { slugOrId } = await params;
    
    if (!isNumeric(slugOrId)) {
      return Response.json({ error: 'Deleting blogs requires a numeric ID' }, { status: 400 });
    }
    const blogId = parseInt(slugOrId, 10);

    // Authenticate
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
    if (!payload) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const db = await readDb();
    const blog = db.blogs.find(b => b.id === blogId);
    if (!blog) {
      return Response.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Auth check: Admin can delete anything. Author can delete only their own.
    if (payload.role !== 'admin' && !(payload.role === 'author' && blog.author_id === payload.userId)) {
      return Response.json({ error: 'Unauthorized to delete this post' }, { status: 403 });
    }

    // Delete blog
    db.blogs = db.blogs.filter(b => b.id !== blogId);
    // Delete blog tags
    db.blog_tags = db.blog_tags.filter(bt => bt.blog_id !== blogId);
    // Delete associated media
    db.media = db.media.filter(m => m.blog_id !== blogId);

    await writeDb(db);

    return Response.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
