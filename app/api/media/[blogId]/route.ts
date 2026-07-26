import { type NextRequest } from 'next/server';
import { readDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    const { blogId } = await params;
    const id = parseInt(blogId, 10);
    if (isNaN(id)) {
      return Response.json({ error: 'Invalid blog ID' }, { status: 400 });
    }

    const db = await readDb();
    const media = db.media.filter(m => m.blog_id === id);

    return Response.json({ media });
  } catch (error) {
    console.error('Error fetching blog media:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
