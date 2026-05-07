import { baseLogger } from '@/middlewares/logger';
import { buildCursorPagination } from '@/shared/pagination/cursor-pagination';
import type { CreateKnowledgePostPayload } from '../interfaces/create-knowledge-post-payload';
import { knowledgePostRepository } from '../repository/knowledge-post.repository';

class KnowledgePostService {
    async findAll({ after, take }: { after?: string; take: number; }) {
        baseLogger.info(`Finding all knowledge posts with after: ${after}, take: ${take}`);
        const result = await knowledgePostRepository.findAll({
            where: {},
            take,
            after,
        });
        baseLogger.info(`Fetched knowledge posts - requested take: ${take}, actual fetched: ${result.length}, after cursor: ${after}`);
        return buildCursorPagination({
            rows: result,
            take,
            getAfter: (item) => item.id,
        });
    }

    async create(payload: CreateKnowledgePostPayload) {
        return knowledgePostRepository.create(payload);
    }

    async delete(id: string) {
        return knowledgePostRepository.deleteById(id);
    }
}

export const knowledgePostService = new KnowledgePostService();
