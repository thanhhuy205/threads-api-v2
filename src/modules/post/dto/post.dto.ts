import { z } from "zod";
import { ReplyPermission } from "@prisma/client";

const mentionSchema = z.object({
  userId: z.string().trim().min(1, "Mention userId is required"),
  username: z.string().trim().min(1, "Mention username is required"),
});

const replyPermissionSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim().toUpperCase() : value),
  z.nativeEnum(ReplyPermission, {
    errorMap: () => ({
      message: `replyPermission must be one of: ${Object.values(ReplyPermission).join(", ")}`,
    }),
  }),
);

const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Content must be at least 1 character")
    .max(5000, "Content must be at most 5000 characters"),
  topic: z
    .string()
    .trim()
    .min(1, "Topic must be at least 1 character")
    .max(255, "Topic must be at most 255 characters")
    .optional(),
  mentions: z.array(mentionSchema).max(5, "Mentions must be at most 5 users").optional(),
  media: z
    .array(
      z.object({
        id: z.number(),
        key: z.string(),
        url: z.string(),
      }),
    )
    .optional(),
  replyPermission: replyPermissionSchema.default(ReplyPermission.EVERYONE),
}).superRefine((payload, ctx) => {
  if (!payload.mentions?.length) {
    return;
  }

  const mentionIds = payload.mentions.map((mention) => mention.userId);
  const uniqueIds = new Set(mentionIds);

  if (uniqueIds.size !== mentionIds.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Mentions must not contain duplicate users",
      path: ["mentions"],
    });
  }
});

export type CreatePostDto = z.infer<typeof createPostSchema>;

export { createPostSchema };
