import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      // Not logged in, redirect to login page
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    try {
      // Decode token payload (middle part of JWT) without full crypto verification
      // (Full cryptographic signature verification happens on API routes and Server Pages)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token structure');
      }

      const payloadBase64 = parts[1];
      // Decode base64url
      let base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      
      const payloadStr = atob(base64);
      const payload = JSON.parse(payloadStr);

      // Check expiry
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        throw new Error('Token expired');
      }

      // Check role permissions (author or admin)
      if (payload.role !== 'admin' && payload.role !== 'author') {
        throw new Error('Insufficient permissions');
      }

      // Everything looks ok
      return NextResponse.next();
    } catch (error) {
      console.error('Proxy token check failed:', error);
      // Clean cookie and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" in proxy.md to learn more
export const config = {
  matcher: ['/admin/:path*'],
};
