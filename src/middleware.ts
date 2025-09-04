'use server';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth');
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/login';

  // If trying to access admin route without auth, redirect to login
  if (isAdminRoute && (!authCookie || authCookie.value !== 'true')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access login route with auth, redirect to admin
  if (isLoginRoute && authCookie && authCookie.value === 'true') {
     return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/login'],
}
