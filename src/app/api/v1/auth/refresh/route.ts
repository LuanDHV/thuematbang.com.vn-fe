import { NextResponse } from "next/server";
import { proxyJsonRequest } from "@/app/api/v1/_utils/proxy";
import {
  applyAuthCookies,
  extractTokenPair,
  readAuthCookies,
} from "@/app/api/v1/_utils/auth";

// Handle token refresh when access token expires
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})); // Parse body safely to prevent crash
  const cookieTokens = await readAuthCookies(); // Read current tokens from cookies

  // Forward refresh request prioritizing body token over cookie token
  const response = await proxyJsonRequest({
    backendPath: "/auth/refresh",
    method: "POST",
    body: {
      ...body,
      refreshToken: body?.refreshToken || cookieTokens.refreshToken,
    },
  });

  // Return error response directly if backend fails
  if (response.status >= 400) {
    return response;
  }

  const payload = await response.json();
  const nextResponse = NextResponse.json(payload, { status: response.status });
  applyAuthCookies(nextResponse, extractTokenPair(payload)); // Save new tokens to cookies

  return nextResponse;
}
