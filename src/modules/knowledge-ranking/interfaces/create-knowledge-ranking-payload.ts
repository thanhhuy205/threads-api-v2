import type { CreateKnowledgeRankingDto } from '@/modules/knowledge-ranking/dto/knowledge-ranking.dto';

export type CreateKnowledgeRankingPayload = CreateKnowledgeRankingDto & {
    knowledgePostId: string;
    userId: string;
};
