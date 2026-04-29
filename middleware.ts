// middleware.ts — Vercel Edge Middleware (framework-agnostic, no next/server)
export const config = {
  matcher: ['/docs/internal/:path*'],
};

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const cookieHeader = request.headers.get('cookie') ?? '';

  const token = cookieHeader
    .split(';')
    .map(c => c.trim().split('='))
    .find(([name]) => name === 'ffm_internal_token')?.[1];

  const expected = process.env.INTERNAL_TOKEN;

  if (!expected || token !== expected) {
    const loginUrl = new URL('/internal-login', url.origin);
    loginUrl.searchParams.set('redirect', url.pathname);
    return Response.redirect(loginUrl.toString(), 302);
  }
}
