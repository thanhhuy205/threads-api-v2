import type { BaseInfiniteResponse } from "@/types/api";

export const toInfiniteInitialData = <TPage>(
  page?: TPage | null,
): BaseInfiniteResponse<TPage> | undefined => {
  if (!page) return undefined;

  return {
    pages: [page],
    pageParams: [null],
  };
};
