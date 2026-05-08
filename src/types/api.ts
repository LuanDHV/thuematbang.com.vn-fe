export interface PaginationMeta {
  total: number;
  currentPage: number;
  limit: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Đây là Wrapper chung dùng Generic <T>
export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  message?: string;
  statusCode?: number;
}
