"use client";

import SkeletonFetch from "@/app/[locale]/(main)/_components/common/Skeleton/SkeletonFetch";
import SkeletonPost from "@/app/[locale]/(main)/_components/common/Skeleton/SkeletonPost";
import InfiniteList from "@/app/[locale]/(main)/_components/post/InfiniteList";
import PostCard from "@/app/[locale]/(main)/_components/post/PostCard";
import { mapPost } from "@/features/post/map";
import { useSearchPostsQuery } from "@/features/search";
import { useDebounceSearch } from "@/hooks/use-debouce-search";
import { toInfiniteInitialData } from "@/lib/tanstack-query/infinite";
import type { SearchPostItem, SearchPostsResponse } from "@/types/search";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type SearchPostsTabProps = {
  initialPage?: SearchPostsResponse | null;
  initialQuery?: string;
  query: string;
  isActive: boolean;
};

export default function SearchPostsTab({
  initialPage,
  initialQuery,
  query,
  isActive,
}: SearchPostsTabProps) {
  const router = useRouter();
  const value = useDebounceSearch({ query });
  const hasQuery = Boolean(value.trim());
  const shouldFetch = isActive && hasQuery;
  const isDebouncing = isActive && query.trim() !== value.trim();
  const seededPage =
    value.trim() === initialQuery?.trim() ? initialPage : undefined;

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSearchPostsQuery({
    query: { q: value, serp_type: "default" },
    options: {
      enabled: shouldFetch,
      initialData: toInfiniteInitialData(seededPage),
      refetchOnMount: false,
      staleTime: 30_000,
    },
  });

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data?.pages],
  );

  if (!isActive) return null;

  if (isDebouncing || (isLoading && !data)) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonPost key={`search-post-skeleton-${index}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-primary-foreground">
      <InfiniteList
        data={posts}
        endReached={() => {
          if (!isFetchingNextPage && hasNextPage) {
            void fetchNextPage();
          }
        }}
        continuePage={Boolean(hasNextPage)}
        skeleton={<SkeletonFetch />}
        contentNotFoundItem="Không tìm thấy bài viết phù hợp."
        contentNotFoundCheck={posts.length === 0}
        itemContent={(_index, post: SearchPostItem) => {
          const mappedPost = mapPost(post);

          return (
            <PostCard
              onClick={() => {
                const username = mappedPost.user?.username;

                if (username) {
                  router.push(`/${username}/post/${mappedPost.publicId}`);
                } else {
                  router.push(`/post/${mappedPost.publicId}`);
                }
              }}
              post={mappedPost}
            />
          );
        }}
      />
    </div>
  );
}
