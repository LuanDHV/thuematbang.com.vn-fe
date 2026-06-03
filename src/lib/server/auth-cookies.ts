import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isProductionAppEnv } from "@/lib/app-env";
import { extractTokenPair, type TokenPair } from "@/lib/auth/auth-tokens";

export { extractTokenPair };

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

function getCookieSecureFlag() {
  return isProductionAppEnv();
}

export function applyAuthCookies(response: NextResponse, tokenPair: TokenPair) {
  const secure = getCookieSecureFlag();

  if (tokenPair.accessToken) {
    response.cookies.set(ACCESS_TOKEN_COOKIE, tokenPair.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  }

  if (tokenPair.refreshToken) {
    response.cookies.set(REFRESH_TOKEN_COOKIE, tokenPair.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

export function clearAuthCookies(response: NextResponse) {
  const secure = getCookieSecureFlag();

  response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 0,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 0,
  });
}

export async function readAuthCookies() {
  const store = await cookies();
  return {
    accessToken: store.get(ACCESS_TOKEN_COOKIE)?.value,
    refreshToken: store.get(REFRESH_TOKEN_COOKIE)?.value,
  };
}
