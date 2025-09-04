
'use server';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Firebase Authentication is handled client-side, and there's no server-side 
// cookie by default with the client SDK. A proper implementation for protecting
// routes on the server would involve Firebase Admin SDK and custom session cookies.
//
// To keep things simple for this context, we'll remove the middleware.
// Route protection will be handled client-side in the page/layout components
// by checking the auth state.

export function middleware(request: NextRequest) {
  return NextResponse.next();
}
 
export const config = {
  matcher: [],
}
