import { ReplyPermission, VisibilityPost } from "@prisma/client";
import { z } from "zod";

const mentionSchema = z.object({
  userId: z.string().trim().min(1, "Mention userId is required"),
  username: z.string().trim().min(1, "Mention username is required"),
});

const pollOptionSchema = z
  .string()
  .trim()
  .min(1, "Poll option text is required")
  .max(255, "Poll option text must be at most 255 characters");

const replyPermissionSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim().toUpperCase() : value),
  z.nativeEnum(ReplyPermission, {
    errorMap: () => ({
      message: `replyPermission must be one of: ${Object.values(ReplyPermission).join(", ")}`,
    }),
  }),
);

const visibilityPostSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim().toUpperCase() : value),
  z.nativeEnum(VisibilityPost, {
    errorMap: () => ({
      message: `visibility must be one of: ${Object.values(VisibilityPost).join(", ")}`,
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
  isSurvey: z.boolean().default(false),
  polls: z.array(pollOptionSchema).max(4, "Polls must be at most 4 options").optional(),
  replyPermission: replyPermissionSchema.default(ReplyPermission.EVERYONE),
  visibility: visibilityPostSchema.default(VisibilityPost.PUBLIC),
}).superRefine((payload, ctx) => {
  if (payload.mentions?.length) {
    const mentionIds = payload.mentions.map((mention) => mention.userId);
    const uniqueIds = new Set(mentionIds);

    if (uniqueIds.size !== mentionIds.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mentions must not contain duplicate users",
        path: ["mentions"],
      });
    }
  }

  if (payload.isSurvey && payload.polls && payload.polls?.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Polls must contain at least 2 options when isSurvey is true",
    });
  }

  if (payload.isSurvey && !payload.polls?.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Polls are required when isSurvey is true",
      path: ["polls"],
    });
  }

  if (payload.isSurvey && payload.polls && payload.polls.length >= 2) {
    const hasEmpty = payload.polls.some(item => item.trim() === "");

    if (hasEmpty) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Polls are required when isSurvey is true",
        path: ["polls"],
      });
    }
  }
});

export type CreatePostDto = z.infer<typeof createPostSchema>;

const updatePostSchema = z.object({
  content: z
    .string()
    .min(1, "Content must be at least 1 character")
    .max(5000, "Content must be at most 5000 characters")
    .optional(),
  visibility: visibilityPostSchema.optional(),
}).refine((payload) => payload.content !== undefined || payload.visibility !== undefined, {
  message: "At least one of content or visibility is required",
});

export type UpdatePostDto = z.infer<typeof updatePostSchema>;

export { createPostSchema, updatePostSchema };

