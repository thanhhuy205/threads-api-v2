import { z } from 'zod';

const createKnowledgePostSchema = z.object({
    learningGoal: z.string().min(1, 'Learning goal is required'),
    commonConfusion: z.string().min(1, 'Common confusion is required'),
    coreExplanation: z.string().min(1, 'Core explanation is required'),
    understandingCheck: z.string().min(1, 'Understanding check is required'),
});

export type CreateKnowledgePostDto = z.infer<typeof createKnowledgePostSchema>;

export { createKnowledgePostSchema };
