import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
} from "@/lib/server/auth-cookies";
import { resolveLegacyRedirect } from "@/lib/legacy-redirects";

const LOGIN_ROUTE = "/dang-nhap";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const legacyRedirect = resolveLegacyRedirect(pathname);
  if (legacyRedirect && legacyRedirect.target !== pathname) {
    const redirectUrl = new URL(legacyRedirect.target, request.url);
    redirectUrl.search = search;
    return NextResponse.redirect(redirectUrl, 301);
  }

  if (pathname.startsWith("/quan-li-tai-khoan")) {
    const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    if (accessToken) {
      return NextResponse.next();
    }

    const loginUrl = new URL(LOGIN_ROUTE, request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
