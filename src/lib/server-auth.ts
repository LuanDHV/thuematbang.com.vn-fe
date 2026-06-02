import { readAuthCookies } from "@/lib/server/auth-cookies";
import type { User } from "@/types";
import { requestServerApi } from "@/services/shared/server-api-client";

export async function getServerAuthUser(): Promise<User | null> {
  try {
    const { accessToken } = await readAuthCookies();
    if (!accessToken) return null;

    const response = await requestServerApi<User | null>("/users/me", {
      auth: "required",
      cache: "no-store",
      tags: ["auth-me"],
    });

    return response.data ?? null;
  } catch {
    return null;
  }
}
