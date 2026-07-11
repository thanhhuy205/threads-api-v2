import { DEFAULT_PAGE, MAX_LIMIT, PER_PAGE } from "@/constants/pagination";
import { Request } from "express";

type BuildPaginationOptions = {
    page?: number;
    limit?: number;
    defaultPage?: number;
    defaultLimit?: number;
    maxLimit?: number;
};

export type PaginationResponse = {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
    from: number;
    to: number;
};

export const getPagination = (
    req: Request<{}, {}, {}, { page?: string | number; limit?: string | number }>
): { currentPage: number; perPage: number } => {
    const { currentPage, currentLimit } = buildPagination({
        page: req.query.page === undefined ? undefined : Number(req.query.page),
        limit: req.query.limit === undefined ? undefined : Number(req.query.limit),
    });

    return { currentPage, perPage: currentLimit };
};

export function buildPagination({
    page,
    limit,
    defaultPage = DEFAULT_PAGE,
    defaultLimit = PER_PAGE,
    maxLimit = MAX_LIMIT,
}: BuildPaginationOptions) {
    const currentPage = Number.isInteger(page) && page! > 0 ? page! : defaultPage;
    const rawLimit = Number.isInteger(limit) && limit! > 0 ? limit! : defaultLimit;

    const currentLimit = Math.min(rawLimit, maxLimit);
    const offset = (currentPage - 1) * currentLimit;

    return {
        currentPage,
        currentLimit,
        offset,
    };
}

export function buildPaginationResponse(totalItems: number, currentPage: number, perPage: number): PaginationResponse {
    const total = totalItems;
    const lastPage = Math.ceil(total / perPage);
    const offset = (currentPage - 1) * perPage;
    const from = total === 0 || offset >= total ? 0 : offset + 1;
    const to = from === 0 ? 0 : Math.min(currentPage * perPage, total);

    return {
        currentPage,
        perPage,
        total,
        lastPage,
        from,
        to
    };
}
