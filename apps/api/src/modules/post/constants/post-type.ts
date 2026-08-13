import { PostType } from "@prisma/client";

export const creatablePostTypes = [
  PostType.ANNOUNCEMENT,
] as const;

export const primaryPostTypes = [PostType.POST, ...creatablePostTypes] as const;
