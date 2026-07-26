import { type NextRequest } from 'next/server';
import crypto from 'crypto';
import { readDb } from '@/lib/db';
import { signJwt } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const db = await readDb();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compute SHA-256 of incoming password
    const hashed = crypto.createHash('sha256').update(password).digest('hex');

    if (hashed !== user.password_hash) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Sign JWT
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    const token = signJwt(tokenPayload, 86400); // 1 day expiry

    // Respond with user and token, setting httpOnly cookie
    const response = Response.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });

    // Set cookie
    response.headers.append(
      'Set-Cookie',
      `token=${token}; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax`
    );

    return response;
  } catch (error) {
    console.error('Error in login handler:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
