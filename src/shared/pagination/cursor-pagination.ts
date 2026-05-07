import { DEFAULT_PAGE, MAX_LIMIT, PER_PAGE } from '@/constants/pagination';
import { baseLogger } from '@/middlewares/logger';
import { Request } from 'express';

type BuildPaginationOptions = {
    after?: string;
    take?: number;
    defaultPage?: number;
    defaultAfter?: string | null;
    defaultLimit?: number;
    maxLimit?: number;
};

type CursorPaginationQuery = {
    after?: string | number;
    take?: string | number;
};

export type PaginationResponse<O> = {
    take: number;
    after: O | null;
    hasMore: boolean;
};

export type CursorPaginationResponse<T, O> = {
    rows: T[]; pagination: PaginationResponse<O>
}


export const getPagination = (
    req: Request<{}, {}, {}, CursorPaginationQuery>
): { after: string | null; take: number } => {
    const { currentAfter, currentLimit } = buildPagination({
        after: typeof req.query.after === 'string' ? req.query.after : undefined,
        take: req.query.take === undefined ? DEFAULT_PAGE : Number(req.query.take),
    });

    return { after: currentAfter, take: currentLimit };
};

export function buildPagination({
    after,
    take,
    defaultPage = DEFAULT_PAGE,
    defaultAfter = null,
    defaultLimit = PER_PAGE,
    maxLimit = MAX_LIMIT,
}: BuildPaginationOptions) {
    baseLogger.info(`Building pagination with parameters - after: ${after}, take: ${take}, defaultPage: ${defaultPage}, defaultAfter: ${defaultAfter}, defaultLimit: ${defaultLimit}, maxLimit: ${maxLimit}`);

    const currentAfter = typeof after === 'string' && after.trim().length > 0 ? after.trim() : defaultAfter;
    const currentPage = currentAfter ? defaultPage + 1 : defaultPage;
    const rawLimit = Number.isInteger(take) && take! > 0 ? take! : defaultLimit;
    const currentLimit = Math.min(rawLimit, maxLimit);
    baseLogger.info(`Pagination parameters - page: ${currentPage}, after: ${currentAfter}, limit: ${currentLimit}`);
    return {
        currentPage,
        currentAfter,
        currentLimit,
    };
}

export function buildCursorPagination<T>({
    rows,
    take,
    getAfter,
}: {
    rows: T[];
    take: number;
    getAfter: (item: T) => string;
}): { rows: T[]; pagination: PaginationResponse<string | number | null> } {
    const hasMore = rows.length > take;
    const currentRows = hasMore ? rows.slice(0, take) : rows;
    baseLogger.info(`Building cursor pagination response - total rows: ${rows.length}, take: ${take}, hasMore: ${hasMore}`);
    const nextAfter = hasMore && currentRows.length ? getAfter(currentRows[currentRows.length - 1]) : null;

    return {
        rows: currentRows,
        pagination: {
            take,
            after: nextAfter,
            hasMore,
        },
    };
}
