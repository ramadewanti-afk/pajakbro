'use server';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth');
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/login';

  // If trying to access admin route without being authenticated, redirect to login
  if (isAdminRoute && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If trying to access login page while already authenticated, redirect to admin
  if (isLoginRoute && authCookie) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}
 
export const config = {
  matcher: ['/admin/:path*', '/login'],
}
