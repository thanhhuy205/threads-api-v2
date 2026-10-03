"use client";

import { getSearchUsername } from "@/features/search/api";
import { searchKeys } from "@/features/search/keys";
import type { ApiError } from "@/types/axios";
import type { SearchUsernameResponse } from "@/types/search";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

type UseSearchUsernameQueryInput = {
  query: {
    q: string;
  };
  options?: Omit<
    UseQueryOptions<SearchUsernameResponse, ApiError>,
    "queryKey" | "queryFn"
  >;
};

export const useSearchUsernameQuery = ({
  query,
  options,
}: UseSearchUsernameQueryInput) => {
  const normalizedQuery = query.q.trim();
  const enabled = Boolean(normalizedQuery) && (options?.enabled ?? true);

  return useQuery({
    ...options,
    queryKey: searchKeys.username.root({ q: normalizedQuery }),
    queryFn: () => getSearchUsername({ q: normalizedQuery }),
    enabled,
    refetchOnWindowFocus: false,
  });
};
