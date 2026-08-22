import type { NotificationType } from '../model/notification.model';
import type { Prisma } from '@threads/notification-prisma-client';

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');

export type CreateNotificationInput = {
  recipientId: string;
  type: NotificationType;
  targetType: string;
  targetId: string;
  actorIds: any;
  lastActorId: string;
  lastActor?: { id: string; username: string; avatar: string };
  lastEventAt: Date;
  count?: number;
  isRead?: boolean;
};

export type CreateManyNotificationsInput = CreateNotificationInput & {
  originPostId: string;
};

export interface NotificationRepository {
  findAll(input: {
    after?: string;
    take?: number;
    where?: Record<string, any>;
    orderBy?: Prisma.NotificationOrderByWithRelationInput;
  }): Promise<any[]>;
  create(data: CreateNotificationInput): Promise<any>;
  findByRecipientId(input: {
    recipientId: string;
    after?: string;
    take: number;
  }): Promise<any[]>;
  findPostTargetsByPublicIds(publicIds: string[]): Promise<any[]>;
  findUnreadByRecipientId(recipientId: string): Promise<any>;
  createMany(data: CreateManyNotificationsInput[]): Promise<any>;
  markGroupAsRead(userId: string): Promise<any>;
}
