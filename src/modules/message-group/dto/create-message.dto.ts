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

export const updateMessageStatusSchema = z.object({
  isDelivery: z.boolean({
    required_error: "isDelivery is required",
    invalid_type_error: "isDelivery must be a boolean",
  }),
});

export type UpdateMessageStatusDto = z.infer<typeof updateMessageStatusSchema>;
