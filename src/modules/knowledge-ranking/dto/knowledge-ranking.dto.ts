import { RankingCriteria } from '@prisma/client';
import { z } from 'zod';

const createKnowledgeRankingSchema = z.object({
    criteria: z.nativeEnum(RankingCriteria),
});

export type CreateKnowledgeRankingDto = z.infer<typeof createKnowledgeRankingSchema>;

export { createKnowledgeRankingSchema };

