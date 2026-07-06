import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('access_token');
  const hasAccessToken = !!tokenCookie?.value;


  // If user has token and tries to access login, redirect to dashboard
  if ((pathname === '/' || pathname === '/register') && hasAccessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user doesn't have token and tries to access protected routes, redirect to login
  if (pathname.startsWith('/dashboard') && !hasAccessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/register', '/dashboard/:path*']
};