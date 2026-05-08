import { z } from 'zod';
import { createKnowledgePostSchema } from '../knowledge-post.dto';

export const createKnowledgePostRequestSchema = createKnowledgePostSchema.extend({
    userId: z.string().min(1, 'User ID is required'),
});

export type CreateKnowledgePostRequestDto = z.infer<typeof createKnowledgePostRequestSchema>;

export const knowledgePostIdParamsSchema = z.object({
    id: z.string().min(1, 'Knowledge post ID is required'),
});

export type KnowledgePostIdParamsDto = z.infer<typeof knowledgePostIdParamsSchema>;

export const getKnowledgePostQuerySchema = z.object({
    after: z.string().trim().min(1, 'Cursor must not be empty').optional(),
    take: z.coerce.number().int('Take must be an integer').positive('Take must be a positive number').max(100, 'Take must be at most 100').optional(),
});

export type GetKnowledgePostQueryDto = z.infer<typeof getKnowledgePostQuerySchema>;
