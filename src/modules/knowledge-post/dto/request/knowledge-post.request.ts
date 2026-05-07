import { z } from 'zod';
import { createKnowledgePostSchema } from '../knowledge-post.dto';

export const createKnowledgePostRequestSchema = createKnowledgePostSchema.extend({
    userId: z.string().min(1),
});

export type CreateKnowledgePostRequestDto = z.infer<typeof createKnowledgePostRequestSchema>;

export const knowledgePostIdParamsSchema = z.object({
    id: z.string().min(1),
});

export type KnowledgePostIdParamsDto = z.infer<typeof knowledgePostIdParamsSchema>;




export const getKnowledgePostQuerySchema = z.object({
    after: z.string().trim().min(1).optional(),
    take: z.coerce.number().int().positive().max(100).optional(),
});

export type GetKnowledgePostQueryDto = z.infer<typeof getKnowledgePostQuerySchema>;
