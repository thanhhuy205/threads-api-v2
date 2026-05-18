import { z } from "zod";

export const topicNameParamsSchema = z.object({
  name: z.string().trim().min(1, "Topic name is required").max(255, "Topic name must be at most 255 characters"),
});

export type TopicNameParamsDto = z.infer<typeof topicNameParamsSchema>;

export const createTopicSchema = z.object({
  name: z.string().trim().min(1, "Topic name is required").max(255, "Topic name must be at most 255 characters"),
});

export type CreateTopicDto = z.infer<typeof createTopicSchema>;
