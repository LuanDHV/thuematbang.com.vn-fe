import { NextResponse } from "next/server";
import { getPrivateApiBaseUrl } from "@/lib/env";
import { readAuthCookies } from "@/app/api/v1/_utils/auth";
import {
  createApiErrorResponse,
  createBackendErrorResponse,
  createConnectionErrorResponse,
} from "@/app/api/v1/_utils/api-error";

export async function POST(request: Request) {
  try {
    // Check user authentication from cookies
    const { accessToken } = await readAuthCookies();
    if (!accessToken) {
      return createApiErrorResponse({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    // Parse incoming multipart form data (files and text fields)
    const formData = await request.formData();

    // Get backend base URL and remove trailing slash
    const backendUrl = getPrivateApiBaseUrl().replace(/\/$/, "");

    // Forward the form data and upload the file to backend server
    const response = await fetch(`${backendUrl}/media/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        // Note: Do NOT set Content-Type header here; fetch will set it automatically with the correct boundary
      },
      body: formData,
      cache: "no-store",
    });

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
