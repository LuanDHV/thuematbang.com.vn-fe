import { NextResponse } from "next/server";
import { getPrivateApiBaseUrl } from "@/lib/env";

// Options for GET proxy requests
type ProxyGetOptions = {
  request: Request;
  backendPaths: string[];
  cache?: RequestCache;
};

// Options for mutating proxy requests (POST, PATCH, etc.)
type ProxyJsonRequestOptions = {
  backendPath: string;
  method: "POST" | "PATCH" | "PUT" | "DELETE";
  headers?: HeadersInit;
  body?: unknown;
};

// Standard backend error response format
type BackendErrorPayload = {
  error: string;
  statusCode: number;
  backend?: unknown;
};

// Helper to join URL parts safely without double or missing slashes
function joinUrl(base: string, path: string) {
  const normalizedBase = base.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

// Helper to safely parse JSON response without throwing crashes
async function parseJsonSafe(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

// Helper to generate a standardized JSON error response
function createErrorResponse(
  message: string,
  statusCode: number,
  backend?: unknown,
) {
  const payload: BackendErrorPayload = {
    error: message,
    statusCode,
    backend,
  };
  return NextResponse.json(payload, { status: statusCode });
}

// Proxy GET requests by fallback-polling paths sequentially until successful
export async function proxyGet({
  request,
  backendPaths,
  cache = "no-store",
}: ProxyGetOptions) {
  try {
    const { search } = new URL(request.url); // Forward original query params
    const baseUrl = getPrivateApiBaseUrl();
    let lastStatus = 502;
    let lastPayload: unknown;

    for (const backendPath of backendPaths) {
      const targetUrl = `${joinUrl(baseUrl, backendPath)}${search}`;
      const response = await fetch(targetUrl, { cache });
      const payload = await parseJsonSafe(response);

      // Return immediately on 2xx success
      if (response.ok) {
        return NextResponse.json(payload, { status: 200 });
      }

      lastStatus = response.status;
      lastPayload = payload;

      // Stop fallback loop unless it is a 404 Not Found error
      if (response.status !== 404) {
        break;
      }
    }

    return createErrorResponse(
      `Backend request failed (${lastStatus})`,
      lastStatus,
      lastPayload,
    );
  } catch {
    return createErrorResponse("Connection failed", 500); // Handle network connection error
  }
}

// Proxy mutating JSON requests (POST, PATCH, PUT, DELETE) to backend
export async function proxyJsonRequest({
  backendPath,
  method,
  headers,
  body,
}: ProxyJsonRequestOptions) {
  try {
    const targetUrl = joinUrl(getPrivateApiBaseUrl(), backendPath);
    const response = await fetch(targetUrl, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    const payload = await parseJsonSafe(response);

    if (!response.ok) {
      return createErrorResponse(
        `Backend request failed (${response.status})`,
        response.status,
        payload,
      );
    }

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return createErrorResponse("Connection failed", 500); // Handle network connection error
  }
}
