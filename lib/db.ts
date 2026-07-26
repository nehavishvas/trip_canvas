import mysql from 'mysql2/promise';

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'author' | 'user';
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  category_id: number;
  author_id: number;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface BlogTag {
  id: number;
  blog_id: number;
  tag_id: number;
}

export interface Media {
  id: number;
  blog_id: number;
  file_url: string;
  file_type: 'image' | 'video';
  file_name: string;
  created_at: string;
}

export interface Database {
  users: User[];
  categories: Category[];
  tags: Tag[];
  blogs: Blog[];
  blog_tags: BlogTag[];
  media: Media[];
}

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    const dbUrl = process.env.DATABASE_URL;
    console.log('--- NEXT.JS DB POOL INITIALIZATION ---');
    console.log('- Host:', process.env.DB_HOST || 'localhost (default)');
    console.log('- User:', process.env.DB_USER || 'root (default)');
    console.log('- Database:', process.env.DB_NAME || 'sql12833848');
    console.log('- Port:', process.env.DB_PORT || '3306 (default)');
    console.log('- Password Defined:', !!process.env.DB_PASSWORD);
    console.log('---------------------------------------');
    if (dbUrl) {
      pool = mysql.createPool(dbUrl);
    } else {
      pool = mysql.createPool({
        host: process.env.DB_HOST || 'sql12.freesqldatabase.com',
        user: process.env.DB_USER || 'sql12833848',
        password: process.env.DB_PASSWORD || '8J4mP5bBUl',
        database: process.env.DB_NAME || 'sql12833848',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      });
    }
  }
  return pool;
}

// Default fallback initial state
const defaultDb: Database = {
  users: [],
  categories: [],
  tags: [],
  blogs: [],
  blog_tags: [],
  media: []
};

// Formats timestamp properties from Date object to ISO string
function formatDate(val: any): string {
  if (val instanceof Date) {
    return val.toISOString();
  }
  return val || '';
}

export async function readDb(): Promise<Database> {
  try {
    const p = getPool();
    const [users] = await p.query('SELECT * FROM users');
    const [categories] = await p.query('SELECT * FROM categories');
    const [tags] = await p.query('SELECT * FROM tags');
    const [blogs] = await p.query('SELECT * FROM blogs');
    const [blog_tags] = await p.query('SELECT * FROM blog_tags');
    const [media] = await p.query('SELECT * FROM media');

    return {
      users: (users as any[]).map(u => ({
        ...u,
        created_at: formatDate(u.created_at)
      })),
      categories: categories as Category[],
      tags: tags as Tag[],
      blogs: (blogs as any[]).map(b => ({
        ...b,
        created_at: formatDate(b.created_at),
        updated_at: formatDate(b.updated_at)
      })),
      blog_tags: blog_tags as BlogTag[],
      media: (media as any[]).map(m => ({
        ...m,
        created_at: formatDate(m.created_at)
      }))
    };
  } catch (error) {
    console.error('Error reading database from MySQL, using fallback default database:', error);
    return defaultDb;
  }
}

export async function writeDb(db: Database): Promise<void> {
  const p = getPool();
  const connection = await p.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Sync Categories
    const [existingCategories] = await connection.query('SELECT id FROM categories') as any[];
    const sqlCatIds = existingCategories.map((c: any) => c.id);
    for (const cat of db.categories) {
      if (!sqlCatIds.includes(cat.id)) {
        await connection.query('INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)', [cat.id, cat.name, cat.slug]);
      }
    }

    // 2. Sync Tags
    const [existingTags] = await connection.query('SELECT id FROM tags') as any[];
    const sqlTagIds = existingTags.map((t: any) => t.id);
    for (const tag of db.tags) {
      if (!sqlTagIds.includes(tag.id)) {
        await connection.query('INSERT INTO tags (id, name, slug) VALUES (?, ?, ?)', [tag.id, tag.name, tag.slug]);
      }
    }

    // 3. Sync Blogs
    const [existingBlogs] = await connection.query('SELECT id FROM blogs') as any[];
    const dbBlogIds = db.blogs.map(b => b.id);
    const sqlBlogIds = existingBlogs.map((b: any) => b.id);

    // Delete blogs not in db.blogs
    for (const id of sqlBlogIds) {
      if (!dbBlogIds.includes(id)) {
        await connection.query('DELETE FROM blogs WHERE id = ?', [id]);
      }
    }
    // Insert or Update blogs
    for (const blog of db.blogs) {
      const formattedCreatedAt = blog.created_at ? new Date(blog.created_at) : new Date();
      const formattedUpdatedAt = blog.updated_at ? new Date(blog.updated_at) : new Date();
      if (!sqlBlogIds.includes(blog.id)) {
        await connection.query(
          `INSERT INTO blogs (id, title, slug, content, category_id, author_id, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [blog.id, blog.title, blog.slug, blog.content, blog.category_id, blog.author_id, blog.status, formattedCreatedAt, formattedUpdatedAt]
        );
      } else {
        await connection.query(
          `UPDATE blogs SET title = ?, slug = ?, content = ?, category_id = ?, author_id = ?, status = ?, updated_at = ?
           WHERE id = ?`,
          [blog.title, blog.slug, blog.content, blog.category_id, blog.author_id, blog.status, formattedUpdatedAt, blog.id]
        );
      }
    }

    // 4. Sync BlogTags
    await connection.query('DELETE FROM blog_tags');
    for (const bt of db.blog_tags) {
      await connection.query('INSERT INTO blog_tags (id, blog_id, tag_id) VALUES (?, ?, ?)', [bt.id, bt.blog_id, bt.tag_id]);
    }

    // 5. Sync Media
    await connection.query('DELETE FROM media');
    for (const m of db.media) {
      const formattedCreatedAt = m.created_at ? new Date(m.created_at) : new Date();
      await connection.query(
        `INSERT INTO media (id, blog_id, file_url, file_type, file_name, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [m.id, m.blog_id, m.file_url, m.file_type, m.file_name, formattedCreatedAt]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error('Error writing database to MySQL:', error);
    throw new Error('Failed to write data to MySQL database');
  } finally {
    connection.release();
  }
}
