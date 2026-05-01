import { z } from 'zod';

const createPostSchema = z.object({
    content: z.string().min(1).max(5000),
    authorId: z.coerce.number().int().positive(),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;

export { createPostSchema };

