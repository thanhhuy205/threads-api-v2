import prisma from '@/config/prisma';
import { CreatePostDto } from '../dto/post.dto';

export type PostRecord = {
    id: number;
    content: string;
    authorId: number;
    createdAt: string;
};

class PostRepository {
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
