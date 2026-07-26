import { type NextRequest } from 'next/server';
import crypto from 'crypto';
import { getPool } from '@/lib/db';
import { signJwt } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return Response.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const pool = getPool();
    const connection = await pool.getConnection();

    try {
      // Check if email already exists
      const [existingUsers]: any = await connection.query(
        'SELECT id FROM users WHERE LOWER(email) = LOWER(?)',
        [email]
      );

      if (existingUsers.length > 0) {
        return Response.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        );
      }

      // Hash password using SHA-256 to match login logic
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

      // Default role to 'author' so they can publish immediately
      const role: 'author' = 'author'; 
      const createdAt = new Date();

      const [result]: any = await connection.query(
        'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
        [name, email, passwordHash, role, createdAt]
      );

      const userId = result.insertId;

      // Generate JWT
      const tokenPayload = {
        userId,
        email,
        role,
        name
      };
      
      const token = signJwt(tokenPayload, 86400); // 1 day expiry

      const response = Response.json({
        message: 'Registration successful',
        user: {
          id: userId,
          name,
          email,
          role
        },
        token
      }, { status: 201 });

      // Set auth cookie
      response.headers.append(
        'Set-Cookie',
        `token=${token}; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax`
      );

      return response;

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error in register handler:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
