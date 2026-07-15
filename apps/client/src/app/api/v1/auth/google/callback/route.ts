import { NextResponse } from "next/server";
import { getPrivateApiBaseUrl } from "@/lib/env";
import { applyAuthCookies, extractTokenPair } from "@/lib/server/auth-cookies";

function getRequestOrigin(request: Request) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return new URL(request.url).origin;
}

function redirectToLoginWithReason(request: Request, reason: string) {
  const url = new URL("/dang-nhap", getRequestOrigin(request));
  url.searchParams.set("google", reason);
  return NextResponse.redirect(url);
}

// Handle Google OAuth callback after login
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const oauthError = requestUrl.searchParams.get("error");
  if (oauthError) {
    const reason = oauthError === "access_denied" ? "cancelled" : "failed";
    return redirectToLoginWithReason(request, reason);
  }

  try {
    const { search } = requestUrl;
    const backendUrl = getPrivateApiBaseUrl().replace(/\/$/, "");
    const callbackUrl = `${backendUrl}/auth/google/callback${search}`;

    const response = await fetch(callbackUrl, {
      redirect: "manual",
      cache: "no-store",
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) {
        return redirectToLoginWithReason(request, "failed");
      }

      const locationUrl = new URL(location, backendUrl);
      const locationError = locationUrl.searchParams.get("error");
      if (locationError) {
        const reason =
          locationError === "access_denied" ? "cancelled" : "failed";
        return redirectToLoginWithReason(request, reason);
      }

      return NextResponse.redirect(locationUrl.toString());
    }

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return redirectToLoginWithReason(request, "failed");
    }

    const tokenPair = extractTokenPair(payload);

    if (!tokenPair.accessToken || !tokenPair.refreshToken) {
      return redirectToLoginWithReason(request, "failed");
    }

    const nextResponse = NextResponse.redirect(
      new URL("/", getRequestOrigin(request)),
    );
    applyAuthCookies(nextResponse, tokenPair);
    return nextResponse;
  } catch {
    return redirectToLoginWithReason(request, "failed");
  }
}
