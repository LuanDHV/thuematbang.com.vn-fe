import { NextResponse } from "next/server";
import { getPrivateApiBaseUrl } from "@/lib/env";
import { applyAuthCookies, extractTokenPair } from "@/app/api/v1/_utils/auth";
import {
  createApiErrorResponse,
  createBackendErrorResponse,
  createConnectionErrorResponse,
} from "@/app/api/v1/_utils/api-error";

// Handle Google OAuth callback after login
export async function GET(request: Request) {
  try {
    const { search } = new URL(request.url); // Get Google query params (?code=...)
    const backendUrl = getPrivateApiBaseUrl().replace(/\/$/, ""); // Get base API URL
    const callbackUrl = `${backendUrl}/auth/google/callback${search}`; // Construct backend callback URL

    // Fetch backend with manual redirect handling
    const response = await fetch(callbackUrl, {
      redirect: "manual",
      cache: "no-store",
    });

    // Handle 3xx redirect from backend
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) {
        return createApiErrorResponse({
          statusCode: 502,
          message: "Google callback redirected without location header",
          code: "UPSTREAM_ERROR",
        });
      }
      return NextResponse.redirect(location);
    }

    const payload = await response.json().catch(() => null);

    // Handle backend error
    if (!response.ok) {
      return createBackendErrorResponse(
        response.status,
        payload,
        "Google authentication failed",
      );
    }

    const tokenPair = extractTokenPair(payload);

    // Verify tokens exist
    if (!tokenPair.accessToken || !tokenPair.refreshToken) {
      return createApiErrorResponse({
        statusCode: 502,
        message: "Google callback response is missing token pair",
        code: "UPSTREAM_ERROR",
        details: payload,
      });
    }

    const nextResponse = NextResponse.redirect(new URL("/", request.url)); // Setup homepage redirect
    applyAuthCookies(nextResponse, tokenPair); // Save tokens to cookies
    return nextResponse;
  } catch (error) {
    return createConnectionErrorResponse(error); // Handle network connection error
  }
}
