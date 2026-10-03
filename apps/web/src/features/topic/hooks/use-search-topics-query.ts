"use client";

import { searchTopics } from "@/features/topic/api/search-topics";
import { topicKeys } from "@/features/topic/keys";
import type { TopicSearchResponse } from "@/types/topic";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

type UseSearchTopicsQueryInput = {
  query: {
    q: string;
  };
  options?: Omit<
    UseQueryOptions<TopicSearchResponse, Error>,
    "queryKey" | "queryFn"
  >;
};

export const useSearchTopicsQuery = ({
  query,
  options,
}: UseSearchTopicsQueryInput) => {
  const normalizedQuery = query.q.trim();
  const enabled = Boolean(normalizedQuery) && (options?.enabled ?? true);

  return useQuery({
    ...options,
    queryKey: topicKeys.search({ q: normalizedQuery }),
    queryFn: () => searchTopics({ q: normalizedQuery }),
    enabled,
    refetchOnWindowFocus: false,
  });
};
