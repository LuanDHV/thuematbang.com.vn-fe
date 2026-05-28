import { NextResponse } from "next/server";

// Standard API error code strings
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

// Standard error response envelope sent to client
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

// Input parameters for creating an API error response
type CreateApiErrorResponseInput = {
  statusCode: number;
  message: string;
  code?: ApiErrorCode;
  details?: unknown;
};

// Map HTTP status codes to corresponding string error codes
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

// Determine if the request can be retried (rate limits or server errors)
function isRetryable(statusCode: number) {
  return statusCode === 429 || statusCode >= 500;
}

// Extract human-readable error messages from arbitrary backend payloads
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
    if (typeof nestedMessage === "string" && nestedMessage.trim().length > 0)
      return nestedMessage;
  }

  return undefined;
}

// Main helper to build and return a Next.js JSON error response
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

// Handle error responses originating from backend services
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

// Handle errors where the backend connection completely failed
export function createConnectionErrorResponse(details?: unknown) {
  return createApiErrorResponse({
    statusCode: 500,
    message: "Connection failed",
    code: "CONNECTION_FAILED",
    details,
  });
}
