import { baseLogger } from "@/middlewares/logger";
import { Prisma, User, UserStatus } from "@prisma/client";
import { postFeedSelect } from "../selector/post.selector";

type PostOriginItem = {
  publicId: string;
  userId: string;
};

export type PostFeedItem = Prisma.PostGetPayload<{
  select: typeof postFeedSelect;
}> & {
  likes?: {
    userId: string;
  }[];
  derivatives?: PostOriginItem[] | null;
};

export type PostFeedResponse = Omit<PostFeedItem, "likes"> & {
  isLikedByAuth: boolean;
  isRepostByAuth: boolean;
};
export type UserSnapshot = {
  id: string;
  bio: string;
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

  static toFeedResponse(post: PostFeedItem, userId?: string): PostFeedResponse {
    baseLogger.info(
      `Mapping post with id ${post.publicId} to feed response for user ${userId}. Post derivatives: ${JSON.stringify(post.derivatives)}, Likes: ${JSON.stringify(post.likes)}`,
    );
    return {
      userId: post.userId,
      createdAt: post.createdAt,
      publicId: post.publicId,
      content: post.content,
      parentId: post.parentId,
      originPostId: post.originPostId,
      rootPostId: post.rootPostId,
      userSnapshot: post.userSnapshot,
      replyPermission: post.replyPermission,
      likesCount: post.likesCount,
      repliesCount: post.repliesCount,
      repostsCountAndQuoteCount: post.repostsCountAndQuoteCount,
      origin: post.origin,
      viewsCount: post.viewsCount,
      isGhost: post.isGhost,
      parent: post.parent,
      media: post.media,
      mentions: post.mentions,
      isLikedByAuth: Boolean(userId && post.likes?.length),
      isRepostByAuth: Boolean(
        userId && post.derivatives && post.derivatives.length > 0,
      ),
    };
  }
}
