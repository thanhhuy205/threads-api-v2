import { PostType } from '@purse/common/enums';

export const creatablePostTypes = [
  PostType.ANNOUNCEMENT,
  PostType.POST,
] as const;

export const primaryPostTypes = [PostType.POST] as const;
