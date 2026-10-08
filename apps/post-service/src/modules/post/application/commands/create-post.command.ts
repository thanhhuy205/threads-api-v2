import type { PostType, VisibilityPost } from '@purse/common/enums';
import type { UserSnapshot } from '../result';

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

export type RepositoryCreatePostPayload = Omit<CreatePostCommand, 'isSurvey'> & {
  isSurvey?: boolean;
  type?: PostType;
};

export type CreateRepostPayload = {
  userId: string;
  content?: string;
};

export type CreateReplyData = {
  parentPostId: number;
  parentPublicId: string;
  rootPostId: number;
  rootPublicId: string;
  userSnapshot: UserSnapshot;
};

export type CreateRepostData = {
  originPublicId: string;
  originPostId: number;
  userSnapshot: UserSnapshot;
};

export type CreateQuoteData = CreateRepostData;
