
type BuildPaginationOptions = {
    page?: number;
    limit?: number;
    defaultPage?: number;
    defaultLimit?: number;
    maxLimit?: number;
};

export const getPagination = (req: Request): { currentPage: number; perPage: number } => {
    const currentPage = req.headers.get('x-current-page') ? parseInt(req.headers.get('x-current-page') as string, 10) : 1;
    const perPage = req.headers.get('x-per-page') ? parseInt(req.headers.get('x-per-page') as string, 10) : 10;
    return { currentPage, perPage };
};

export function buildPagination({
    page,
    limit,
    defaultPage = 1,
    defaultLimit = 10,
    maxLimit = 100,
}: BuildPaginationOptions) {
    const currentPage =
        Number.isInteger(page) && page! > 0 ? page! : defaultPage;

    const rawLimit =
        Number.isInteger(limit) && limit! > 0 ? limit! : defaultLimit;

    const currentLimit = Math.min(rawLimit, maxLimit);

    const offset = (currentPage - 1) * currentLimit;
    return {
        currentPage,
        currentLimit,
        offset,
    };
}