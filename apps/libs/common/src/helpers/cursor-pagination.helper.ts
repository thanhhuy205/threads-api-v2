import { MAX_LIMIT, PER_PAGE } from '@libs/core/constants/pagination';
import type { CursorPagination } from '../dto/pagination.dto';

export function normalizeCursorPagination(input: {
  after?: string | number;
  take?: string | number;
}): CursorPagination {
  const take = Number(input.take);

  return {
    after: typeof input.after === 'string' && input.after.trim() ? input.after.trim() : null,
    take: Math.min(Number.isInteger(take) && take > 0 ? take : PER_PAGE, MAX_LIMIT),
  };
}

export function buildCursorPagination<T>({
  rows,
  take,
  getAfter,
  before = false,
}: {
  rows: T[];
  take: number;
  getAfter: (item: T) => string | null;
  before?: boolean;
}) {
  const hasMore = rows.length > take;
  const currentRows = hasMore ? rows.slice(0, take) : rows;
  const boundary = before ? currentRows[0] : currentRows[currentRows.length - 1];

  return {
    rows: currentRows,
    pagination: {
      take,
      after: hasMore && boundary ? getAfter(boundary) : null,
      hasMore,
    },
  };
}
