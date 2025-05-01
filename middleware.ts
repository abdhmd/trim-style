// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const auth = request.cookies.get('auth')?.value;
  const path = request.nextUrl.pathname;

  console.log(`[Middleware] Path: ${path}, Auth: ${auth}`);

  // تحقق من أي مسار يبدأ بـ /dashboard (بما في ذلك الفرعية)
  if (!auth && path.startsWith('/dashboard')) {
    console.log('Redirecting to /login');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path); // إضافة المسار الحالي لتوجيه العودة
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // يطابق /dashboard وأي مسار فرعي
};