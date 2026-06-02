import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

type TokenPair = {
  accessToken?: string;
  refreshToken?: string;
};

type AuthTokenShape = {
  accessToken: string;
  refreshToken: string;
};

function getRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function parseAuthTokenShape(value: unknown): AuthTokenShape | null {
  const record = getRecord(value);
  if (!record) return null;

  const accessToken = record.accessToken;
  const refreshToken = record.refreshToken;

  if (typeof accessToken !== "string" || accessToken.length === 0) return null;
  if (typeof refreshToken !== "string" || refreshToken.length === 0) {
    return null;
  }

  return { accessToken, refreshToken };
}

export function extractTokenPair(payload: unknown): TokenPair {
  const direct = parseAuthTokenShape(payload);
  if (direct) return direct;

  const wrapped = getRecord(payload)?.data;
  return parseAuthTokenShape(wrapped) ?? {};
}

function getCookieSecureFlag() {
  return process.env.NODE_ENV === "production";
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
