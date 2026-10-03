"use client";

import { getSearchPosts } from "@/features/search/api";
import { normalizeSearchTake } from "@/features/search/api/helpers";
import { searchKeys } from "@/features/search/keys";
import type { BaseInfiniteResponse } from "@/types/api";
import type { ApiError } from "@/types/axios";
import type { SearchPostsResponse, SearchPostsSerpType } from "@/types/search";
import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";

type InfiniteSearchPostsResponse = BaseInfiniteResponse<SearchPostsResponse>;

type SearchPostsQueryOptions = Omit<
  UseInfiniteQueryOptions<
    SearchPostsResponse,
    ApiError,
    InfiniteSearchPostsResponse,
    readonly unknown[],
    string | null
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

type UseSearchPostsQueryInput = {
  query: {
    q: string;
    take?: number;
    serp_type?: SearchPostsSerpType;
  };
  options?: SearchPostsQueryOptions;
};

export const useSearchPostsQuery = ({
  query,
  options,
}: UseSearchPostsQueryInput) => {
  const normalizedQuery = query.q.trim();
  const take = normalizeSearchTake(query.take);
  const serpType = query.serp_type ?? "default";
  const enabled = Boolean(normalizedQuery) && (options?.enabled ?? true);

  return useInfiniteQuery({
    ...options,
    queryKey: searchKeys.posts.root({
      q: normalizedQuery,
      take,
      serp_type: serpType,
    }),
    queryFn: ({ pageParam }) =>
      getSearchPosts({
        q: normalizedQuery,
        take,
        after: pageParam ?? undefined,
        serp_type: serpType,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.after : undefined,
    enabled,
    refetchOnWindowFocus: false,
  });
};
