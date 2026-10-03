export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

export interface PaginationResponse {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
  from: number;
  to: number;
}

export interface CursorPaginationResponse {
  nextCursor: string | null;
  hasMore: boolean;
  take: number;
}

export interface CursorAfterPaginationResponse {
  after: string | null;
  hasMore: boolean;
  take: number;
}

export interface BaseInfiniteResponse<T> {
  pages: T[];
  pageParams: (string | null)[];
}
