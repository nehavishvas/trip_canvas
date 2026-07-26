import crypto from 'crypto';

const SECRET_KEY = process.env.JWT_SECRET || 'antigravity-blogging-platform-jwt-secret-key-2026';

export interface JwtPayload {
  userId: number;
  email: string;
  role: 'admin' | 'author' | 'user';
  name: string;
  exp: number; // Expiration timestamp in seconds
}

/**
 * Base64url encode helper
 */
function base64urlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Base64url decode helper
 */
function base64urlDecode(str: string): string {
  // Add padding if missing
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Signs a JWT payload
 */
export function signJwt(payload: Omit<JwtPayload, 'exp'>, expiresInSeconds: number = 86400): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload: JwtPayload = { ...payload, exp };

  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(fullPayload));

  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(signatureInput)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies a JWT token and returns the parsed payload if valid, otherwise null
 */
export function verifyJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;

    // Verify signature
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(signatureInput)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return null;
    }

    const payloadStr = base64urlDecode(encodedPayload);
    const payload = JSON.parse(payloadStr) as JwtPayload;

    // Check expiration
    const currentTimeSeconds = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTimeSeconds) {
      return null; // Expired
    }

    return payload;
  } catch (error) {
    console.error('Error verifying JWT token:', error);
    return null;
  }
}
