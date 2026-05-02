import prisma from '@/config/prisma';
import { postFeedSelect } from '@/modules/post/selector/post.selector';
import { buildPagination } from '@/shared/pagination/pagination';
import { Prisma } from '@prisma/client';
import { CreatePostDto } from '../dto/post.dto';

export type PostRecord = {
    id: number;
    content: string;
    authorId: string;
    createdAt: string;
};

class PostRepository implements IPagination<Prisma.PostWhereInput, any> {
    findAll({
        page,
        limit,
        where,
        orderBy
    }: {
        page: number;
        limit: number;
        where?: Prisma.PostWhereInput;
        orderBy?: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[];
    }) {
        const { currentLimit, offset } = buildPagination({ page, limit });
        const sortOrder = orderBy ?? { createdAt: 'desc' };

        return prisma.post.findMany({
            where: where ?? {},
            orderBy: sortOrder,
            skip: offset,
            take: currentLimit,
            select: postFeedSelect
        });
    }


    count({ where = {} }: { where?: Prisma.PostWhereInput } = {}) {
        return prisma.post.count({ where });
    }


    async create(payload: CreatePostDto): Promise<PostRecord> {
        const post = await prisma.post.create({
            data: {
                content: payload.content,
                userId: payload.authorId,
            },
            select: {
                id: true,
                content: true,
                userId: true,
                createdAt: true,
            },
        });

        return {
            id: post.id,
            content: post.content,
            authorId: post.userId,
            createdAt: post.createdAt.toISOString(),
        };
    }



    async list(): Promise<PostRecord[]> {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                content: true,
                userId: true,
                createdAt: true,
            },
        });

        return posts.map((post) => ({
            id: post.id,
            content: post.content,
            authorId: post.userId,
            createdAt: post.createdAt.toISOString(),
        }));
    }
}

export const postRepository = new PostRepository();
