import { z } from 'zod';

const createKnowledgePostSchema = z.object({
    learningGoal: z.string().min(1),
    commonConfusion: z.string().min(1),
    coreExplanation: z.string().min(1),
    understandingCheck: z.string().min(1),
});

export type CreateKnowledgePostDto = z.infer<typeof createKnowledgePostSchema>;

export { createKnowledgePostSchema };

