import type { BaseResponse, CursorAfterPaginationResponse } from "./api";

export type SearchPostsSerpType = "default";

export type SearchPostsQueryDto = {
  q: string;
  after?: string;
  take?: number;
  serp_type?: SearchPostsSerpType;
};

// Username search only requires q
export type SearchUsernameQueryDto = {
  q: string;
};

// Topic search only requires q
export type SearchTopicQueryDto = {
  q: string;
};

export type SearchPostMentionItem = {
  userId: string;
  user: {
    username: string;
  };
};

export type SearchPostTopicItem = {
  topic: {
    name: string;
  };
};

export type SearchPostItem = {
  publicId: string;
  userId: string;
  content: string | null;
  visibility: string;
  parentId: number | null;
  originPostId: number | null;
  origin: string | null;
  parent: Record<string, unknown> | null;
  rootPostId: number | null;
  userSnapshot: Record<string, unknown>;
  replyPermission: string;
  likesCount: number;
  repliesCount: number;
  repostsCountAndQuoteCount: number;
  viewsCount: number;
  isGhost: boolean;
  isDisinformation: boolean;
  createdAt: string;
  media: Record<string, unknown>[];
  mentions: SearchPostMentionItem[];
  topicsPosts: SearchPostTopicItem[];
};

// Simplified to match API spec: { id, username, name, avatar, verifiedAt }
export type SearchUsernameItem = {
  id: string;
  username: string;
  name: string | null;
  avatar: string | null;
  verifiedAt: string | null;
};

// Simplified to match API spec: { name, count }
export type SearchTopicItem = {
  name: string;
  count: number;
};

// Search Posts — paginated with cursor
export type SearchPostsResponse = {
  success: true;
  data: SearchPostItem[];
  pagination: CursorAfterPaginationResponse;
};

// Search Username — simple list, no pagination
export type SearchUsernameResponse = BaseResponse<SearchUsernameItem[]> & {
  message: string;
};

// Search Topic — simple list, no pagination
export type SearchTopicResponse = BaseResponse<SearchTopicItem[]> & {
  message: string;
};
