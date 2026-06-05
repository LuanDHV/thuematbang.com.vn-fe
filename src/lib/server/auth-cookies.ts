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

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: getCookieSecureFlag(),
    path: "/",
  };
}

export function applyAuthCookies(response: NextResponse, tokenPair: TokenPair) {
  const options = getCookieOptions();

  if (tokenPair.accessToken) {
    response.cookies.set(ACCESS_TOKEN_COOKIE, tokenPair.accessToken, {
      ...options,
      maxAge: 60 * 60 * 24,
    });
  }

  if (tokenPair.refreshToken) {
    response.cookies.set(REFRESH_TOKEN_COOKIE, tokenPair.refreshToken, {
      ...options,
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

export function clearAuthCookies(response: NextResponse) {
  const options = getCookieOptions();

  response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    ...options,
    maxAge: 0,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", {
    ...options,
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

export async function writeAuthCookies(tokenPair: TokenPair) {
  const store = await cookies();
  const options = getCookieOptions();

  if (tokenPair.accessToken) {
    store.set(ACCESS_TOKEN_COOKIE, tokenPair.accessToken, {
      ...options,
      maxAge: 60 * 60 * 24,
    });
  }

  if (tokenPair.refreshToken) {
    store.set(REFRESH_TOKEN_COOKIE, tokenPair.refreshToken, {
      ...options,
      maxAge: 60 * 60 * 24 * 30,
    });
  }
}

export async function deleteAuthCookies() {
  const store = await cookies();
  const options = getCookieOptions();

  store.set(ACCESS_TOKEN_COOKIE, "", {
    ...options,
    maxAge: 0,
  });
  store.set(REFRESH_TOKEN_COOKIE, "", {
    ...options,
    maxAge: 0,
  });
}
