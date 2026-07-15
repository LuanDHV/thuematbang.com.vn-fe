// Standardized pagination metadata for frontend usage
export interface PaginationMeta {
  total: number;
  currentPage: number;
  limit: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Raw pagination format returned from the backend API
export interface BackendPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Global wrapper structure for all API responses
export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  message?: string;
  statusCode?: number;
}
