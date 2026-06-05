import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isProductionAppEnv } from "@/lib/app-env";
import { resolveAdminAuthState } from "@/lib/auth/admin-auth";

const LOGIN_ROUTE = "/dang-nhap";
const ADMIN_LOGIN_ROUTE = "/dang-nhap-admin";
const ADMIN_ROOT = "/admin";
const LEGACY_ADMIN_ROOT = "/cms/admin";
const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: isProductionAppEnv(),
  path: "/",
};

function isSafeInternalPath(value: string | null): value is string {
  return Boolean(value && value.startsWith("/") && !value.startsWith("//"));
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith(LEGACY_ADMIN_ROOT)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = pathname.replace(LEGACY_ADMIN_ROOT, ADMIN_ROOT);
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname === ADMIN_LOGIN_ROUTE || pathname.startsWith(`${ADMIN_LOGIN_ROUTE}/`)) {
    const authState = await resolveAdminAuthState(
      request.cookies.get(ACCESS_TOKEN_COOKIE)?.value,
      request.cookies.get(REFRESH_TOKEN_COOKIE)?.value,
    );
    if (!authState) return NextResponse.next();

    if (authState.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const nextPath = request.nextUrl.searchParams.get("next");
    const target = isSafeInternalPath(nextPath) ? nextPath : ADMIN_ROOT;
    const response = NextResponse.redirect(new URL(target, request.url));
    if (authState.tokenPair) {
      response.cookies.set(ACCESS_TOKEN_COOKIE, authState.tokenPair.accessToken!, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24,
      });
      response.cookies.set(REFRESH_TOKEN_COOKIE, authState.tokenPair.refreshToken!, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    return response;
  }

  if (pathname === ADMIN_ROOT || pathname.startsWith(`${ADMIN_ROOT}/`)) {
    const authState = await resolveAdminAuthState(
      request.cookies.get(ACCESS_TOKEN_COOKIE)?.value,
      request.cookies.get(REFRESH_TOKEN_COOKIE)?.value,
    );
    if (!authState) {
      const loginUrl = new URL(ADMIN_LOGIN_ROUTE, request.url);
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
        ...COOKIE_OPTIONS,
        maxAge: 0,
      });
      response.cookies.set(REFRESH_TOKEN_COOKIE, "", {
        ...COOKIE_OPTIONS,
        maxAge: 0,
      });
      return response;
    }

    if (authState.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const response = NextResponse.next();
    if (authState.tokenPair) {
      response.cookies.set(ACCESS_TOKEN_COOKIE, authState.tokenPair.accessToken!, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24,
      });
      response.cookies.set(REFRESH_TOKEN_COOKIE, authState.tokenPair.refreshToken!, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    return response;
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
  matcher: ["/quan-li-tai-khoan/:path*", "/admin/:path*", "/dang-nhap-admin", "/cms/admin/:path*"],
};

