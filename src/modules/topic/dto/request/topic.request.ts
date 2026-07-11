import { z } from "zod";

export const topicNameParamsSchema = z.object({
  name: z.string().trim().min(1, "Topic name is required").max(255, "Topic name must be at most 255 characters"),
});

export type TopicNameParamsDto = z.infer<typeof topicNameParamsSchema>;

export const createTopicSchema = z.object({
  name: z.string().trim().min(1, "Topic name is required").max(255, "Topic name must be at most 255 characters"),
});

export const searchTopicQuerySchema = z.object({
  q: z.string().trim().min(1, "Query is required"),
  after: z.string().trim().min(1, "Cursor must not be empty").optional(),
  take: z.coerce.number().int("Take must be an integer").positive("Take must be a positive number").max(100, "Take must be at most 100").optional(),
});

export type SearchTopicQueryDto = z.infer<typeof searchTopicQuerySchema>;
export type CreateTopicDto = z.infer<typeof createTopicSchema>;
