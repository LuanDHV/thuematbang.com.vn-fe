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

export type ApiErrorResponse = {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    statusCode: number;
    retryable: boolean;
    details?: unknown;
  };
};

export function isApiErrorResponse(
  payload: unknown,
): payload is ApiErrorResponse {
  if (!payload || typeof payload !== "object") return false;

  const record = payload as Record<string, unknown>;
  if (record.success !== false) return false;

  const error = record.error;
  if (!error || typeof error !== "object") return false;

  const errorRecord = error as Record<string, unknown>;
  return (
    typeof errorRecord.code === "string" &&
    typeof errorRecord.message === "string" &&
    typeof errorRecord.statusCode === "number"
  );
}
