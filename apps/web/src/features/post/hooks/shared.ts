import type { ApiError } from "@/types/axios";
import type { PostResponse, ReplyResponse, SinglePostResponse } from "@/types/post";
import {
  type QueryClient,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";

export type PostQueryOptions<TData> = Omit<
  UseQueryOptions<TData, ApiError, TData, QueryKey>,
  "queryKey" | "queryFn"
>;

export type PostMutationContext = {
  previous: Array<[QueryKey, unknown]>;
};

type UpdatablePost = {
  publicId: string;
  likesCount: number;
  repostsCountAndQuoteCount: number;
  repliesCount: number;
  isLikedByAuth?: boolean;
  isSavedByAuth?: boolean;
  isRepostByAuth?: boolean;
  isHiddenByAuth?: boolean;
  isFollowingAuthor?: boolean;
};



const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const hasPublicId = (value: unknown): value is UpdatablePost =>
  isObject(value) &&
  typeof value.publicId === "string" &&
  typeof value.likesCount === "number" &&
  typeof value.repostsCountAndQuoteCount === "number";

const isPostCollectionResponse = (
  value: unknown,
): value is PostResponse | ReplyResponse => {
  if (!isObject(value)) return false;
  if (!Array.isArray(value.data)) return false;

  return value.data.every(hasPublicId);
};

const isInfinitePostResponse = (
  value: unknown,
): value is { pages: Array<PostResponse | ReplyResponse>; pageParams: unknown[] } => {
  if (!isObject(value)) return false;
  if (!Array.isArray(value.pages)) return false;

  return value.pages.every(isPostCollectionResponse);
};

const isSinglePostResponse = (value: unknown): value is SinglePostResponse => {
  if (!isObject(value)) return false;
  if (!isObject(value.data)) return false;

  return typeof value.data.publicId === "string";
};

const updatePostInCacheValue = (
  cached: unknown,
  publicId: string,
  updater: (post: UpdatablePost) => void,
) => {
  if (isInfinitePostResponse(cached)) {
    const nextPages = cached.pages.map((page) => {
      const index = page.data.findIndex((post) => post.publicId === publicId);
      if (index < 0) return page;

      const nextData = [...page.data];
      const nextPost = { ...nextData[index] };
      updater(nextPost);
      nextData[index] = nextPost;

      return {
        ...page,
        data: nextData,
      };
    });

    return {
      ...cached,
      pages: nextPages,
    };
  }

  if (isPostCollectionResponse(cached)) {
    const index = cached.data.findIndex((post) => post.publicId === publicId);
    if (index < 0) return cached;

    const nextData = [...cached.data];
    const nextPost = { ...nextData[index] };
    updater(nextPost);
    nextData[index] = nextPost;

    return {
      ...cached,
      data: nextData,
    };
  }

  if (isSinglePostResponse(cached)) {
    if (cached.data.publicId !== publicId) return cached;

    const nextPost = { ...cached.data };
    updater(nextPost);

    return {
      ...cached,
      data: nextPost,
    };
  }

  return cached;
};

export const applyOptimisticPostPatch = (
  queryClient: QueryClient,
  postBaseKey: QueryKey,
  publicId: string,
  updater: (post: UpdatablePost) => void,
) => {
  queryClient.setQueriesData(
    {
      queryKey: postBaseKey,
    },
    (oldData) => updatePostInCacheValue(oldData, publicId, updater),
  );
};

export const restorePostSnapshots = (
  queryClient: QueryClient,
  context?: PostMutationContext,
) => {
  if (!context) return;

  for (const [queryKey, data] of context.previous) {
    queryClient.setQueryData(queryKey, data);
  }
};
