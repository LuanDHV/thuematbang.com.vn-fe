import "server-only";

import { getPrivateApiBaseUrl } from "@/lib/env";
import { extractTokenPair } from "@/lib/auth/auth-tokens";
import { HttpError } from "@/lib/http";
import {
  deleteAuthCookies,
  readAuthCookies,
  writeAuthCookies,
} from "@/lib/server/auth-cookies";
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
  mutateAuthCookies?: boolean;
  viewTrackingSource?: "public" | "internal";
};

// All server-side services should go through this URL builder so auth refresh,
// cache tags, and backend error handling stay centralized.
function createServerApiUrl(path: string) {
  const base = getPrivateApiBaseUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

// Parse JSON bodies defensively so transport failures do not mask the real error.
async function parseJsonSafe(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

// Normalize both the current and legacy backend envelopes into one FE response shape.
function normalizeApiResponse<T>(payload: unknown): ApiResponse<T> {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    // Support the backend envelope used by most CRUD endpoints.
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

    // Support legacy list endpoints that still return items/pagination.
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

// Apply auth headers in one place so server reads do not hand-roll header logic.
async function buildRequestHeaders(
  auth: "none" | "required",
  headers?: HeadersInit,
  accessToken?: string | null,
  viewTrackingSource?: "public" | "internal",
) {
  const resolvedHeaders = new Headers(headers);
  resolvedHeaders.set("Accept", "application/json");

  if (viewTrackingSource) {
    resolvedHeaders.set("X-View-Source", viewTrackingSource);
  }

  if (auth === "required" && accessToken) {
    resolvedHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  return resolvedHeaders;
}

// Execute one raw server request with the normalized cache and header contract.
async function executeServerRequest(
  path: string,
  options: ServerApiClientOptions,
  accessToken?: string | null,
) {
  return fetch(createServerApiUrl(path), {
    method: options.method ?? "GET",
    cache: options.cache ?? "no-store",
    next:
      options.revalidate || options.tags
        ? {
            revalidate: options.revalidate,
            tags: options.tags,
          }
        : undefined,
    headers: await buildRequestHeaders(
      options.auth ?? "none",
      options.headers,
      accessToken,
      options.viewTrackingSource,
    ),
    body: options.body,
  });
}

// Refresh the access token through the backend contract used by auth routes.
async function refreshServerAccessToken(refreshToken: string) {
  const response = await fetch(createServerApiUrl("/auth/refresh"), {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const payload = await parseJsonSafe(response);
  if (!response.ok) {
    return null;
  }

  const tokenPair = extractTokenPair(payload);
  if (!tokenPair.accessToken || !tokenPair.refreshToken) {
    return null;
  }

  return tokenPair;
}

// Resolve one server API call, including optional auth recovery and error mapping.
export async function requestServerApi<T>(
  path: string,
  options: ServerApiClientOptions = {},
): Promise<ApiResponse<T>> {
  const authMode = options.auth ?? "none";
  let response: Response | null = null;

  if (authMode === "required") {
    const { accessToken, refreshToken } = await readAuthCookies();

    if (!accessToken && !refreshToken) {
      throw new HttpError("Unauthorized", 401);
    }

    // Authenticated server reads retry once through the refresh flow so pages do
    // not need to duplicate cookie and token recovery logic.
    const refreshAndRetry = async () => {
      if (!refreshToken) {
        return null;
      }

      const tokenPair = await refreshServerAccessToken(refreshToken);
      if (!tokenPair) {
        if (options.mutateAuthCookies) {
          await deleteAuthCookies();
        }
        return null;
      }

      if (options.mutateAuthCookies) {
        await writeAuthCookies(tokenPair);
      }

      return executeServerRequest(path, options, tokenPair.accessToken);
    };

    response = accessToken
      ? await executeServerRequest(path, options, accessToken)
      : await refreshAndRetry();

    if (!response) {
      throw new HttpError("Unauthorized", 401);
    }

    if (response.status === 401) {
      const refreshedResponse = await refreshAndRetry();
      if (refreshedResponse) {
        response = refreshedResponse;
      }
    }
  } else {
    response = await executeServerRequest(path, options);
  }

  if (!response) {
    throw new HttpError("Unauthorized", 401);
  }

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
