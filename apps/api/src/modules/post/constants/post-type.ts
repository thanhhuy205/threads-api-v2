import { PostType } from "../../../../generated/prisma";

export const creatablePostTypes = [
  PostType.ANNOUNCEMENT,
  PostType.POST,
] as const;

export const primaryPostTypes = [PostType.POST] as const;
