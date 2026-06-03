import { getPrivateApiBaseUrl } from "@/lib/env";
import type { TokenPair } from "@/lib/auth/auth-tokens";

export type AdminUser = {
  role?: string;
};

export type AdminAuthState = {
  user: AdminUser;
  tokenPair: TokenPair | null;
} | null;

function getBackendUrl(path: string) {
  const backendUrl = getPrivateApiBaseUrl().replace(/\/$/, "");
  return `${backendUrl}${path}`;
}

async function fetchCurrentUser(accessToken: string): Promise<AdminUser | null> {
  const response = await fetch(getBackendUrl("/users/me"), {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const payload = await response.json().catch(() => null);
  return (payload?.data ?? payload ?? null) as AdminUser;
}

export async function resolveAdminAuthState(
  accessToken?: string,
  refreshToken?: string,
): Promise<AdminAuthState> {
  if (accessToken) {
  const user = await fetchCurrentUser(accessToken);
  if (user) return { user, tokenPair: null };
  }

  if (!refreshToken) return null;

  const response = await fetch(getBackendUrl("/auth/refresh"), {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) return null;

  const payload = await response.json().catch(() => null);
  const tokenPair = payload?.data ?? payload ?? null;
  const nextAccessToken =
    typeof tokenPair?.accessToken === "string" ? tokenPair.accessToken : null;
  const nextRefreshToken =
    typeof tokenPair?.refreshToken === "string" ? tokenPair.refreshToken : null;

  if (!nextAccessToken || !nextRefreshToken) return null;

  const user = await fetchCurrentUser(nextAccessToken);
  if (!user) return null;

  return {
    user,
    tokenPair: {
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken,
    },
  };
}
