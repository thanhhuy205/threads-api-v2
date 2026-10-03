import type { SearchPostsSerpType } from "@/types/search";

export const SEARCH_DEFAULT_TAKE = 20;
export const SEARCH_MAX_TAKE = 100;

export const normalizeSearchTake = (take?: number) => {
  const parsedTake = Number(take);

  if (!Number.isFinite(parsedTake) || parsedTake < 1) {
    return SEARCH_DEFAULT_TAKE;
  }

  return Math.min(SEARCH_MAX_TAKE, Math.floor(parsedTake));
};

export const normalizeSerpType = (
  serpType?: SearchPostsSerpType,
): SearchPostsSerpType => serpType ?? "default";
