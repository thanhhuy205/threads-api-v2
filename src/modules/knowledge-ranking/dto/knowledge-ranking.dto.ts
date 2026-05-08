import { RankingCriteria } from '@prisma/client';
import { z } from 'zod';

const createKnowledgeRankingSchema = z.object({
    criteria: z.nativeEnum(RankingCriteria, {
        errorMap: () => ({ message: `Criteria must be one of: ${Object.values(RankingCriteria).join(', ')}` }),
    }),
});

export type CreateKnowledgeRankingDto = z.infer<typeof createKnowledgeRankingSchema>;

export { createKnowledgeRankingSchema };
