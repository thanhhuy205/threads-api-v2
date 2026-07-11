import { baseLogger } from "@/middlewares/logger";
import { Post, Prisma, UserStatus } from "@prisma/client";
import { postFeedSelect } from "../selector/post.selector";

import { PostRecord } from "../repository/post.repository";

type PostOriginItem = {
  publicId: string;
  userId: string;
};

export type PostFeedItem = Prisma.PostGetPayload<{
  select: typeof postFeedSelect;
}> & {
  _count?: {
    children: number;
    derivatives: number;
  };
  likes?: {
    userId: string;
  }[];
  derivatives?: PostOriginItem[] | null;
  postInteractions?: {
    userId: string;
  }[];
  isFollowingAuthor?: boolean;
  isFollowedByAuthor?: boolean;
};

export type PostFeedResponse = Omit<
  PostFeedItem,
  | "likes"
  | "topicsPosts"
  | "mentions"
  | "_count"
  | "derivatives"
  | "postInteractions"
> & {
  media: Array<Omit<NonNullable<PostFeedItem["media"]>[number], "postId">>;
  isLikedByAuth: boolean;
  isRepostByAuth: boolean;
  isSavedByAuth: boolean;
  isFollowingAuthor: boolean;
  isFollowedByAuthor: boolean;
  repliesCount: number;
  repostsCountAndQuoteCount: number;
  topics: string[];
  mentions: {
    userId: string;
    username: string;
  }[];
  isDisinformation: boolean;
  isSurvey: boolean;
  isVoted: boolean;
  poll: {
    id: number;
    expiresAt: Date;
    pollOptions: {
      id: number;
      option: string;
      voteCount: number;
    }[];
    isExpired: boolean;
    voteCount: number;
  } | null;
};
export type UserSnapshot = {
  id: string;
  bio: string | null;
  name: string;
  avatar: string;
  status: UserStatus;
  username: string;
  verifiedAt: Date | null;
};

export class PostMapper {
  static toUserSnapshot(user: any): UserSnapshot {
    return {
      id: user.id,
      bio: user.bio,
      name: user.name,
      avatar: user.avatar,
      status: user.status,
      username: user.username,
      verifiedAt: user.verifiedAt,
    };
  }
  static toPostRecord(post: Post, userId?: string): PostRecord {
    return {
      publicId: post.publicId,
      content: post.content!,
      userId: post.userId ?? userId,
      visibility: post.visibility,
      isDisinformation: post.isDisinformation,
      createdAt: post.createdAt.toISOString() ?? new Date().toISOString(),
    };
  }
  static toFeedResponse(post: any, userId?: string): PostFeedResponse {
    baseLogger.info(
      `Mapping post with id ${post.publicId} to feed response for user ${userId}. Post derivatives: ${JSON.stringify(post.derivatives)}, Likes: ${JSON.stringify(post.likes)}`,
    );
    const topics: string[] =
      post?.topicsPosts
        ?.map((tp: { topic?: { name?: string | null } | null }) => tp.topic?.name)
        .filter((name: string | null | undefined): name is string => !!name) ?? [];

    const repliesCount = post._count?.children ?? 0;
    const repostsCountAndQuoteCount = post._count?.derivatives ?? 0;
    const poll = post.poll ?? null;
    const isVoted = post.poll?.pollOptions.some((op: {
      votes: [
        {
          pollOptionId: number
        }
      ]
    }) => op.votes != null) ?? false;

    const isSavedByAuth = Boolean(userId && post.postInteractions?.length);
    return {
      userId: post.userId,
      createdAt: post.createdAt,
      publicId: post.publicId,
      content: post.content,
      visibility: post.visibility,
      parentId: post.parentId,
      originPostId: post.originPostId,
      rootPostId: post.rootPostId,
      userSnapshot: post.userSnapshot,
      replyPermission: post.replyPermission,
      likesCount: post.likesCount,
      repliesCount,
      repostsCountAndQuoteCount,
      topics: topics,
      isGhost: post.isGhost,
      isSurvey: post.isSurvey,
      isDisinformation: post.isDisinformation,
      poll: poll ?? null,
      isVoted,
      origin: post.origin,
      viewsCount: post.viewsCount,
      parent: post.parent,
      media: post.media?.map(({ ...media }) => media) ?? [],
      mentions: post.mentions.map((m: { userId: string; user: { username: string } }) => ({
        userId: m.userId,
        username: m.user.username,
      })),
      isLikedByAuth: Boolean(userId && post.likes?.length),
      isRepostByAuth: Boolean(
        userId && post.derivatives && post.derivatives.length > 0,
      ),
      isFollowingAuthor: post.isFollowingAuthor ?? false,
      isFollowedByAuthor: post.isFollowedByAuthor ?? false,
      isSavedByAuth,
    };
  }
}
