// Next.js specific fetch cache configurations
type NextFetchOptions = {
  revalidate?: number;
  tags?: string[];
};

// Configuration options for JSON requests
type JsonRequestOptions = {
  cache?: RequestCache;
  next?: NextFetchOptions;
  signal?: AbortSignal;
  headers?: HeadersInit;
};

// Standard error payload structure from backend API
type ApiErrorPayload = {
  success?: boolean;
  error?: {
    message?: string;
    statusCode?: number;
  };
  message?: string | string[];
};

// Custom HTTP error class retaining status code and payload
export class HttpError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.payload = payload;
  }
}

// Safely parse JSON response without throwing crashes
async function parseJsonSafe(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

// Extract human-readable error messages from backend response payload
function extractHttpErrorMessage(payload: unknown, status: number) {
  if (!payload || typeof payload !== "object") {
    return `Request failed (${status})`;
  }

  const parsed = payload as ApiErrorPayload;
  const errorMessage = parsed.error?.message;
  if (typeof errorMessage === "string" && errorMessage.trim().length > 0) {
    return errorMessage;
  }

  if (typeof parsed.message === "string" && parsed.message.trim().length > 0) {
    return parsed.message;
  }

  if (Array.isArray(parsed.message) && parsed.message.length > 0) {
    const messages = parsed.message.filter(
      (item): item is string => typeof item === "string",
    );
    if (messages.length > 0) {
      return messages.join(", ");
    }
  }

  return `Request failed (${status})`;
}

// Inject default JSON acceptance headers
function withDefaultHeaders(headers?: HeadersInit): HeadersInit {
  return {
    Accept: "application/json",
    ...headers,
  };
}

const REFRESH_ENDPOINT = "/auth/refresh";

function shouldAttemptTokenRefresh(url: string) {
  return !url.includes(REFRESH_ENDPOINT);
}

function resolveRefreshUrl(url: string) {
  const API_PREFIX = "/api/v1";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    const parsedUrl = new URL(url);
    const apiPrefixIndex = parsedUrl.pathname.indexOf(API_PREFIX);
    const basePath =
      apiPrefixIndex >= 0
        ? parsedUrl.pathname.slice(0, apiPrefixIndex + API_PREFIX.length)
        : API_PREFIX;
    return `${parsedUrl.origin}${basePath}${REFRESH_ENDPOINT}`;
  }

  const apiPrefixIndex = url.indexOf(API_PREFIX);
  const basePath =
    apiPrefixIndex >= 0 ? url.slice(0, apiPrefixIndex + API_PREFIX.length) : API_PREFIX;
  return `${basePath}${REFRESH_ENDPOINT}`;
}

async function tryRefreshToken(url: string, signal?: AbortSignal) {
  if (!shouldAttemptTokenRefresh(url)) {
    return false;
  }

  const refreshUrl = resolveRefreshUrl(url);
  const refreshResponse = await fetch(refreshUrl, {
    method: "POST",
    cache: "no-store",
    signal,
    credentials: "include",
    headers: withDefaultHeaders({
      "Content-Type": "application/json",
    }),
  });

  return refreshResponse.ok;
}

// Shortcut wrapper for GET JSON requests
export async function getJson<T>(url: string, options?: JsonRequestOptions) {
  return requestJson<T>("GET", url, options);
}

// Shortcut wrapper for POST JSON requests
export async function postJson<T>(
  url: string,
  body?: unknown,
  options?: JsonRequestOptions,
) {
  return requestJson<T>("POST", url, options, body);
}

// Core executor for JSON fetch requests; throws HttpError on failure
async function requestJson<T>(
  method: "GET" | "POST",
  url: string,
  options?: JsonRequestOptions,
  body?: unknown,
  allowRetryOnUnauthorized = true,
) {
  const response = await fetch(url, {
    method,
    cache: options?.cache,
    next: options?.next,
    signal: options?.signal,
    credentials: "include",
    headers: withDefaultHeaders({
      "Content-Type": "application/json",
      ...options?.headers,
    }),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = await parseJsonSafe(response);

  if (
    response.status === 401 &&
    allowRetryOnUnauthorized &&
    (await tryRefreshToken(url, options?.signal))
  ) {
    return requestJson<T>(method, url, options, body, false);
  }

  if (!response.ok) {
    throw new HttpError(
      extractHttpErrorMessage(payload, response.status),
      response.status,
      payload,
    );
  }

  return payload as T;
}

// Extract nested 'data' property from standard API response envelopes
export function unwrapApiData<T>(payload: unknown): T {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    (payload as { data?: unknown }).data !== undefined
  ) {
    return (payload as { data: T }).data;
  }

  return payload as T;
}
