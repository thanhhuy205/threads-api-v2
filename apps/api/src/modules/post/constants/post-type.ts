import { PostType } from "@prisma/client";

export const creatablePostTypes = [
  PostType.ANNOUNCEMENT,
  PostType.POST,
] as const;

export const primaryPostTypes = [PostType.POST] as const;
