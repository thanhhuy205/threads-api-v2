import { z } from 'zod';
import { createKnowledgeRankingSchema } from '../knowledge-ranking.dto';

export const createKnowledgeRankingRequestSchema = createKnowledgeRankingSchema;
export type CreateKnowledgeRankingRequestDto = z.infer<typeof createKnowledgeRankingRequestSchema>;

export const knowledgePostIdParamsSchema = z.object({
    knowledgePostId: z.string().min(1),
});

export type KnowledgePostIdParamsDto = z.infer<typeof knowledgePostIdParamsSchema>;
