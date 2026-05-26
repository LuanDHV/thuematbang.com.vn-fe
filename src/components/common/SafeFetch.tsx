import React from "react";
import DataErrorCard from "@/components/common/DataErrorCard";
import { extractErrorMessage } from "@/app/api/v1/_utils/api-error";
import { HttpError } from "@/lib/http";

interface SafeFetchProps<T> {
  fetcher: Promise<T>;
  fallbackMessage?: string;
  children: (data: T) => React.ReactNode;
}

export default async function SafeFetch<T>({
  fetcher,
  fallbackMessage = "Không tải được dữ liệu. Vui lòng thử lại.",
  children,
}: SafeFetchProps<T>) {
  let data: T;
  let hasError = false;
  let errorMessage = fallbackMessage;

  try {
    data = await fetcher;
  } catch (error) {
    hasError = true;

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
