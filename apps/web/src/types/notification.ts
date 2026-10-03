import type { BaseResponse } from "./api";

export type NotificationType =
  | "POST"
  | "QUOTE"
  | "SHARE"
  | "MENTION"
  | "INVITATION"
  | "REPLY"
  | "LIKE"
  | "REPOST"
  | "FOLLOW"
  | "MESSAGE"
  | string;
export type NotificationTargetType =
  | "POST"
  | "post"
  | "USER"
  | "user"
  | "CIRCLE"
  | "circle"
  | "REPLY"
  | "COMMENT"
  | "MESSAGE"
  | "FOLLOW"
  | string;

export type NotificationItem = {
  publicId: string;
  type: NotificationType;
  targetType: NotificationTargetType;
  targetId?: string;
  count: number;
  isRead: boolean;
  createdAt: string;
  lastEventAt: string;
  actorIds?: string[];
  lastActor: {
    username: string;
    avatar: string | null;
  };
  originPost?: {
    publicId: string;
    content?: string;
  };
  targetPost?: {
    publicId: string;
    content?: string;
    likesCount?: number;
    repliesCount?: number;
    repostsCountAndQuoteCount?: number;
    replyPermission?: string;
  };
};

export type NotificationPagination = {
  take: number;
  after: string | null;
  hasMore: boolean;
};

export type GetNotificationsResponse = {
  success: boolean;
  data: NotificationItem[];
  pagination: NotificationPagination;
};

export type GetNotificationUnreadData = {
  isNotification: boolean;
};

export type GetNotificationUnreadResponse =
  BaseResponse<GetNotificationUnreadData>;

export type GetNotificationMessageData = {
  unreadGroupCount: number;
};

export type GetNotificationMessageResponse =
  BaseResponse<GetNotificationMessageData>;

