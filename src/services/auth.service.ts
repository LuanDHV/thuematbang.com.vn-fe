import { getPublicApiBaseUrl } from "@/lib/env";
import { postJson, unwrapApiData } from "@/lib/http";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/types";

function createAuthUrl(path: string) {
  const base = getPublicApiBaseUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export const authService = {
  login: (payload: LoginPayload) =>
    postJson<unknown>(createAuthUrl("/auth/login"), payload, {
      cache: "no-store",
    }).then(unwrapApiData<AuthResponse>),

  register: (payload: RegisterPayload) =>
    postJson<unknown>(createAuthUrl("/auth/register"), payload, {
      cache: "no-store",
    }).then(unwrapApiData<AuthResponse>),

  refresh: () =>
    postJson<unknown>(createAuthUrl("/auth/refresh"), undefined, {
      cache: "no-store",
    }).then(unwrapApiData<AuthResponse>),

  logout: () =>
    postJson<unknown>(createAuthUrl("/auth/logout"), undefined, {
      cache: "no-store",
    }).then(unwrapApiData<{ ok?: boolean; message?: string }>),
};
