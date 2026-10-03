"use client";

import { getUserByUsername } from "@/features/user/api/get-user-by-username";
import { userKeys } from "@/features/user/keys";
import type { UsernameParamsDto } from "@/schema/user.schema";
import type { UserProfileResponse } from "@/types/user";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

type UserByUsernameQueryOptions = Omit<
  UseQueryOptions<UserProfileResponse>,
  "queryKey" | "queryFn"
>;

type UseGetUserByUsernameQueryInput = {
  query: {
    username: UsernameParamsDto["username"];
  };
  enabled?: boolean;
  options?: UserByUsernameQueryOptions;
};

export const useGetUserByUsernameQuery = ({
  query,
  enabled,
  options,
}: UseGetUserByUsernameQueryInput) =>
  useQuery({
    ...options,
    queryKey: userKeys.byUsername(query.username),
    queryFn: () => getUserByUsername(query.username),
    enabled: enabled ?? options?.enabled ?? Boolean(query.username),
  });
