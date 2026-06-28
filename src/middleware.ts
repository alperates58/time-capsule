import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // If accessing /admin, require auth
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Exclude API routes within admin if any (currently none), or static assets
    
    // Add noindex header to all admin routes
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');

    // Exclude /admin/login from protection
    if (request.nextUrl.pathname === '/admin/login') {
      return response;
    }

    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isValid = token ? await verifyAdminToken(token) : false;

    if (!isValid) {
      const loginUrl = new URL('/admin/login', request.url);
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return redirectResponse;
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
