import { cookies } from 'next/headers';
import { readDb } from '@/lib/db';
import { verifyJwt } from '@/lib/jwt';

export async function GET(request: Request) {
  try {
    let token = '';

    // 1. Try to get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // 2. Try to get token from Cookies if header is not present
    if (!token) {
      const cookieStore = await cookies();
      const tokenCookie = cookieStore.get('token');
      if (tokenCookie) {
        token = tokenCookie.value;
      }
    }

    if (!token) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const db = await readDb();
    const user = db.users.find(u => u.id === payload.userId);

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in auth/me route handler:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
