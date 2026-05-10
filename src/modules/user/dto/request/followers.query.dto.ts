import { z } from "zod";

export const followersQuerySchema = z.object({
  after: z.string().trim().min(1, "Cursor must not be empty").optional(),
  take: z
    .coerce.number()
    .int("Take must be an integer")
    .positive("Take must be a positive number")
    .max(100, "Take must be at most 100")
    .optional(),
});

export type FollowersQueryDto = z.infer<typeof followersQuerySchema>;
