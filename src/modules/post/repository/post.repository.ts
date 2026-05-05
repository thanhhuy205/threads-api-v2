import prisma from '@/config/prisma';
import { baseLogger } from '@/middlewares/logger';
import { postFeedSelect } from '@/modules/post/selector/post.selector';
import { buildPagination } from '@/shared/pagination/pagination';
import { PostType, Prisma } from '@prisma/client';
import { CreatePostDto } from '../dto/post.dto';

export type PostRecord = {
    id?: number;
    publicId: string;
    content: string;
    userId: string;
    createdAt: string;
};

type CreatePostPayload = CreatePostDto & {
    userId: string;
    media?: {
        id: number;
        key: string;
        url: string;
    }[];
};

type CreateRepostPayload = CreatePostDto & {
    userId: string;
}



class PostRepository implements IPagination<Prisma.PostWhereInput, any> {
    findAll({
        page,
        limit,
        where,
        props: { userId, orderBy }
    }: {
        page: number;
        limit: number;
        where?: Prisma.PostWhereInput;
        props: { orderBy?: any, userId?: string | null };
    }) {
        const { currentLimit, offset } = buildPagination({ page, limit });
        const sortOrder = orderBy ?? { createdAt: 'desc' };

        baseLogger.info(`${JSON.stringify(where)}`);
        baseLogger.info(`Finding posts with where: ${where ? JSON.stringify(where) : 'none'}, orderBy: ${JSON.stringify(sortOrder)}, limit: ${currentLimit}, offset: ${offset}`);
        return prisma.post.findMany({
            where: where ?? {},
            orderBy: sortOrder,
            skip: offset,
            take: currentLimit,
            select: {
                ...postFeedSelect,
                ...(userId
                    ? {
                        likes: {
                            where: {
                                userId: userId,
                                isLike: true,
                            },
                            select: {
                                userId: true,
                            },
                            take: 1,
                        },
                        origin: {
                            where: {
                                isQuote: true,
                                userId: userId
                            },
                            select: {
                                publicId: true,
                                userId: true,
                            },
                            take: 1,
                        }
                    }
                    : {}),
            },
        });
    }


    count({ where = {} }: { where?: Prisma.PostWhereInput } = {}) {
        return prisma.post.count({ where });
    }


    async create(payload: CreatePostPayload, userSnapshot: {
        id: string;
        username: string;
        bio: string | null;
        avatar: string | null;
        followersCount: number;
    }): Promise<PostRecord> {
        const post = await prisma.post.create({
            data: {
                content: payload.content,
                userId: payload.userId,
                userSnapshot,
                media: payload.media?.length
                    ? {
                        connect: payload.media.map((media) => ({
                            id: media.id,
                        })),
                    }
                    : undefined,
            },

            select: {
                id: true,
                publicId: true,
                content: true,
                userId: true,
                createdAt: true,
                userSnapshot: true,
            },
        });

        return {
            id: post.id,
            publicId: post.publicId,
            content: post.content,
            userId: post.userId,
            createdAt: post.createdAt.toISOString(),
        };
    }

    async createReply(payload: CreatePostPayload, parentPublicId: string, userSnapshot: {
        id: string;
        username: string;
        bio: string | null;
        avatar: string | null;
        followersCount: number;
    }) {
        const post = await prisma.post.create({
            data: {
                content: payload.content,
                userId: payload.userId,
                parentPublicId,
                userSnapshot,
                type: PostType.REPLY
            },
            select: {
                id: true,
                publicId: true,
                content: true,
                userId: true,
                createdAt: true,
                userSnapshot: true,
            },
        });

        return {
            id: post.id,
            publicId: post.publicId,
            content: post.content!,
            userId: post.userId,
            createdAt: post.createdAt.toISOString(),
        };
    }


    async createRepost(payload: CreateRepostPayload, originPublicId: string, userSnapshot: {
        id: string;
        username: string;
        bio: string | null;
        avatar: string | null;
        followersCount: number;
    }) {
        const post = await prisma.post.create({
            data: {
                userId: payload.userId,
                originPublicId,
                content: '', // for repost, content is empty
                userSnapshot,
                type: PostType.REPOST
            },
            select: {
                id: true,
                publicId: true,
                content: true,
                userId: true,
                createdAt: true,
                userSnapshot: true,
            },
        });

        return {
            id: post.id,
            publicId: post.publicId,
            userId: post.userId,
            createdAt: post.createdAt.toISOString(),
        };
    }

    async createQuote(payload: CreatePostPayload, originPublicId: string, userSnapshot: {
        id: string;
        username: string;
        bio: string | null;
        avatar: string | null;
        followersCount: number;
    }) {
        const post = await prisma.post.create({
            data: {
                content: payload.content,
                userId: payload.userId,
                originPublicId,
                userSnapshot,
                type: PostType.QUOTE
            },
            select: {
                id: true,
                publicId: true,
                content: true,
                userId: true,
                createdAt: true,
                userSnapshot: true,
            },
        });

        return {
            id: post.id,
            publicId: post.publicId,
            content: post.content!,
            userId: post.userId,
            createdAt: post.createdAt.toISOString(),
        };
    }


    async list(): Promise<PostRecord[]> {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                publicId: true,
                content: true,
                userId: true,
                createdAt: true,
            },
        });

        return posts.map((post) => ({
            publicId: post.publicId,
            content: post.content,
            userId: post.userId,
            createdAt: post.createdAt.toISOString(),
        }));
    }
    async findByPublicId(publicId: string) {
        return prisma.post.findUnique({
            where: { publicId },
            select: {
                id: true,
                ...postFeedSelect,
            },
        });
    }

    async updateIsGhost(publicId: string, isGhost: boolean): Promise<void> {
        await prisma.post.update({
            where: { publicId },
            data: { isGhost },
        });
    }
}

export const postRepository = new PostRepository();
