import prisma from '@/config/prisma';
import type { Prisma } from '@prisma/client';
import type { CreateKnowledgePostCommentPayload } from '../interfaces/create-knowledge-post-comment-payload';
import type { KnowledgePostCommentRecord } from '../mapper/knowledge-post-comment.mapper';
import { toRecord } from '../mapper/knowledge-post-comment.mapper';


class KnowledgePostCommentRepository {
    async createReply(payload: CreateKnowledgePostCommentPayload): Promise<KnowledgePostCommentRecord> {
        const comment = await prisma.knowledgePostComment.create({
            data: {
                knowledgePostId: payload.knowledgePostId,
                userId: payload.userId,
                content: payload.content,
            },
        });

        return toRecord(comment);
    }

    async getReplyById(knowledgePostId: string, commentPublicId: string): Promise<KnowledgePostCommentRecord | null> {
        const comment = await prisma.knowledgePostComment.findFirst({
            where: {
                publicId: commentPublicId,
                knowledgePostId,
            },
        });

        if (!comment) {
            return null;
        }

        return toRecord(comment);
    }
    async findMany(params: {
        where: Prisma.KnowledgePostCommentWhereInput;
        orderBy: Prisma.KnowledgePostCommentOrderByWithRelationInput[];
        take: number;
    }) {
        return prisma.knowledgePostComment.findMany({
            where: params.where,
            orderBy: params.orderBy,
            take: params.take,
        });
    }
    async findCursorInfo(knowledgePostId: string, publicId: string) {
        return prisma.knowledgePostComment.findFirst({
            where: {
                publicId,
                knowledgePostId,
            },
            select: {
                id: true,
                createdAt: true,
            },
        });
    }
}

export const knowledgePostCommentRepository = new KnowledgePostCommentRepository();
