import prisma from '@/config/prisma';
import { BadRequestException } from '@/errors/error';
import type { Prisma } from '@prisma/client';
import type { CreateKnowledgePostCommentPayload } from '../interfaces/create-knowledge-post-comment-payload';
import type { GetKnowledgePostCommentsPayload } from '../interfaces/get-knowledge-post-comments-payload';

const COMMENT_CURSOR_PREFIX = 'cm';
const DEFAULT_TAKE = 10;
const MAX_COMMENT_ID = 2_147_483_647;

type RawKnowledgePostComment = {
    id: number;
    knowledgePostId: string;
    userId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
};

export type KnowledgePostCommentRecord = {
    id: string;
    knowledgePostId: string;
    userId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
};

export type KnowledgePostCommentCursorResult = {
    rows: KnowledgePostCommentRecord[];
    pageInfo: {
        take: number;
        after: string | null;
        hasMore: boolean;
    };
};

const encodeCommentId = (id: number): string => `${COMMENT_CURSOR_PREFIX}${id.toString(36)}`;

const decodeCommentId = (value: string): number | null => {
    const toValidatedId = (decoded: number) => {
        if (!Number.isInteger(decoded) || decoded <= 0 || decoded > MAX_COMMENT_ID) {
            return null;
        }

        return decoded;
    };

    if (value.startsWith(COMMENT_CURSOR_PREFIX)) {
        const raw = value.slice(COMMENT_CURSOR_PREFIX.length);
        const decoded = Number.parseInt(raw, 36);
        return toValidatedId(decoded);
    }

    const decoded = Number.parseInt(value, 10);
    return toValidatedId(decoded);
};

class KnowledgePostCommentRepository {
    private toRecord(comment: RawKnowledgePostComment): KnowledgePostCommentRecord {
        return {
            id: encodeCommentId(comment.id),
            knowledgePostId: comment.knowledgePostId,
            userId: comment.userId,
            content: comment.content,
            createdAt: comment.createdAt.toISOString(),
            updatedAt: comment.updatedAt.toISOString(),
        };
    }

    async createReply(payload: CreateKnowledgePostCommentPayload): Promise<KnowledgePostCommentRecord> {
        const comment = await prisma.knowledgePostComment.create({
            data: {
                knowledgePostId: payload.knowledgePostId,
                userId: payload.userId,
                content: payload.content,
            },
        });

        return this.toRecord(comment);
    }

    async getReplyById(knowledgePostId: string, commentId: string): Promise<KnowledgePostCommentRecord | null> {
        const decodedCommentId = decodeCommentId(commentId);
        if (!decodedCommentId) {
            throw new BadRequestException('Invalid comment id');
        }

        const comment = await prisma.knowledgePostComment.findFirst({
            where: {
                id: decodedCommentId,
                knowledgePostId,
            },
        });

        if (!comment) {
            return null;
        }

        return this.toRecord(comment);
    }

    async getRepliesByKnowledgePostId(payload: GetKnowledgePostCommentsPayload): Promise<KnowledgePostCommentCursorResult> {
        const currentTake = payload.take ?? DEFAULT_TAKE;
        const where: Prisma.KnowledgePostCommentWhereInput = {
            knowledgePostId: payload.knowledgePostId,
        };

        if (payload.after) {
            const decodedAfterId = decodeCommentId(payload.after);
            if (!decodedAfterId) {
                throw new BadRequestException('Invalid after cursor');
            }

            const cursorComment = await prisma.knowledgePostComment.findFirst({
                where: {
                    id: decodedAfterId,
                    knowledgePostId: payload.knowledgePostId,
                },
                select: {
                    id: true,
                    createdAt: true,
                },
            });

            if (!cursorComment) {
                return {
                    rows: [],
                    pageInfo: {
                        take: currentTake,
                        after: null,
                        hasMore: false,
                    },
                };
            }

            where.OR = [
                {
                    createdAt: {
                        lt: cursorComment.createdAt,
                    },
                },
                {
                    createdAt: cursorComment.createdAt,
                    id: {
                        lt: cursorComment.id,
                    },
                },
            ];
        }

        const comments = await prisma.knowledgePostComment.findMany({
            where,
            orderBy: [
                { createdAt: 'desc' },
                { id: 'desc' },
            ],
            take: currentTake + 1,
        });

        const hasMore = comments.length > currentTake;
        const rows = hasMore ? comments.slice(0, currentTake) : comments;
        const nextAfter = hasMore && rows.length ? encodeCommentId(rows[rows.length - 1].id) : null;

        return {
            rows: rows.map((comment) => this.toRecord(comment)),
            pageInfo: {
                take: currentTake,
                after: nextAfter,
                hasMore,
            },
        };
    }
}

export const knowledgePostCommentRepository = new KnowledgePostCommentRepository();
