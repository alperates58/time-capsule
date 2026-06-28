import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // If accessing /admin or /api/admin, require auth
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Exclude API routes within admin if any (currently none), or static assets
    
    // Exclude /admin/login from protection
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Add noindex header to all admin routes
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');

    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isValid = token ? await verifyAdminToken(token) : false;

    if (!isValid) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
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
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
