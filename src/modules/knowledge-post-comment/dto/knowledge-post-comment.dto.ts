import { z } from 'zod';

const createKnowledgePostCommentSchema = z.object({
    content: z.string().trim().min(1),
});

export type CreateKnowledgePostCommentDto = z.infer<typeof createKnowledgePostCommentSchema>;

export { createKnowledgePostCommentSchema };
