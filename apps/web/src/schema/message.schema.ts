import { z } from "zod";

export type GroupType = "PRIVATE" | "CROWD";

export const createMessageGroupSchema = z.object({
  type: z
    .enum(["private", "crowd"], {
      message: "type must be private or crowd",
    })
    .transform((value) => value.toUpperCase() as GroupType),
  members: z
    .array(z.string().trim().min(1, "username is required"))
    .min(1, "members must contain at least one username"),
});

export type CreateMessageGroupDto = z.infer<typeof createMessageGroupSchema>;

export const createMessageSchema = z.object({
  clientMessageId: z.string().trim().min(1, "clientMessageId is required"),
  content: z
    .string()
    .trim()
    .min(1, "content is required")
    .max(1000, "content must be at most 1000 characters"),
});

export type CreateMessageDto = z.infer<typeof createMessageSchema>;
