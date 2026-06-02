import { readAuthCookies } from "@/app/api/v1/_utils/auth";
import { getPrivateApiBaseUrl } from "@/lib/env";
import type { User } from "@/types";

export async function getServerAuthUser(): Promise<User | null> {
  try {
    const { accessToken } = await readAuthCookies();
    if (!accessToken) return null;

    const backendUrl = getPrivateApiBaseUrl().replace(/\/$/, "");
    const response = await fetch(`${backendUrl}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const payload = await response.json().catch(() => null);
    return (payload?.data ?? payload ?? null) as User | null;
  } catch {
    return null;
  }
}
