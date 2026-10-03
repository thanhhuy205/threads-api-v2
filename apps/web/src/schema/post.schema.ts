import { ReplyPermission, VisibilityPost } from "@/types/post";
import { z } from "zod";

// ---------- base post fields ----------
const basePostFields = z.object({
  content: z.string().trim().min(1).max(5000),
  media: z.array(z.any()).optional(),
  topic: z.string().trim().min(1).optional(),
  mentions: z
    .array(
      z.object({
        userId: z.string().min(1),
        username: z.string().min(1),
      }),
    )
    .max(5)
    .optional(),
  replyPermission: z
    .enum([
      ReplyPermission.EVERYONE,
      ReplyPermission.FOLLOWERS,
      ReplyPermission.FOLLOWING,
      ReplyPermission.MENTIONED,
    ])
    .optional(),
  visibility: z
    .enum([
      VisibilityPost.WORKSPACE,
      VisibilityPost.PUBLIC,
      VisibilityPost.FRIEND,
      VisibilityPost.PRIVATE,
    ])
    .optional(),
  type: z.enum(["POST", "ANNOUNCEMENT"]).optional(),
});

// ---------- shared refinements ----------
function applyBaseRefinements<T extends typeof basePostFields>(schema: T) {
  return schema
    .refine(
      (data) => {
        if (!data.mentions?.length) return true;
        const uniqueUserIds = new Set(
          data.mentions.map((m) => m.userId),
        );
        return uniqueUserIds.size === data.mentions.length;
      },
      { message: "Mentions không được trùng userId", path: ["mentions"] },
    )
    ;
}

// ---------- createPostSchema (post mới) ----------
export const createPostSchema = applyBaseRefinements(basePostFields);

export type CreatePostInput = z.infer<typeof createPostSchema>;

// ---------- reply / quote dùng chung base ----------
export const replyPostSchema = applyBaseRefinements(basePostFields);
export type ReplyPostInput = z.infer<typeof replyPostSchema>;

export const quotePostSchema = applyBaseRefinements(basePostFields);
export type QuotePostInput = z.infer<typeof quotePostSchema>;

// ---------- visibility / update (không đổi) ----------
export const visibilityPostSchema = z.enum([
  VisibilityPost.WORKSPACE,
  VisibilityPost.PUBLIC,
  VisibilityPost.FRIEND,
  VisibilityPost.PRIVATE,
]);

export const updatePostSchema = z
  .object({
    content: z
      .string()
      .min(1, "Content must be at least 1 character")
      .max(5000, "Content must be at most 5000 characters")
      .optional(),
    visibility: visibilityPostSchema.optional(),
  })
  .refine(
    (payload) =>
      payload.content !== undefined || payload.visibility !== undefined,
    { message: "At least one of content or visibility is required" },
  );

export type UpdatePostInput = z.infer<typeof updatePostSchema>;
