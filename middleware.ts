import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_APP = /^\/app(\/|$)/;
const PROTECTED_ADMIN = /^\/admin(?!\/login)(\/|$)/;
const PROTECTED_NEW_TENANT = /^\/new-tenant(\/|$)/;
const PROTECTED_INVITATIONS = /^\/invitations(\/|$)/;

const LOCALES = ["pt-BR", "en"];
const DEFAULT_LOCALE = "pt-BR";

function resolveLocale(req: NextRequest): string {
  const cookie = req.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && LOCALES.includes(cookie)) return cookie;

  const accept = req.headers.get("accept-language") ?? "";
  for (const locale of LOCALES) {
    if (accept.includes(locale) || accept.includes(locale.split("-")[0])) {
      return locale;
    }
  }
  return DEFAULT_LOCALE;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie =
    req.cookies.get("authjs.session-token")?.value ??
    req.cookies.get("__Secure-authjs.session-token")?.value;

  if (
    (PROTECTED_APP.test(pathname) ||
      PROTECTED_NEW_TENANT.test(pathname) ||
      PROTECTED_INVITATIONS.test(pathname)) &&
    !sessionCookie
  ) {
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

  // Locale detection — set cookie if missing
  const response = NextResponse.next();
  if (!req.cookies.get("NEXT_LOCALE")) {
    const locale = resolveLocale(req);
    response.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|favicon|logo|og-|apple-touch|api).*)",
  ],
};
