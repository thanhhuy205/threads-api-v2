import { z } from "zod";

export const createMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "content is required")
    .max(1000, "content must be at most 1000 characters"),
  clientMessageId: z.string().trim().min(1, "clientMessageId is required"),
});

export type CreateMessageDto = z.infer<typeof createMessageSchema>;
