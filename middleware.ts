// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/docs/internal')) {
    const token = request.cookies.get('ffm_internal_token')?.value;
    const expected = process.env.INTERNAL_TOKEN;

    if (!expected || token !== expected) {
      const loginUrl = new URL('/internal-login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/docs/internal/:path*'],
};
