"use client";

import { getSearchTopic } from "@/features/search/api";
import { searchKeys } from "@/features/search/keys";
import type { ApiError } from "@/types/axios";
import type { SearchTopicResponse } from "@/types/search";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

type UseSearchTopicQueryInput = {
  query: {
    q: string;
  };
  options?: Omit<
    UseQueryOptions<SearchTopicResponse, ApiError>,
    "queryKey" | "queryFn"
  >;
};

export const useSearchTopicQuery = ({
  query,
  options,
}: UseSearchTopicQueryInput) => {
  const normalizedQuery = query.q.trim();
  const enabled = Boolean(normalizedQuery) && (options?.enabled ?? true);

  return useQuery({
    ...options,
    queryKey: searchKeys.topic.root({ q: normalizedQuery }),
    queryFn: () => getSearchTopic({ q: normalizedQuery }),
    enabled,
    refetchOnWindowFocus: false,
  });
};
