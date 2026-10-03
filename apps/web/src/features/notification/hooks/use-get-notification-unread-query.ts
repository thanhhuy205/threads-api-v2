"use client";

import { getNotificationUnread } from "@/features/notification/api";
import { notificationKeys } from "@/features/notification/keys";
import type { GetNotificationUnreadResponse } from "@/types/notification";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

type NotificationUnreadQueryOptions<TData> = Omit<
  UseQueryOptions<
    GetNotificationUnreadResponse,
    Error,
    TData,
    readonly unknown[]
  >,
  "queryKey" | "queryFn"
>;

type UseGetNotificationUnreadQueryInput = {
  options?: NotificationUnreadQueryOptions<GetNotificationUnreadResponse>;
};

export const useGetNotificationUnreadQuery = ({
  options,
}: UseGetNotificationUnreadQueryInput = {}) =>
  useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: getNotificationUnread,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    ...options,
  });
