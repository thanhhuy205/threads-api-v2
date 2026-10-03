"use client";

import ActivityList from "@/app/[locale]/(main)/_components/activity/ActivityList";
import { useGetNotificationsQuery } from "@/features/notification/hooks";
import { toInfiniteInitialData } from "@/lib/tanstack-query/infinite";
import type { GetNotificationsResponse } from "@/types/notification";
import { useMemo } from "react";

type PrivateActivityPageClientProps = {
  initialResponse?: GetNotificationsResponse | null;
};

export default function PrivateActivityPageClient({
  initialResponse,
}: PrivateActivityPageClientProps) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetNotificationsQuery({
    options: {
      initialData: toInfiniteInitialData(initialResponse),
      refetchOnMount: false,
      staleTime: 30_000,
    },
  });
  const notifications = useMemo(
    () => data?.pages.flatMap((page) => page.data ?? []) ?? [],
    [data],
  );

  return (
    <div className="min-h-full bg-background">
      <ActivityList
        notifications={notifications}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={Boolean(hasNextPage)}
        onLoadMore={() => {
          void fetchNextPage();
        }}
      />
    </div>
  );
}
