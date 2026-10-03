import { PER_PAGE } from "@/constant/pagination";
import type { CursorPaginationResponse } from "@/types/post";

const MAX_TAKE = 100;

const normalizeTake = (take?: number) => {
    const parsed = Number(take);

    if (!Number.isFinite(parsed) || parsed <= 0) {
        return PER_PAGE;
    }

    return Math.min(MAX_TAKE, Math.floor(parsed));
};

export const getPaginationParams = (params?: CursorPaginationResponse | void) => ({
    after: params?.after ?? undefined,
    take: normalizeTake(params?.take),
});

export const buildCursorParams = (after?: string) =>
    after ? `after=${after}&take=${PER_PAGE}` : `take=${PER_PAGE}`;

export const buildReplyCursorParams = (after?: string) =>
    after ? `after=${after}&take=${PER_PAGE}` : `take=${PER_PAGE}`;
