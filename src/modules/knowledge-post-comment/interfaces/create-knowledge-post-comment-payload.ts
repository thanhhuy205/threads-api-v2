import type { CreateKnowledgePostCommentDto } from '@/modules/knowledge-post-comment/dto/knowledge-post-comment.dto';

export type CreateKnowledgePostCommentPayload = CreateKnowledgePostCommentDto & {
    knowledgePostId: string;
    userId: string;
};
