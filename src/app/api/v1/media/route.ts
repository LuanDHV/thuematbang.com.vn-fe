import { NextResponse } from "next/server";
import { getPrivateApiBaseUrl } from "@/lib/env";
import { readAuthCookies } from "@/app/api/v1/_utils/auth";
import {
  createApiErrorResponse,
  createBackendErrorResponse,
  createConnectionErrorResponse,
} from "@/app/api/v1/_utils/api-error";

export async function DELETE(request: Request) {
  try {
    // Check user authentication from cookies
    const { accessToken } = await readAuthCookies();
    if (!accessToken) {
      return createApiErrorResponse({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    // Get publicId from URL search parameters
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");
    if (!publicId) {
      return createApiErrorResponse({
        statusCode: 400,
        message: "publicId is required",
      });
    }

    // Get backend base URL and remove trailing slash
    const backendUrl = getPrivateApiBaseUrl().replace(/\/$/, "");

    // Send DELETE request to backend server
    const response = await fetch(
      `${backendUrl}/media?publicId=${encodeURIComponent(publicId)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    // Parse response body to JSON, return null if parsing fails
    const payload = await response.json().catch(() => null);

    // Handle error responses from the backend
    if (!response.ok) {
      return createBackendErrorResponse(response.status, payload);
    }

    // Return successful response to the frontend client
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    // Handle network or connection errors
    return createConnectionErrorResponse(error);
  }
}
