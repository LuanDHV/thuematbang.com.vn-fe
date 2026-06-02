import "server-only";

import { getPrivateApiBaseUrl } from "@/lib/env";
import { HttpError } from "@/lib/http";
import { readAuthCookies } from "@/lib/server/auth-cookies";
import { extractErrorMessage } from "@/lib/server/api-error";
import { ApiResponse } from "@/types/api";
import { normalizePaginationMeta } from "./validation";

type ServerApiClientOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  auth?: "none" | "required";
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
  headers?: HeadersInit;
  body?: BodyInit | null;
};

function createServerApiUrl(path: string) {
  const base = getPrivateApiBaseUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

async function parseJsonSafe(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function normalizeApiResponse<T>(payload: unknown): ApiResponse<T> {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    if (record.data !== undefined || record.meta !== undefined) {
      return {
        data: record.data as T,
        meta: normalizePaginationMeta(record.meta as never),
        message:
          typeof record.message === "string" ? record.message : undefined,
        statusCode:
          typeof record.statusCode === "number" ? record.statusCode : undefined,
      };
    }

    if (record.items !== undefined || record.pagination !== undefined) {
      return {
        data: (record.items as T) ?? ([] as unknown as T),
        meta: normalizePaginationMeta(record.pagination as never),
        message:
          typeof record.message === "string" ? record.message : undefined,
        statusCode:
          typeof record.statusCode === "number" ? record.statusCode : undefined,
      };
    }
  }

  return {
    data: payload as T,
  };
}

async function buildRequestHeaders(
  auth: "none" | "required",
  headers?: HeadersInit,
) {
  const resolvedHeaders = new Headers(headers);
  resolvedHeaders.set("Accept", "application/json");

  if (auth === "required") {
    const { accessToken } = await readAuthCookies();
    if (!accessToken) {
      throw new HttpError("Unauthorized", 401);
    }
    resolvedHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  return resolvedHeaders;
}

export async function requestServerApi<T>(
  path: string,
  options: ServerApiClientOptions = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(createServerApiUrl(path), {
    method: options.method ?? "GET",
    cache: options.cache ?? "no-store",
    next:
      options.revalidate || options.tags
        ? {
            revalidate: options.revalidate,
            tags: options.tags,
          }
        : undefined,
    headers: await buildRequestHeaders(options.auth ?? "none", options.headers),
    body: options.body,
  });

  const payload = await parseJsonSafe(response);
  if (!response.ok) {
    throw new HttpError(
      extractErrorMessage(payload) ?? `Request failed (${response.status})`,
      response.status,
      payload,
    );
  }

  return normalizeApiResponse<T>(payload);
}
