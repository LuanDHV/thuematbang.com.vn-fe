import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNPROCESSABLE_ENTITY"
  | "TOO_MANY_REQUESTS"
  | "UPSTREAM_ERROR"
  | "CONNECTION_FAILED"
  | "INTERNAL_ERROR";

type ApiErrorEnvelope = {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    statusCode: number;
    retryable: boolean;
    details?: unknown;
  };
};

type CreateApiErrorResponseInput = {
  statusCode: number;
  message: string;
  code?: ApiErrorCode;
  details?: unknown;
};

// Map HTTP status codes into the FE error codes used by route handlers.
function mapStatusToCode(statusCode: number): ApiErrorCode {
  switch (statusCode) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "CONFLICT";
    case 422:
      return "UNPROCESSABLE_ENTITY";
    case 429:
      return "TOO_MANY_REQUESTS";
    default:
      return statusCode >= 500 ? "UPSTREAM_ERROR" : "INTERNAL_ERROR";
  }
}

// Mark errors as retryable only when a follow-up attempt could realistically succeed.
function isRetryable(statusCode: number) {
  return statusCode === 429 || statusCode >= 500;
}

// Extract the most useful human-readable message from heterogeneous backend payloads.
export function extractErrorMessage(payload: unknown) {
  if (!payload) return undefined;
  if (typeof payload === "string") return payload;
  if (typeof payload !== "object") return undefined;

  const record = payload as Record<string, unknown>;
  const message = record.message;

  if (typeof message === "string" && message.trim().length > 0) return message;
  if (Array.isArray(message) && message.length > 0) {
    return message.filter((item) => typeof item === "string").join(", ");
  }

  const error = record.error;
  if (typeof error === "string" && error.trim().length > 0) return error;

  if (error && typeof error === "object") {
    const nestedMessage = (error as { message?: unknown }).message;
    if (typeof nestedMessage === "string" && nestedMessage.trim().length > 0) {
      return nestedMessage;
    }
  }

  return undefined;
}

// Build the normalized API error envelope returned by FE route handlers.
export function createApiErrorResponse({
  statusCode,
  message,
  code,
  details,
}: CreateApiErrorResponseInput) {
  const payload: ApiErrorEnvelope = {
    success: false,
    error: {
      code: code ?? mapStatusToCode(statusCode),
      message,
      statusCode,
      retryable: isRetryable(statusCode),
      details,
    },
  };

  return NextResponse.json(payload, { status: statusCode });
}

// Convert one backend failure into the normalized FE error response shape.
export function createBackendErrorResponse(
  statusCode: number,
  backendPayload: unknown,
  fallbackMessage = `Backend request failed (${statusCode})`,
) {
  const message = extractErrorMessage(backendPayload) ?? fallbackMessage;
  return createApiErrorResponse({
    statusCode,
    message,
    details: backendPayload,
  });
}

// Build a normalized response for transport-level connection failures.
export function createConnectionErrorResponse(details?: unknown) {
  return createApiErrorResponse({
    statusCode: 500,
    message: "Connection failed",
    code: "CONNECTION_FAILED",
    details,
  });
}
