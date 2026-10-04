"use client";

import LoadingFetch from "@/app/[locale]/(main)/_components/common/LoadingFetch";
import SkeletonFetch from "@/app/[locale]/(main)/_components/common/Skeleton/SkeletonFetch";
import ContentNotFound from "@/app/[locale]/(main)/_components/post/ContentNotFound";
import BusinessCommunityMock from "@/app/[locale]/(main)/_components/post/BusinessCommunityMock";
import FeedTabs, {
  type FeedFilter,
} from "@/app/[locale]/(main)/_components/post/FeedTabs";
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
} from "@/types/post";
import type { User } from "@/types/user";
import { keepPreviousData } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { KeepAlive } from "react-activation";

type FeedQueryMode = "feed" | "following";
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
  const [activeFilter, setActiveFilter] = useState<FeedFilter>("LATEST");
  const [searchQuery, setSearchQuery] = useState("");

  const feeds = data?.pages.flatMap((page) => page.data) ?? [];

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredFeeds = feeds.filter((post) => {
    const matchesTab =
      activeFilter === "LATEST" ||
      (activeFilter === "ANNOUNCEMENT" && post.type === "ANNOUNCEMENT") ||
      (activeFilter === "PINNED" && post.isSavedByAuth);
    const matchesSearch =
      !normalizedSearchQuery ||
      post.content?.toLowerCase().includes(normalizedSearchQuery) ||
      post.userSnapshot?.username
        ?.toLowerCase()
        .includes(normalizedSearchQuery) ||
      post.userSnapshot?.name?.toLowerCase().includes(normalizedSearchQuery);

    return matchesTab && matchesSearch;
  });

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
      <div className="mx-auto min-h-full w-full max-w-5xl space-y-3 bg-background px-3 py-4 sm:px-5 sm:py-5">
        <FeedTabs
          value={activeFilter}
          onChange={setActiveFilter}
          query={searchQuery}
          onQueryChange={setSearchQuery}
        />
        <PostForm variant="feed" />
        {!normalizedSearchQuery ? (
          <BusinessCommunityMock filter={activeFilter} />
        ) : null}

        {emptyState === "home" && !hasNextPage && filteredFeeds.length === 0 ? (
          normalizedSearchQuery ? (
            <div className="rounded-2xl border border-[#f3f4f6] bg-white px-5 py-12 text-center text-sm text-[#6c737f]">
              Không tìm thấy cuộc trò chuyện phù hợp.
            </div>
          ) : null
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
              <div className="pb-3">
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
              </div>
            )}
          />
        )}
      </div>
    </KeepAlive>
  );
}
