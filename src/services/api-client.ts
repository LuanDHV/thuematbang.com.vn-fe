import { getPublicApiBaseUrl } from "@/lib/env";
import { getJson, postJson, unwrapApiData } from "@/lib/http";
import { ApiResponse } from "@/types/api";
import { normalizePaginationMeta } from "./validation";

type ApiClientOptions = {
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
};

// Format and construct full API URL
export function createApiUrl(path: string) {
  const base = getPublicApiBaseUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

// Core fetcher handler with Next.js caching support
async function requestApi<T>(
  path: string,
  options?: ApiClientOptions,
): Promise<ApiResponse<T>> {
  const payload = await getJson<unknown>(createApiUrl(path), {
    cache: options?.cache,
    next:
      options?.revalidate || options?.tags
        ? {
            revalidate: options?.revalidate,
            tags: options?.tags,
          }
        : undefined,
  });

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    // Handle standard API format (data / meta)
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

    // Handle alternative API format (items / pagination)
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

  // Fallback for raw or direct payload responses
  return {
    data: payload as T,
  };
}

// Execute GET request and return formatted wrapper
export async function getApiResponse<T>(
  path: string,
  options?: ApiClientOptions,
): Promise<ApiResponse<T>> {
  return requestApi<T>(path, options);
}

// Execute POST request and unwrap data directly
export async function postApiData<T>(path: string, body?: unknown): Promise<T> {
  const payload = await postJson<unknown>(createApiUrl(path), body, {
    cache: "no-store",
  });
  return unwrapApiData<T>(payload);
}
