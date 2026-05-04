import { z } from 'zod';

const createPostSchema = z.object({
    content: z.string().min(1).max(5000),
    media: z.array(
        z.object({
            id: z.number(),
            key: z.string(),
            url: z.string(),
        }),
    ).optional(),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;

export { createPostSchema };

