import { KnowledgeType, RiskLevel } from '@prisma/client';

export type CreateKnowledgeReasonPayload = {
    knowledgePostId: string;
    contentType: KnowledgeType;
    trustScore: number;
    riskLevel: RiskLevel;
    reason: string;
};

class KnowledgeReasonRepository {
    async create(payload: CreateKnowledgeReasonPayload): Promise<void> {
        // TODO: implement persistence logic
        return;
    }
}

export const knowledgeReasonRepository = new KnowledgeReasonRepository();
