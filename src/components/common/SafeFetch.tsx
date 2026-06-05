import React from "react";
import DataErrorCard from "@/components/common/DataErrorCard";
import { extractErrorMessage } from "@/lib/server/api-error";
import { HttpError } from "@/lib/http";

interface SafeFetchProps<T> {
  fetcher: Promise<T>;
  fallbackMessage?: string;
  debugLabel?: string;
  children: (data: T) => React.ReactNode;
}

// Convert unknown thrown values to serializable objects so logs retain useful error details.
function serializeErrorForLog(error: unknown) {
  if (error instanceof HttpError) {
    return {
      name: error.name,
      message: error.message,
      status: error.status,
      payload: error.payload,
      stack: error.stack,
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  if (error && typeof error === "object") {
    return error;
  }

  return { value: error };
}

export default async function SafeFetch<T>({
  fetcher,
  fallbackMessage = "Không tải được dữ liệu. Vui lòng thử lại.",
  debugLabel = "unknown",
  children,
}: SafeFetchProps<T>) {
  // Generic server-side fetch guard for page sections.
  let data: T;
  let hasError = false;
  let errorMessage = fallbackMessage;

  try {
    console.log("[SafeFetch] start", { debugLabel });
    data = await fetcher;
    if (data && typeof data === "object") {
      // const record = data as Record<string, unknown>;
      // //Comment on production
      // console.log("[SafeFetch] success", {
      //   debugLabel,
      //   data: Array.isArray(record.data) ? record.data : (record.data ?? data),
      // });
    } else {
      console.log("[SafeFetch] success", { debugLabel, data });
    }
  } catch (error) {
    hasError = true;
    console.error("[SafeFetch] error", {
      debugLabel,
      error: serializeErrorForLog(error),
    });

    if (error instanceof HttpError) {
      const payloadMessage = extractErrorMessage(error.payload);
      errorMessage =
        payloadMessage ??
        (error.message?.trim() ? error.message : fallbackMessage);
    } else if (error instanceof Error) {
      // Keep technical runtime errors in server logs only. UI should stay user-friendly
      errorMessage = fallbackMessage;
    }
  }

  if (hasError) {
    return (
      <section className="layout-container layout-section-sm">
        <DataErrorCard message={errorMessage} />
      </section>
    );
  }

  return <>{children(data!)}</>;
}
