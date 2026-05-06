import prisma from '@/config/prisma';
import type { CreateKnowledgeRankingPayload } from '../interfaces/create-knowledge-ranking-payload';

export type KnowledgeRankingRecord = {
    id: number;
    knowledgePostId: string;
    userId: string;
    criteria: string;
    createdAt: string;
};

class KnowledgeRankingRepository {
    async create(payload: CreateKnowledgeRankingPayload): Promise<KnowledgeRankingRecord> {
        const ranking = await prisma.knowledgeRanking.create({
            data: {
                knowledgePostId: payload.knowledgePostId,
                userId: payload.userId,
                criteria: payload.criteria,
            },
        });

        return {
            id: ranking.id,
            knowledgePostId: ranking.knowledgePostId,
            userId: ranking.userId,
            criteria: ranking.criteria,
            createdAt: ranking.createdAt.toISOString(),
        };
    }

    async findByKnowledgePostId(knowledgePostId: string): Promise<KnowledgeRankingRecord[]> {
        const rankings = await prisma.knowledgeRanking.findMany({
            where: { knowledgePostId },
            orderBy: { createdAt: 'desc' },
        });

        return rankings.map((ranking) => ({
            id: ranking.id,
            knowledgePostId: ranking.knowledgePostId,
            userId: ranking.userId,
            criteria: ranking.criteria,
            createdAt: ranking.createdAt.toISOString(),
        }));
    }
}

export const knowledgeRankingRepository = new KnowledgeRankingRepository();
