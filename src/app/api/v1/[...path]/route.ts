import { NextRequest, NextResponse } from "next/server";
import { getPrivateApiBaseUrl } from "@/lib/env";

function buildBackendUrl(pathSegments: string[], search: string) {
  const base = getPrivateApiBaseUrl().replace(/\/$/, "");
  const path = "/" + pathSegments.map(encodeURIComponent).join("/");
  return `${base}${path}${search}`;
}

async function handleProxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const backendUrl = buildBackendUrl(path, request.nextUrl.search);

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const headers = new Headers();
  headers.set("Accept", "application/json");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  if (refreshToken) {
    headers.set("X-Refresh-Token", refreshToken);
  }

  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const body = ["GET", "HEAD"].includes(request.method)
    ? undefined
    : await request.text();

  const response = await fetch(backendUrl, {
    method: request.method,
    headers,
    body: body || undefined,
    cache: "no-store",
  });

  try {
    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return new NextResponse(null, { status: response.status });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PATCH = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
