export interface PaginationMeta {
  total: number;
  currentPage: number;
  limit: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BackendPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  message?: string;
  statusCode?: number;
}
