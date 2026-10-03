import { getPostMe, getQuoteMe, getRepliesMe } from "@/features/post/api/requests";
import { postKeys } from "@/features/post/keys";
import type { BaseInfiniteResponse } from "@/types/api";
import type { ApiError } from "@/types/axios";
import type { PostResponse } from "@/types/post";
import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";

const MY_POST_TAKE = 10;

type InfiniteMyPostResponse = BaseInfiniteResponse<PostResponse>;

type MyPostQueryOptions = Omit<
  UseInfiniteQueryOptions<
    PostResponse,
    ApiError,
    InfiniteMyPostResponse,
    readonly unknown[],
    string | null
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

type UseGetMyPostQueryInput = {
  take?: number;
  options?: MyPostQueryOptions;
};

export const useGetMyPostsQuery = ({
  take = MY_POST_TAKE,
  options,
}: UseGetMyPostQueryInput = {}) =>
  useInfiniteQuery({
    ...options,
    queryKey: postKeys.me.postsRoot(take),
    queryFn: ({ pageParam }) =>
      getPostMe({
        take,
        after: pageParam ?? undefined,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.after : undefined,
    refetchOnWindowFocus: false,
  });

export const useGetMyRepliesQuery = ({
  take = MY_POST_TAKE,
  options,
}: UseGetMyPostQueryInput = {}) =>
  useInfiniteQuery({
    ...options,
    queryKey: postKeys.me.repliesRoot(take),
    queryFn: ({ pageParam }) =>
      getRepliesMe({
        take,
        after: pageParam ?? undefined,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.after : undefined,
    refetchOnWindowFocus: false,
  });

export const useGetMyQuotesQuery = ({
  take = MY_POST_TAKE,
  options,
}: UseGetMyPostQueryInput = {}) =>
  useInfiniteQuery({
    ...options,
    queryKey: postKeys.me.quotesRoot(take),
    queryFn: ({ pageParam }) =>
      getQuoteMe({
        take,
        after: pageParam ?? undefined,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.after : undefined,
    refetchOnWindowFocus: false,
  });
