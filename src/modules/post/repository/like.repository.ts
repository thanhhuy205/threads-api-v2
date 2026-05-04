import { NotFoundException } from '@/errors/error';
import prisma from '@/config/prisma';
import type { CreateLikeInput } from '../interfaces/create-like-input';
import { postRepository } from './post.repository';

class LikeRepository {
    async upsert(payload: CreateLikeInput) {
        const post = await postRepository.findByPublicId(payload.publicId);

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        return prisma.like.upsert({
            where: {
                userId_postId: {
                    userId: payload.userId,
                    postId: post.id,
                },
            },
            update: {
                isLike: payload.isLiked,
            },
            create: {
                postId: post.id,
                userId: payload.userId,
                isLike: payload.isLiked,
            },
        });
    }
}

export const likeRepository = new LikeRepository();