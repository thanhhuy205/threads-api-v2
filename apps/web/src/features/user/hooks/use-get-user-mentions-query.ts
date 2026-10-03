"use client";

import { getUserMentions } from "@/features/user/api/get-user-mentions";
import { userKeys } from "@/features/user/keys";
import type { UserMentionResponse } from "@/types/user";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

type UseGetUserMentionsQueryInput = {
  query: {
    q: string;
    take?: number;
  };
  options?: Omit<
    UseQueryOptions<UserMentionResponse>,
    "queryKey" | "queryFn"
  >;
};

export const useGetUserMentionsQuery = ({
  query,
  options,
}: UseGetUserMentionsQueryInput) => {
  const normalizedQuery = query.q.trim();
  const take = query.take ?? 40;
  const enabled = Boolean(normalizedQuery) && (options?.enabled ?? true);

  return useQuery({
    ...options,
    queryKey: userKeys.mentions({ q: normalizedQuery, take }),
    queryFn: () => getUserMentions({ q: normalizedQuery, take }),
    enabled,
    refetchOnWindowFocus: false,
  });
};
