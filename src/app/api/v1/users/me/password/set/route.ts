import { NextResponse } from "next/server";
import { getPrivateApiBaseUrl } from "@/lib/env";
import { readAuthCookies } from "@/app/api/v1/_utils/auth";
import {
  createApiErrorResponse,
  createBackendErrorResponse,
  createConnectionErrorResponse,
} from "@/app/api/v1/_utils/api-error";

// Create password for current user when account has no password yet.
export async function POST(request: Request) {
  try {
    const { accessToken } = await readAuthCookies();
    if (!accessToken) {
      return createApiErrorResponse({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    const body = await request.json().catch(() => ({}));
    const backendUrl = getPrivateApiBaseUrl().replace(/\/$/, "");

    const response = await fetch(`${backendUrl}/users/me/password/set`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return createBackendErrorResponse(response.status, payload);
    }

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return createConnectionErrorResponse(error);
  }
}
