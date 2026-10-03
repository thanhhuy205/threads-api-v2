import type { BaseResponse, MessageResponse } from "./api";

export const VisibilityPost = {
  WORKSPACE: "WORKSPACE",
  PUBLIC: "PUBLIC",
  FRIEND: "FRIEND",
  PRIVATE: "PRIVATE",
} as const;

export type VisibilityPost =
  (typeof VisibilityPost)[keyof typeof VisibilityPost];

export const ReplyPermission = {
  EVERYONE: "EVERYONE",
  FOLLOWERS: "FOLLOWERS",
  FOLLOWING: "FOLLOWING",
  MENTIONED: "MENTIONED",
} as const;

export type ReplyPermission =
  (typeof ReplyPermission)[keyof typeof ReplyPermission];

export const FeedType = {
  FOR_YOU: "for_you",
  FOLLOWING: "following",
  FRIEND: "friends",
} as const;

export type FeedType = (typeof FeedType)[keyof typeof FeedType];

export const PostStatus = {
  APPROVED: "approved",
  PENDING: "pending",
  DELETED: "deleted",
} as const;

export const PostType = {
  POST: "POST",
  ANNOUNCEMENT: "ANNOUNCEMENT",
  DISCUSSION: "DISCUSSION",
  KNOWLEDGE: "KNOWLEDGE",
  QUESTION: "QUESTION",
  INCIDENT: "INCIDENT",
  INCIDENT_UPDATE: "INCIDENT_UPDATE",
  FEEDBACK: "FEEDBACK",
} as const;

export type PostTypeStatus = (typeof PostType)[keyof typeof PostType];

export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus];

