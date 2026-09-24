import { Logger } from '@nestjs/common';
import { Post, Prisma } from '../../../../../../generated/prisma/client';

import type {
  PostRecord,
  UserSnapshot,
} from '../../../../application/ports/inbound/post.repository';

export const postFeedSelect = {
  publicId: true, userId: true, content: true, visibility: true, type: true,
  isPinned: true, dateRangeFrom: true, dateRangeTo: true,
  scheduledTimeFrom: true, scheduledTimeTo: true,
  groupTeamId: true,
  // MAINTENANCE: groupTeam: { select: { publicId: true, name: true } },
  parentId: true, parentPublicId: true, originPostId: true, rootPostId: true,
  rootPublicId: true, isQuote: true,
  // MAINTENANCE: origin: true, parent: true,
  userSnapshot: true, likesCount: true, viewsCount: true, isSurvey: true,
  createdAt: true,
  repliesCount: true, repostsCountAndQuoteCount: true,
  // MAINTENANCE: poll/media/mentions/topicsPosts relation selects.
} satisfies Prisma.PostSelect;

export const postSelectRepository = {
  id: true, publicId: true, content: true, contentJson: true, type: true,
  userId: true, visibility: true, isPinned: true, dateRangeFrom: true,
  dateRangeTo: true, scheduledTimeFrom: true, scheduledTimeTo: true,
  groupTeamId: true, createdAt: true, userSnapshot: true,
} satisfies Prisma.PostSelect;

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
  media: any[];
  groupTeam?: any;
  origin?: any;
  parent?: any;
  isLikedByAuth: boolean;
  isRepostByAuth: boolean;
  isSavedByAuth: boolean;
  isReply: boolean;
  isRepost: boolean;
  isQuote: boolean;
  repliesCount: number;
  repostsCountAndQuoteCount: number;
  topics: string[];
  mentions: {
    userId: string;
    username: string;
  }[];
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
export class PostMapper {
  private static readonly logger = new Logger(PostMapper.name, { timestamp: true });

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
      type: post.type,
      isPinned: post.isPinned,
      visibility: post.visibility,
      createdAt: post.createdAt.toISOString() ?? new Date().toISOString(),
    };
  }

  static toFeedResponse(post: any, userId?: string): PostFeedResponse {

    this.logger.log(
      `Mapping post with id ${post.publicId} to feed response for user ${userId}. Post derivatives: ${JSON.stringify(post.derivatives)}, Likes: ${JSON.stringify(post.likes)}`,
    );

    const topics: string[] =
      post?.topicsPosts
        ?.map((tp: { topic?: { name?: string | null } | null }) => tp.topic?.name)
        .filter((name: string | null | undefined): name is string => !!name) ?? [];

    const repliesCount = post.repliesCount ?? post._count?.children ?? 0;
    const repostsCountAndQuoteCount = post.repostsCountAndQuoteCount ?? post._count?.derivatives ?? 0;
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
      type: post.type,
      isPinned: post.isPinned,
      dateRangeFrom: post.dateRangeFrom,
      dateRangeTo: post.dateRangeTo,
      scheduledTimeFrom: post.scheduledTimeFrom,
      scheduledTimeTo: post.scheduledTimeTo,
      groupTeamId: post.groupTeamId,
      groupTeam: post.groupTeam,
      parentId: post.parentId,
      parentPublicId: post.parentPublicId,
      originPostId: post.originPostId,
      rootPostId: post.rootPostId,
      rootPublicId: post.rootPublicId,
      userSnapshot: post.userSnapshot,
      likesCount: post.likesCount,
      repliesCount,
      repostsCountAndQuoteCount,
      topics: topics,
      isSurvey: post.isSurvey,
      poll: poll ?? null,
      isVoted,
      origin: post.origin,
      viewsCount: post.viewsCount,
      parent: post.parent,
      media: post.media?.map(({ ...media }) => media) ?? [],
      mentions: post.mentions?.map((m: { userId: string; user: { username: string } }) => ({
        userId: m.userId,
        username: m.user.username,
      })) ?? [],
      isLikedByAuth: Boolean(userId && post.likes?.length),
      isRepostByAuth: Boolean(
        userId && post.derivatives && post.derivatives.length > 0,
      ),
      isReply: post.parentId !== null,
      isRepost: post.originPostId !== null && !post.isQuote,
      isQuote: post.originPostId !== null && post.isQuote,
      isSavedByAuth,
    };
  }
}
