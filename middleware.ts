import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_APP = /^\/app(\/|$)/;
const PROTECTED_ADMIN = /^\/admin(?!\/login)(\/|$)/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie =
    req.cookies.get("authjs.session-token")?.value ??
    req.cookies.get("__Secure-authjs.session-token")?.value;

  if (PROTECTED_APP.test(pathname) && !sessionCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (PROTECTED_ADMIN.test(pathname) && !sessionCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
};
