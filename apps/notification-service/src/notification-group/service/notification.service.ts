import type { CursorPaginationMeta } from '@/common/helpers/cursor-pagination.helper';
import type { MentionNotification, ReplyNotification } from '../events/notification.events';
import type {
  CreateNotificationGroupInput,
  EnqueuePendingNotificationInput,
  FindAllNotificationGroupsInput,
} from '../interface/notification.types';

export const NOTIFICATION_SERVICE = Symbol('NOTIFICATION_SERVICE');

export type NotificationLikeItem = {
  postPublicId: string;
  createdAt: Date;
  userId: string;
};

export interface NotificationService {
  onModuleInit(): void;
  create(data: CreateNotificationGroupInput): Promise<any>;
  findAll(input: FindAllNotificationGroupsInput): Promise<{
    rows: any[];
    pagination: CursorPaginationMeta;
  }>;
  hasUnread(recipientId: string): Promise<boolean>;
  enqueuePendingNotification(input: EnqueuePendingNotificationInput): Promise<string>;
  handleNewComment(notification: ReplyNotification): Promise<string>;
  handleMention(notification: MentionNotification): Promise<string>;
  sendLikeCountUpdateNotification(
    postPublicId: string,
    recipientId: string,
    likeCount: number,
    itemLike: NotificationLikeItem[],
  ): Promise<void>;
  markGroupAsRead(userId: string): Promise<void>;
}
