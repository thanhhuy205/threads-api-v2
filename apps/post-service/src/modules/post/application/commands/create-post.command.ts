import type { PostType, VisibilityPost } from '../../../../generated/prisma/client';

export type PostMentionCommand = {
  userId: string;
  username: string;
};

export type PostMediaCommand = {
  id: number;
  key: string;
  url: string;
  type: string;
  status: string;
  width: number;
  height: number;
};

export type CreatePostCommand = {
  contentJson?: string;
  content: string;
  topic?: string;
  mentions?: PostMentionCommand[];
  media?: PostMediaCommand[];
  isSurvey?: boolean;
  polls?: string[];
  type?: PostType;
  replyPermission?: string;
  visibility?: VisibilityPost;
  groupPublicId?: string;
  isPinned?: boolean;
  dateRangeFrom?: Date | null;
  dateRangeTo?: Date | null;
  scheduledTimeFrom?: string | null;
  scheduledTimeTo?: string | null;
  userId: string;
  groupTeamId?: number;
};
