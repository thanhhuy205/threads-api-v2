import { z } from "zod";

const baseSearchQuerySchema = z.object({
  q: z.string().trim().min(1, "Query is required"),
  after: z.string().trim().min(1, "Cursor must not be empty").optional(),
  take: z.coerce
    .number()
    .int("Take must be an integer")
    .positive("Take must be a positive number")
    .max(100, "Take must be at most 100")
    .default(20),
});

export const searchPostsQuerySchema = baseSearchQuerySchema.extend({
  serp_type: z.enum(["default"]).default("default"),
});

export const searchUsernameQuerySchema = baseSearchQuerySchema;
export const searchTopicQuerySchema = baseSearchQuerySchema;

export type SearchPostsQueryDto = z.infer<typeof searchPostsQuerySchema>;
export type SearchUsernameQueryDto = z.infer<typeof searchUsernameQuerySchema>;
export type SearchTopicQueryDto = z.infer<typeof searchTopicQuerySchema>;
