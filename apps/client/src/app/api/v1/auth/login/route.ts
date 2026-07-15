import { NextResponse } from "next/server";
import { proxyJsonRequest } from "@/app/api/v1/_utils/proxy";
import { applyAuthCookies, extractTokenPair } from "@/lib/server/auth-cookies";

// Handle credentials login (username/password)
export async function POST(request: Request) {
  const body = await request.json(); // Get login credentials from client

  // Proxy credentials to backend API
  const response = await proxyJsonRequest({
    backendPath: "/auth/login",
    method: "POST",
    body,
  });

  // Return error response directly if backend fails
  if (response.status >= 400) {
    return response;
  }

  const payload = await response.json();
  const nextResponse = NextResponse.json(payload, { status: response.status });
  applyAuthCookies(nextResponse, extractTokenPair(payload)); // Extract and save tokens to cookies

  return nextResponse;
}
