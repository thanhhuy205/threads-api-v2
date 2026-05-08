import { z } from 'zod';
import { createKnowledgePostCommentSchema } from '../knowledge-post-comment.dto';

export const createKnowledgePostCommentRequestSchema = createKnowledgePostCommentSchema;
export type CreateKnowledgePostCommentRequestDto = z.infer<typeof createKnowledgePostCommentRequestSchema>;

export const knowledgePostIdParamsSchema = z.object({
    knowledgePostId: z.string().min(1, 'Knowledge post ID is required'),
});

export type KnowledgePostIdParamsDto = z.infer<typeof knowledgePostIdParamsSchema>;

export const knowledgePostCommentPublicIdParamsSchema = knowledgePostIdParamsSchema.extend({
    commentPublicId: z.string().min(1, 'Comment public ID is required'),
});

export type KnowledgePostCommentPublicIdParamsDto = z.infer<typeof knowledgePostCommentPublicIdParamsSchema>;

export const getKnowledgePostCommentQuerySchema = z.object({
    after: z.string().trim().min(1, 'Cursor must not be empty').optional(),
    take: z.coerce.number().int('Take must be an integer').positive('Take must be a positive number').max(100, 'Take must be at most 100').optional(),
});

export type GetKnowledgePostCommentQueryDto = z.infer<typeof getKnowledgePostCommentQuerySchema>;
