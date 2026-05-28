import { NextResponse } from "next/server";
import { proxyJsonRequest } from "@/app/api/v1/_utils/proxy";
import { clearAuthCookies, readAuthCookies } from "@/app/api/v1/_utils/auth";

// Handle user logout
export async function POST() {
  const { accessToken } = await readAuthCookies(); // Read current access token from cookies

  // Forward logout request to backend with auth header
  const response = await proxyJsonRequest({
    backendPath: "/auth/logout",
    method: "POST",
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined,
  });

  // Determine response status and payload
  const status = response.status >= 400 ? response.status : 200;
  const payload = response.status >= 400 ? await response.json() : { ok: true };
  const nextResponse = NextResponse.json(payload, { status });

  clearAuthCookies(nextResponse); // Clear auth cookies from browser

  return nextResponse;
}
