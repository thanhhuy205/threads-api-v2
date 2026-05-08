import { z } from "zod";

const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Content must be at least 1 character")
    .max(5000, "Content must be at most 5000 characters"),
  media: z
    .array(
      z.object({
        id: z.number(),
        key: z.string(),
        url: z.string(),
      }),
    )
    .optional(),
});

export type CreatePostDto = z.infer<typeof createPostSchema>;

export { createPostSchema };
