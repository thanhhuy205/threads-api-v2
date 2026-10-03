"use client";

import LoadingFetch from "@/app/[locale]/(main)/_components/common/LoadingFetch";
import SkeletonFetch from "@/app/[locale]/(main)/_components/common/Skeleton/SkeletonFetch";
import ContentNotFound from "@/app/[locale]/(main)/_components/post/ContentNotFound";
import FeedTabs from "@/app/[locale]/(main)/_components/post/FeedTabs";
import InfiniteList from "@/app/[locale]/(main)/_components/post/InfiniteList";
import PostCard from "@/app/[locale]/(main)/_components/post/PostCard";
import PostForm from "@/app/[locale]/(main)/_components/post/PostForm";
import { useGetFeedsQuery } from "@/features/post/api";
import { mapPost } from "@/features/post/map";
import { toInfiniteInitialData } from "@/lib/tanstack-query/infinite";
import {
  FeedType,
  type FeedType as FeedTypeValue,
  type PostItem,
  type PostResponse,
  type PostTypeStatus,
} from "@/types/post";
import type { User } from "@/types/user";
import { keepPreviousData } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { KeepAlive } from "react-activation";

type FeedQueryMode = "feed" | "following";
type FeedFilter = "ALL" | "WORKSPACE" | PostTypeStatus;

type SeededFeedPageClientProps = {
  emptyState?: "home" | "plain";
  feedType?: FeedTypeValue;
  initialResponse?: PostResponse | null;
  initialUser?: User | null;
  queryMode?: FeedQueryMode;
  shouldFilterAuthUser?: boolean;
};

const SEEDED_QUERY_OPTIONS = {
  refetchOnMount: false,
  refetchOnReconnect: false,
  staleTime: 30_000,
};

const FEED_SCROLL_STORAGE_KEY = "thread-feed-scroll";

export default function SeededFeedPageClient({
  emptyState = "plain",
  feedType = FeedType.FOR_YOU,
  initialResponse,
  queryMode = "feed",
}: SeededFeedPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const scrollStorageKey = useMemo(
    () => `${FEED_SCROLL_STORAGE_KEY}:${pathname}:${queryMode}:${feedType}`,
    [feedType, pathname, queryMode],
  );

  const feedQuery = useGetFeedsQuery(
    { type: feedType },
    {
      ...SEEDED_QUERY_OPTIONS,
      enabled: queryMode === "feed",
      initialData:
        queryMode === "feed"
          ? toInfiniteInitialData(initialResponse)
          : undefined,
      placeholderData: keepPreviousData,
    },
  );

  const activeQuery = feedQuery;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    activeQuery;
  const [activeFilter, setActiveFilter] = useState<FeedFilter>("ALL");

  const feeds = data?.pages.flatMap((page) => page.data) ?? [];

  const filteredFeeds =
    activeFilter === "ALL"
      ? feeds
      : activeFilter === "WORKSPACE"
        ? feeds.filter((post) => post.visibility === "WORKSPACE")
        : feeds.filter((post) => post.type === activeFilter);

  const handleNavigateToDetail = (publicId: string, username?: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(scrollStorageKey, String(window.scrollY));
    }

    if (username) {
      router.push(`/${username}/post/${publicId}`, { scroll: false });
      return;
    }

    router.push(`/post/${publicId}`, { scroll: false });
  };

  if (!data && isLoading) {
    return <LoadingFetch />;
  }

  return (
    <KeepAlive>
      <div className="mx-auto min-h-full w-full bg-background">
        <FeedTabs value={activeFilter} onChange={setActiveFilter} />
        <PostForm variant="feed" />

        {emptyState === "home" && !hasNextPage && filteredFeeds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <p className="text-lg font-medium">Hiện chưa có thông báo gì mới</p>
          </div>
        ) : (
          <InfiniteList
            data={filteredFeeds}
            endReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            contentNotFoundItem={
              emptyState === "home" ? (
                <ContentNotFound />
              ) : (
                <>{filteredFeeds.length === 0 ? <ContentNotFound /> : ""}</>
              )
            }
            continuePage={hasNextPage || false}
            skeleton={<SkeletonFetch />}
            itemContent={(_index, post: PostItem) => (
              <PostCard
                presentation="feed"
                onClick={() => {
                  handleNavigateToDetail(
                    post.publicId,
                    post.userSnapshot?.username,
                  );
                }}
                post={mapPost(post)}
              />
            )}
          />
        )}
      </div>
    </KeepAlive>
  );
}
