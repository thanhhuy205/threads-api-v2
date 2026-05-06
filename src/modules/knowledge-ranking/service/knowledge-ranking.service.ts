import type { CreateKnowledgeRankingPayload } from '../interfaces/create-knowledge-ranking-payload';
import { knowledgeRankingRepository } from '../repository/knowledge-ranking.repository';

class KnowledgeRankingService {
    async create(payload: CreateKnowledgeRankingPayload) {
        return knowledgeRankingRepository.create({
            ...payload,

        });
    }

    async findByKnowledgePostId(knowledgePostId: string) {
        return knowledgeRankingRepository.findByKnowledgePostId(knowledgePostId);
    }
}

export const knowledgeRankingService = new KnowledgeRankingService();
