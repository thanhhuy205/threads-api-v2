import {
  getPostsByUser,
  getQuotesByUser,
  getRepliesByUser,
} from "@/features/post/api/requests";
import { postKeys } from "@/features/post/keys";
import type { BaseInfiniteResponse } from "@/types/api";
import type { ApiError } from "@/types/axios";
import type { PostResponse } from "@/types/post";
import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";

const USER_POST_TAKE = 10;

type InfiniteUserPostResponse = BaseInfiniteResponse<PostResponse>;

type UserPostQueryOptions = Omit<
  UseInfiniteQueryOptions<
    PostResponse,
    ApiError,
    InfiniteUserPostResponse,
    readonly unknown[],
    string | null
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

type UseGetUserPostQueryInput = {
  query: {
    username: string;
    take?: number;
  };
  options?: UserPostQueryOptions;
};

export const useGetPostsByUserQuery = ({
  query,
  options,
}: UseGetUserPostQueryInput) =>
  useInfiniteQuery({
    ...options,
    queryKey: postKeys.user.postsRoot(query.username, query.take ?? USER_POST_TAKE),
    queryFn: ({ pageParam }) =>
      getPostsByUser({
        username: query.username,
        take: query.take ?? USER_POST_TAKE,
        after: pageParam ?? undefined,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.after : undefined,
    refetchOnWindowFocus: false,
  });

export const useGetRepliesByUserQuery = ({
  query,
  options,
}: UseGetUserPostQueryInput) =>
  useInfiniteQuery({
    ...options,
    queryKey: postKeys.user.repliesRoot(query.username, query.take ?? USER_POST_TAKE),
    queryFn: ({ pageParam }) =>
      getRepliesByUser({
        username: query.username,
        take: query.take ?? USER_POST_TAKE,
        after: pageParam ?? undefined,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.after : undefined,
    refetchOnWindowFocus: false,
  });

export const useGetQuotesByUserQuery = ({
  query,
  options,
}: UseGetUserPostQueryInput) =>
  useInfiniteQuery({
    ...options,
    queryKey: postKeys.user.quotesRoot(query.username, query.take ?? USER_POST_TAKE),
    queryFn: ({ pageParam }) =>
      getQuotesByUser({
        username: query.username,
        take: query.take ?? USER_POST_TAKE,
        after: pageParam ?? undefined,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.after : undefined,
    refetchOnWindowFocus: false,
  });

export const useGetQuoteQuery = useGetQuotesByUserQuery;
