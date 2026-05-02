import { DEFAULT_PAGE, MAX_LIMIT, PER_PAGE } from "@/constants/pagination";

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

export const getPagination = (req: Request): { currentPage: number; perPage: number } => {
    const currentPage = req.headers.get('x-current-page') ? parseInt(req.headers.get('x-current-page') as string, 10) : 1;
    const perPage = req.headers.get('x-per-page') ? parseInt(req.headers.get('x-per-page') as string, 10) : PER_PAGE;
    return { currentPage, perPage };
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