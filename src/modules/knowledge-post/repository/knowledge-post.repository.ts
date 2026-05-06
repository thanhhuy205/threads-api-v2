import prisma from '@/config/prisma';
import type { CreateKnowledgePostPayload } from '../interfaces/create-knowledge-post-payload';

export type KnowledgePostRecord = {
    id: string;
    userId: string;
    learningGoal: string;
    commonConfusion: string;
    coreExplanation: string;
    understandingCheck: string;
    status: string;
    approvalStatus: string;
    createdAt: string;
    updatedAt: string;
};

class KnowledgePostRepository {
    async create(payload: CreateKnowledgePostPayload): Promise<KnowledgePostRecord> {
        const knowledgePost = await prisma.knowledgePost.create({
            data: {
                userId: payload.userId,
                learningGoal: payload.learningGoal,
                commonConfusion: payload.commonConfusion,
                coreExplanation: payload.coreExplanation,
                understandingCheck: payload.understandingCheck
            },
        });

        return {
            id: knowledgePost.id,
            userId: knowledgePost.userId,
            learningGoal: knowledgePost.learningGoal,
            commonConfusion: knowledgePost.commonConfusion,
            coreExplanation: knowledgePost.coreExplanation,
            understandingCheck: knowledgePost.understandingCheck,
            status: knowledgePost.status,
            approvalStatus: knowledgePost.approvalStatus,
            createdAt: knowledgePost.createdAt.toISOString(),
            updatedAt: knowledgePost.updatedAt.toISOString(),
        };
    }

    async deleteById(id: string): Promise<void> {
        await prisma.knowledgePost.delete({
            where: { id },
        });
    }
}

export const knowledgePostRepository = new KnowledgePostRepository();
