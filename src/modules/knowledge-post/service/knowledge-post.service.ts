import type { CreateKnowledgePostPayload } from '../interfaces/create-knowledge-post-payload';
import { knowledgePostRepository } from '../repository/knowledge-post.repository';

class KnowledgePostService {
    async create(payload: CreateKnowledgePostPayload) {
        return knowledgePostRepository.create(payload);
    }

    async delete(id: string) {
        return knowledgePostRepository.deleteById(id);
    }
}

export const knowledgePostService = new KnowledgePostService();
