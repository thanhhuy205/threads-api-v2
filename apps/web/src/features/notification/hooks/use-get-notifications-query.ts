"use client";

import { getNotifications } from "@/features/notification/api";
import { notificationKeys } from "@/features/notification/keys";
import type { BaseInfiniteResponse } from "@/types/api";
import type { GetNotificationsResponse } from "@/types/notification";
import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";

const NOTIFICATION_TAKE = 10;

type InfiniteNotificationsResponse = BaseInfiniteResponse<GetNotificationsResponse>;

type NotificationsQueryOptions = Omit<
  UseInfiniteQueryOptions<
    GetNotificationsResponse,
    Error,
    InfiniteNotificationsResponse,
    readonly unknown[],
    string | null
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

type UseGetNotificationsQueryInput = {
  take?: number;
  options?: NotificationsQueryOptions;
};

export const useGetNotificationsQuery = ({
  take = NOTIFICATION_TAKE,
  options,
}: UseGetNotificationsQueryInput = {}) =>
  useInfiniteQuery({
    ...options,
    queryKey: notificationKeys.list(),
    queryFn: ({ pageParam }) =>
      getNotifications({
        take,
        after: pageParam ?? undefined,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.after : undefined,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
