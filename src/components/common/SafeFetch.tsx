import React from "react";
import DataErrorCard from "@/components/common/DataErrorCard";
import { extractErrorMessage } from "@/app/api/v1/_utils/api-error";
import { HttpError } from "@/lib/http";

interface SafeFetchProps<T> {
  fetcher: Promise<T>;
  fallbackMessage?: string;
  debugLabel?: string;
  children: (data: T) => React.ReactNode;
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
      const record = data as Record<string, unknown>;
      //Comment on production
      console.log("[SafeFetch] success", {
        debugLabel,
        data: Array.isArray(record.data) ? record.data : (record.data ?? data),
      });
    } else {
      console.log("[SafeFetch] success", { debugLabel, data });
    }
  } catch (error) {
    hasError = true;
    console.error("[SafeFetch] error", { debugLabel, error });

    if (error instanceof HttpError) {
      const payloadMessage = extractErrorMessage(error.payload);
      errorMessage =
        payloadMessage ??
        (error.message?.trim() ? error.message : fallbackMessage);
    } else if (error instanceof Error && error.message.trim()) {
      errorMessage = error.message;
    }
  }

  if (hasError) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-8">
        <DataErrorCard message={errorMessage} />
      </section>
    );
  }

  return <>{children(data!)}</>;
}
