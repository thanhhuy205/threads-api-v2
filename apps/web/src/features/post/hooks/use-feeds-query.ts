import { getFeeds, getFeedsByFollowing } from "@/features/post/api/requests";
import { postKeys } from "@/features/post/keys";
import {
  FeedType,
  type FeedType as FeedTypeValue,
  type PostResponse,
} from "@/types/post";
import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import type { ApiError } from "@/types/axios";
import type { BaseInfiniteResponse } from "@/types/api";

type InfinitePostResponse = BaseInfiniteResponse<PostResponse>;

type FeedsQueryOptions = Omit<
  UseInfiniteQueryOptions<
    PostResponse,
    ApiError,
    InfinitePostResponse,
    readonly unknown[],
    string | null
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

export const useGetFeedsQuery = (
  arg: { type?: FeedTypeValue },
  options?: FeedsQueryOptions,
) => {
  const feedType = arg.type ?? FeedType.FOR_YOU;

  return useInfiniteQuery({
    queryKey: postKeys.feeds.aggregate(feedType),
    queryFn: ({ pageParam }) =>
      getFeeds({
        after: pageParam ?? undefined,
        type: feedType,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.after : undefined,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetFeedsByFollowingQuery = (
  options?: FeedsQueryOptions,
) => {
  return useInfiniteQuery({
    queryKey: postKeys.followingFeeds.aggregate,
    queryFn: ({ pageParam }) =>
      getFeedsByFollowing({
        after: pageParam ?? undefined,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.after : undefined,
    refetchOnWindowFocus: false,
    ...options,
  });
};
