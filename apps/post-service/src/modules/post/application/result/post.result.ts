import type { PostType, VisibilityPost } from '@purse/common/enums';
import type { Prisma } from '../../../../generated/prisma/client';

export type PostRecord = {
  id?: number;
  publicId: string;
  content: string;
  contentJson?: Prisma.JsonValue;
  userId: string;
  type: PostType;
  visibility: VisibilityPost;
  isPinned?: boolean;
  dateRangeFrom?: Date | null;
  dateRangeTo?: Date | null;
  scheduledTimeFrom?: Date | null;
  scheduledTimeTo?: Date | null;
  groupTeamId?: number | null;
  createdAt: string;
};

export type UserSnapshot = {
  id: string;
  bio: string | null;
  name: string;
  avatar: string;
  status: string;
  username: string;
  verifiedAt: Date | null;
};
