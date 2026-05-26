import { BackendPagination, PaginationMeta } from "@/types/api";

type ListEnvelope<T> = {
  items?: T[];
  data?: T[];
  pagination?: BackendPagination;
  meta?: PaginationMeta;
};

// Safely extract or validate array from API response
export function ensureArray<T>(value: unknown, label: string): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (value && typeof value === "object") {
    const envelope = value as ListEnvelope<T>;
    if (Array.isArray(envelope.items)) return envelope.items;
    if (Array.isArray(envelope.data)) return envelope.data;
  }

  throw new Error(`Invalid ${label} response: expected array/items/data array`);
}

// Normalize different backend pagination formats into a standard meta object
export function normalizePaginationMeta(
  input?: PaginationMeta | BackendPagination | null,
): PaginationMeta | undefined {
  if (!input) return undefined;

  if ("currentPage" in input) {
    return input as PaginationMeta;
  }

  const page = input.page ?? 1;
  const totalPages = input.totalPages ?? 1;
  const limit = input.limit ?? 10;
  const total = input.totalItems ?? 0;

  return {
    total,
    currentPage: page,
    limit,
    totalPage: totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
