import { Prisma } from '@prisma/client';
import { postFeedSelect } from '../selector/post.selector';

export type PostFeedItem = Prisma.PostGetPayload<{
    select: typeof postFeedSelect;
}> & {
    likes?: {
        userId: string;
    }[];
};

export type PostFeedResponse = Omit<PostFeedItem, 'likes'> & {
    isLikedByAuth: boolean;
};

export class PostMapper {
    static toFeedResponse(post: PostFeedItem, userId?: string): PostFeedResponse {
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
            viewsCount: post.viewsCount,
            isGhost: post.isGhost,
            parent: post.parent,
            media: post.media,
            mentions: post.mentions,
            isLikedByAuth: Boolean(userId && post.likes?.length),
        };
    }
}