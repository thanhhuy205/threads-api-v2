import type { CreateKnowledgePostDto } from '@/modules/knowledge-post/dto/knowledge-post.dto';

export type CreateKnowledgePostPayload = CreateKnowledgePostDto & {
    userId: string;
};
