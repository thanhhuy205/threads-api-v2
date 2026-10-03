import { postKeys } from "@/features/post/keys";
import { getReplies } from "@/features/post/api/get-replies";
import type { ReplyResponse } from "@/types/post";
import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import type { ApiError } from "@/types/axios";
import type { BaseInfiniteResponse } from "@/types/api";

type InfiniteReplyResponse = BaseInfiniteResponse<ReplyResponse>;

type RepliesQueryOptions = Omit<
  UseInfiniteQueryOptions<
    ReplyResponse,
    ApiError,
    InfiniteReplyResponse,
    readonly unknown[],
    string | null
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;

export const useGetRepliesQuery = (
  arg: { publicId: string },
  options?: RepliesQueryOptions,
) => {
  return useInfiniteQuery({
    queryKey: postKeys.replies.aggregate(arg.publicId),
    queryFn: ({ pageParam }) =>
      getReplies({
        publicId: arg.publicId,
        after: pageParam ?? undefined,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.after : undefined,
    refetchOnWindowFocus: false,
    ...options,
  });
};
