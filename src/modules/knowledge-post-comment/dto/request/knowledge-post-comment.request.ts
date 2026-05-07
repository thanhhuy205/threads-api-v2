import { z } from 'zod';
import { createKnowledgePostCommentSchema } from '../knowledge-post-comment.dto';

export const createKnowledgePostCommentRequestSchema = createKnowledgePostCommentSchema;
export type CreateKnowledgePostCommentRequestDto = z.infer<typeof createKnowledgePostCommentRequestSchema>;

export const knowledgePostIdParamsSchema = z.object({
    knowledgePostId: z.string().min(1),
});

export type KnowledgePostIdParamsDto = z.infer<typeof knowledgePostIdParamsSchema>;

export const knowledgePostCommentIdParamsSchema = knowledgePostIdParamsSchema.extend({
    commentId: z.string().min(1),
});

export type KnowledgePostCommentIdParamsDto = z.infer<typeof knowledgePostCommentIdParamsSchema>;

export const getKnowledgePostCommentQuerySchema = z.object({
    after: z.string().trim().min(1).optional(),
    take: z.coerce.number().int().positive().max(100).optional(),
});

export type GetKnowledgePostCommentQueryDto = z.infer<typeof getKnowledgePostCommentQuerySchema>;
