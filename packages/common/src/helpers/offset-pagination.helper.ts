import { DEFAULT_PAGE, MAX_LIMIT, PER_PAGE } from '../constants/pagination';
import type { OffsetPagination } from '../dto/response/pagination.dto';

export function normalizeOffsetPagination(input: {
  page?: string | number;
  limit?: string | number;
}): OffsetPagination {
  const page = Number(input.page);
  const limit = Number(input.limit);
  const currentPage = Number.isInteger(page) && page > 0 ? page : DEFAULT_PAGE;
  const currentLimit = Math.min(
    Number.isInteger(limit) && limit > 0 ? limit : PER_PAGE,
    MAX_LIMIT,
  );

  return {
    page: currentPage,
    limit: currentLimit,
    offset: (currentPage - 1) * currentLimit,
  };
}

export function buildOffsetPaginationResponse(total: number, page: number, limit: number) {
  const lastPage = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const from = total === 0 || offset >= total ? 0 : offset + 1;

  return {
    currentPage: page,
    perPage: limit,
    total,
    lastPage,
    from,
    to: from === 0 ? 0 : Math.min(page * limit, total),
  };
}
