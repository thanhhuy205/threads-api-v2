import { PostType } from "@prisma/client";

export const creatablePostTypes = [
  PostType.ANNOUNCEMENT,
  PostType.DISCUSSION,
  PostType.KNOWLEDGE,
  PostType.QUESTION,
  PostType.INCIDENT,
  PostType.FEEDBACK,
] as const;

export const primaryPostTypes = [PostType.POST, ...creatablePostTypes] as const;
