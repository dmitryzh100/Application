export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
