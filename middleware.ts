import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const auth = request.cookies.get('auth')?.value;
  console.log('auth cookie:', auth);  // تحقق مما إذا كانت الكوكيز موجودة بالفعل

  if (!auth && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/dashboard/:path*"],
};
