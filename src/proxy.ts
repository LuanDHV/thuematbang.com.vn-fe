import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOGIN_ROUTE = "/dang-nhap";
const ADMIN_LOGIN_ROUTE = "/dang-nhap-admin";
const ADMIN_ROOT = "/admin";
const LEGACY_ADMIN_ROOT = "/cms/admin";
const ACCESS_TOKEN_COOKIE = "accessToken";

function isSafeInternalPath(value: string | null): value is string {
  return Boolean(value && value.startsWith("/") && !value.startsWith("//"));
}

async function fetchCurrentUser(request: NextRequest) {
  const cookie = request.headers.get("cookie") ?? "";
  if (!cookie) return null;

  const response = await fetch(new URL("/api/v1/users/me", request.url), {
    headers: {
      cookie,
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const payload = await response.json().catch(() => null);
  return (payload?.data ?? payload ?? null) as { role?: string } | null;
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith(LEGACY_ADMIN_ROOT)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = pathname.replace(LEGACY_ADMIN_ROOT, ADMIN_ROOT);
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname === ADMIN_LOGIN_ROUTE || pathname.startsWith(`${ADMIN_LOGIN_ROUTE}/`)) {
    const user = await fetchCurrentUser(request);
    if (!user) return NextResponse.next();

    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const nextPath = request.nextUrl.searchParams.get("next");
    const target = isSafeInternalPath(nextPath) ? nextPath : ADMIN_ROOT;
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (pathname === ADMIN_ROOT || pathname.startsWith(`${ADMIN_ROOT}/`)) {
    const user = await fetchCurrentUser(request);
    if (!user) {
      const loginUrl = new URL(ADMIN_LOGIN_ROUTE, request.url);
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/quan-li-tai-khoan")) {
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

