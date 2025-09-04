'use server';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth');
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname.startsWith('/login');

  // If trying to access admin route without auth cookie, redirect to login
  if (isAdminRoute && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If trying to access login route with auth cookie, redirect to admin
  if (isLoginRoute && authCookie) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/login'],
}
