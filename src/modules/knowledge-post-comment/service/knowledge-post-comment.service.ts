import type { CreateKnowledgePostCommentPayload } from '../interfaces/create-knowledge-post-comment-payload';
import type { GetKnowledgePostCommentsPayload } from '../interfaces/get-knowledge-post-comments-payload';
import { knowledgePostCommentRepository } from '../repository/knowledge-post-comment.repository';

class KnowledgePostCommentService {
    async createReply(payload: CreateKnowledgePostCommentPayload) {
        return knowledgePostCommentRepository.createReply(payload);
    }

    async getReplyById(knowledgePostId: string, commentId: string) {
        return knowledgePostCommentRepository.getReplyById(knowledgePostId, commentId);
    }

    async getReplies(payload: GetKnowledgePostCommentsPayload) {
        return knowledgePostCommentRepository.getRepliesByKnowledgePostId(payload);
    }
}

export const knowledgePostCommentService = new KnowledgePostCommentService();
