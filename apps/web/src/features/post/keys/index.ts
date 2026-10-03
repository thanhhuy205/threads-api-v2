import { PER_PAGE } from "@/constant/pagination";
import {
  FeedType as FeedTypeEnum,
  type CursorPaginationResponse,
  type FeedType,
  type PostByUserQueryDto,
} from "@/types/post";

export const postKeys = {
  all: ["post"] as const,
  feeds: {
    base: ["post", "feeds"] as const,
    root: (type: FeedType = FeedTypeEnum.FOR_YOU) =>
      ["post", "feeds", type] as const,
    aggregate: (type: FeedType = FeedTypeEnum.FOR_YOU) =>
      ["post", "feeds", type, "aggregate"] as const,
    page: (type: FeedType = FeedTypeEnum.FOR_YOU, after?: string) =>
      ["post", "feeds", type, "page", after ?? null] as const,
  },
  followingFeeds: {
    root: ["post", "feeds", "following"] as const,
    aggregate: ["post", "feeds", "following", "aggregate"] as const,
    page: (after?: string) =>
      ["post", "feeds", "following", "page", after ?? null] as const,
  },
  replies: {
    root: ["post", "replies"] as const,
    aggregate: (publicId: string) =>
      ["post", "replies", publicId, "aggregate"] as const,
    page: (publicId: string, after?: string) =>
      ["post", "replies", publicId, "page", after ?? null] as const,
  },
  reposts: (username: string, after?: string) =>
    ["post", "reposts", username, after ?? null] as const,
  me: {
    postsRoot: (take: number = PER_PAGE) =>
      ["post", "me", "posts", "infinite", take] as const,
    repliesRoot: (take: number = PER_PAGE) =>
      ["post", "me", "replies", "infinite", take] as const,
    quotesRoot: (take: number = PER_PAGE) =>
      ["post", "me", "quotes", "infinite", take] as const,
    posts: (params?: CursorPaginationResponse) =>
      ["post", "me", "posts", params?.after ?? null, params?.take ?? PER_PAGE] as const,
    replies: (params?: CursorPaginationResponse) =>
      ["post", "me", "replies", params?.after ?? null, params?.take ?? PER_PAGE] as const,
    quotes: (params?: CursorPaginationResponse) =>
      ["post", "me", "quotes", params?.after ?? null, params?.take ?? PER_PAGE] as const,
  },
  user: {
    postsRoot: (username: string, take: number = PER_PAGE) =>
      ["post", "user", username, "posts", "infinite", take] as const,
    repliesRoot: (username: string, take: number = PER_PAGE) =>
      ["post", "user", username, "replies", "infinite", take] as const,
    quotesRoot: (username: string, take: number = PER_PAGE) =>
      ["post", "user", username, "quotes", "infinite", take] as const,
    posts: (params: PostByUserQueryDto) =>
      ["post", "user", params.username, "posts", params.after ?? null, params.take ?? PER_PAGE] as const,
    replies: (params: PostByUserQueryDto) =>
      ["post", "user", params.username, "replies", params.after ?? null, params.take ?? PER_PAGE] as const,
    quotes: (params: PostByUserQueryDto) =>
      ["post", "user", params.username, "quotes", params.after ?? null, params.take ?? PER_PAGE] as const,
  },
  single: (publicId: string) => ["post", "single", publicId] as const,
};
