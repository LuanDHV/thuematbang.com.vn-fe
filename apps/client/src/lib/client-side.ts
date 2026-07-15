import type { PaginationMeta } from "@/types/api";

const DEFAULT_PAGINATION_META: PaginationMeta = {
  total: 0,
  currentPage: 1,
  limit: 0,
  totalPage: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

export function resolvePaginationClientMeta(
  paginationMeta?: PaginationMeta,
) {
  return paginationMeta ?? DEFAULT_PAGINATION_META;
}
