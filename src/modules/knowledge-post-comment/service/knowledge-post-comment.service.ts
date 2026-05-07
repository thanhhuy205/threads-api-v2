import { toRecord } from '@/modules/knowledge-post-comment/mapper/knowledge-post-comment.mapper';
import { buildCursorPagination, buildPagination } from '@/shared/pagination/cursor-pagination';
import { Prisma } from '@prisma/client';
import type { CreateKnowledgePostCommentPayload } from '../interfaces/create-knowledge-post-comment-payload';
import type { GetKnowledgePostCommentsPayload } from '../interfaces/get-knowledge-post-comments-payload';
import { knowledgePostCommentRepository } from '../repository/knowledge-post-comment.repository';

class KnowledgePostCommentService {
    async createReply(payload: CreateKnowledgePostCommentPayload) {
        return knowledgePostCommentRepository.createReply(payload);
    }

    async getReplyById(knowledgePostId: string, commentPublicId: string) {
        return knowledgePostCommentRepository.getReplyById(knowledgePostId, commentPublicId);
    }

    async getReplies(payload: GetKnowledgePostCommentsPayload) {
        const { currentAfter, currentLimit } = buildPagination({
            after: payload.after,
            take: payload.take,
        });

        // 1. Lấy thông tin cursor (nếu có)
        let cursorInfo = null;
        if (currentAfter) {
            cursorInfo = await knowledgePostCommentRepository.findCursorInfo(
                payload.knowledgePostId,
                currentAfter,
            );

            if (!cursorInfo) {
                throw new Error('Invalid cursor');
            }
        }

        const where: Prisma.KnowledgePostCommentWhereInput = {
            knowledgePostId: payload.knowledgePostId,
        };

        if (cursorInfo) {
            where.OR = [
                {
                    createdAt: {
                        lt: cursorInfo.createdAt,
                    },
                },
                {
                    createdAt: cursorInfo.createdAt,
                    id: {
                        lt: cursorInfo.id,
                    },
                },
            ];
        }

        const comments = await knowledgePostCommentRepository.findMany({
            where,
            orderBy: [
                { createdAt: 'desc' },
                { id: 'desc' },
            ],
            take: currentLimit + 1,  // lấy thêm 1 bản ghi để xác định xem còn trang tiếp theo hay không
        });

        return buildCursorPagination({
            rows: comments.map((comment) => toRecord(comment)),
            take: currentLimit,
            getAfter: (comment) => comment.publicId,
        });
    }
}

export const knowledgePostCommentService = new KnowledgePostCommentService();
