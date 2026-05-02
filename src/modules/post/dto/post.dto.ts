import { z } from 'zod';

const createPostSchema = z.object({
    content: z.string().min(1).max(5000),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;

export { createPostSchema };