export interface BasePost {
  id: number;
  userId: number;
  content: string;
  parentId: number | null;
  originalPostId: number | null;
  isQuote: boolean;
  replyPermission: ReplyPermission;
  visibility: VisibilityPost;
  requiresReplyApproval: boolean;
  status: PostStatus | string;
  isGhost: boolean;
  ghostExpiresAt: string | null;
  topicId: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UserSnapshot {
  id: string;
  name: string;
  avatar: string | null;
  username: string;
  bio?: string | null;
  status?: string;
  verifiedAt?: string | null;
}

export interface MediaItem {
  url: string;
  type: "image" | "video";
  width?: number;
  height?: number;
  alt?: string;
}

export interface Mention {
  userId: string;
  username?: string;
  userName?: string;
  offset?: number;
  length?: number;
}

export interface PostItem {
  publicId: string;
  userId: string;
  content: string | null;
  type?: PostTypeStatus;
  parentId: string | number | null;
  originPostId: number | null;
  parent: PostItem | Record<string, unknown> | null;
  rootPostId: string | number | null;
  userSnapshot: UserSnapshot;
  replyPermission: ReplyPermission;
  visibility: VisibilityPost | string;
  likesCount: number;
  repliesCount: number;
  repostsCountAndQuoteCount: number;
  viewsCount: number;
  createdAt: string;
  dateRangeFrom?: string | null;
  dateRangeTo?: string | null;
  scheduledTimeFrom?: string | null;
  scheduledTimeTo?: string | null;
  media: MediaItem[];
  mentions: Mention[];
  topics?: string[];
  topicsPosts?: Array<{ topic?: { name?: string } }>;
  origin?: OriginalPost | Record<string, unknown> | null;
  isGhost: boolean;
  isFollowingAuthor: boolean;
  isFollowedByAuthor: boolean;
  // Các field từ auth context (thêm vào khi có user đăng nhập)
  isLikedByAuth: boolean;
  isSavedByAuth: boolean;
  isRepostByAuth: boolean;
  // Giữ lại cho tương thích ngược (nếu cần)
  original_post?: OriginalPost | null;
}

export interface OriginalPost {
  publicId: string;
  userId: string;
  content: string | null;
  parentId: string | number | null;
  originPostId: number | null;
  parent: PostItem | Record<string, unknown> | null;
  rootPostId: string | number | null;
  userSnapshot: UserSnapshot;
  replyPermission: ReplyPermission;
  visibility: VisibilityPost | string;
  likesCount: number;
  repliesCount: number;
  repostsCountAndQuoteCount: number;
  viewsCount: number;
  createdAt: string;
  media: MediaItem[];
  mentions: Mention[];
  isGhost: boolean;
  isFollowingAuthor: boolean;
  isFollowedByAuthor: boolean;
}

export interface ReplyData {
  publicId: string;
  userId: string;
  content: string | null;
  parentId: string | number | null;
  originPostId: number | null;
  parent: PostItem | Record<string, unknown> | null;
  rootPostId: string | number | null;
  userSnapshot: UserSnapshot;
  replyPermission: ReplyPermission;
  visibility: VisibilityPost | string;
  likesCount: number;
  repliesCount: number;
  repostsCountAndQuoteCount: number;
  viewsCount: number;
  createdAt: string;
  media: MediaItem[];
  mentions: Mention[];
  isGhost: boolean;
  isFollowingAuthor: boolean;
  isFollowedByAuthor: boolean;
}

export type ReplyItem = ReplyData;

export interface CursorPaginationResponse {
  after?: string;
  hasMore?: boolean;
  take: number;
}

export interface PublicIdParamsDto {
  publicId: string;
}

export interface UserIdParamsDto {
  username: string;
}

export interface PostByUserQueryDto extends UserIdParamsDto {
  after: string | undefined;
  take: number;
}

export interface PostMediaInput {
  id: number;
  key: string;
  url: string;
}

export interface MentionInput {
  userId: string;
  username: string;
}

export interface ScheduleDateRange {
  from?: string;
  to?: string;
}

export interface CreatePostDto {
  content: string;
  contentJson?: string;
  topic?: string;
  mentions?: MentionInput[];
  media?: PostMediaInput[];
  replyPermission?: ReplyPermission;
  type?: PostTypeStatus;
  visibility?: VisibilityPost;
  dateRangeFrom?: string;
  dateRangeTo?: string;
  scheduledTimeFrom?: string;
  scheduledTimeTo?: string;
}

export interface ReplyPostArgs extends PublicIdParamsDto {
  payload: CreatePostDto;
}

export interface QuotePostArgs extends PublicIdParamsDto, CreatePostDto { }

export interface ReportDto {
  reason: string;
  type: ReportRequestType;
}

export interface ReportPostArgs extends PublicIdParamsDto, ReportDto { }

export type ReportRequestType = "post" | "user";
export type ReportTargetType = "POST" | "USER" | string;
export type ReportStatus = "PENDING" | "APPROVED" | "REJECTED" | string;

export interface ReportSubmission {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  evaluationQueued: boolean;
}

export interface ReportPostData {
  reported: boolean;
  report: ReportSubmission;
}

export interface PostResponse {
  success: boolean;
  data: PostItem[];
  pagination: CursorPaginationResponse;
}

export interface ReplyResponse {
  success: boolean;
  data: ReplyData[];
  pagination: CursorPaginationResponse;
}

export type SinglePostResponse = BaseResponse<PostItem>;
export type CreatePostResponse = BaseResponse<PostItem>;

export type CreatePostBody = CreatePostDto;
export type CreatePostReplyBody = CreatePostDto;

export interface UpdatePostDto {
  content?: string;
  visibility?: VisibilityPost;
}

export interface DeletePostData {
  deleted: boolean;
}

export type DeletePostResponse = BaseResponse<DeletePostData>;

export interface LikeData {
  isLiked: boolean;
  likesCount: number;
}

export interface RepostData {
  isReposted: boolean;
  repostsAndQuotesCount: number;
}

export interface SaveData {
  isSaved: boolean;
}

export type LikePostResponse = BaseResponse<LikeData>;
export type RepostPostResponse = BaseResponse<RepostData>;
export type SavePostResponse = BaseResponse<SaveData>;
export type ReportPostResponse = BaseResponse<ReportPostData>;
export type PostHidden = MessageResponse;

export interface SimilarPostsRequest {
  content: string;
  topic: string[];
}

export interface SimilarPostItem {
  userSnapshot: UserSnapshot;
  content: string;
  publicId: string;
  createdAt: string;
}

export type SimilarPostsResponse = BaseResponse<SimilarPostItem[]>;
