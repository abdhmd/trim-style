import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const auth = request.cookies.get('auth')?.value;
  const path = request.nextUrl.pathname;


  if (!auth && path.startsWith('/dashboard')) {
    console.log(`[Middleware] No auth cookie found, redirecting to /login from ${path}`);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  console.log(`[Middleware] Proceeding to next for ${path}`);
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};