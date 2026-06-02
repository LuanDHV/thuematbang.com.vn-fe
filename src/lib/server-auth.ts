import { readAuthCookies } from "@/app/api/v1/_utils/auth";
import type { User } from "@/types";
import { getPrivateApiResponse } from "@/services/shared/private-api-client";

export async function getServerAuthUser(): Promise<User | null> {
  try {
    const { accessToken } = await readAuthCookies();
    if (!accessToken) return null;

    const response = await getPrivateApiResponse<User | null>("/users/me", {
      accessToken,
      cache: "no-store",
      tags: ["auth-me"],
    });

    return response.data ?? null;
  } catch {
    return null;
  }
}
