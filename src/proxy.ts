import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Orphaned self/* pages — redirect back to /self
const SELF_REDIRECTS = [
  '/self/planetary-speed',
  '/self/positions',
  '/self/wheel',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect orphaned routes to their parent
  for (const prefix of SELF_REDIRECTS) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      return NextResponse.redirect(new URL('/self', request.url));
    }
  }

  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    // Apply to all routes except static files, images, and Next internals
    '/((?!_next/static|_next/image|favicon.ico|svg/|icons/|manifest.json).*)',
  ],
};
