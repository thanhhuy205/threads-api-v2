import { Prisma } from '@prisma/client';
import { postFeedSelect } from '../selector/post.selector';

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
    origin?: PostOriginItem | PostOriginItem[] | null;
};

export type PostFeedResponse = Omit<PostFeedItem, 'likes'> & {
    isLikedByAuth: boolean;
    isRepostByAuth: boolean;
    origin: PostOriginItem | null;
};

export class PostMapper {
    static toFeedResponse(post: PostFeedItem, userId?: string): PostFeedResponse {
        const origin = Array.isArray(post.origin)
            ? post.origin[0] ?? null
            : post.origin ?? null;

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
            origin,
            parent: post.parent,
            media: post.media,
            mentions: post.mentions,
            isLikedByAuth: Boolean(userId && post.likes?.length),
            isRepostByAuth: Boolean(userId && origin),
        };
    }
}