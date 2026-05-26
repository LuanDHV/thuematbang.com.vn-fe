import { NextResponse } from "next/server";
import { getPrivateApiBaseUrl } from "@/lib/env";
import { readAuthCookies } from "@/app/api/v1/_utils/auth";
import {
  createApiErrorResponse,
  createBackendErrorResponse,
  createConnectionErrorResponse,
} from "@/app/api/v1/_utils/api-error";

// Helper to fetch current user profile from backend
async function callUsersMe(accessToken: string, init?: RequestInit) {
  const backendUrl = getPrivateApiBaseUrl().replace(/\/$/, "");
  return fetch(`${backendUrl}/users/me`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}

// Get current user profile
export async function GET() {
  try {
    const { accessToken } = await readAuthCookies();
    if (!accessToken) {
      return createApiErrorResponse({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    const response = await callUsersMe(accessToken);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return createBackendErrorResponse(response.status, payload);
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    return createConnectionErrorResponse(error);
  }
}

// Update current user profile (supports JSON and Multipart FormData)
export async function PATCH(request: Request) {
  try {
    const { accessToken } = await readAuthCookies();
    if (!accessToken) {
      return createApiErrorResponse({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    const contentType = request.headers.get("content-type") || "";
    const isFormData = contentType.includes("multipart/form-data");

    let response: Response;
    // Forward as FormData (e.g., avatar upload) or JSON
    if (isFormData) {
      const formData = await request.formData();
      response = await callUsersMe(accessToken, {
        method: "PATCH",
        body: formData,
      });
    } else {
      const body = await request.json().catch(() => ({}));
      response = await callUsersMe(accessToken, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    }

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return createBackendErrorResponse(response.status, payload);
    }

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return createConnectionErrorResponse(error);
  }
}
