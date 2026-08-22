import { normalizeCursorPagination } from '@/common/helpers/cursor-pagination.helper';
import { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';
import type { Prisma } from '@threads/notification-prisma-client';
import { NotificationPrismaService } from '../../../database/prisma.service';
import type { NotificationType } from '../../model/notification.model';
import type { NotificationRepository } from '../notification.repository';

@Injectable()
export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(
    private readonly notificationPrisma: NotificationPrismaService,
    private readonly apiPrisma: PrismaService,
  ) { }

  findAll({
    after,
    take,
    where,
    orderBy,
  }: {
    after?: string;
    take?: number;
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithRelationInput;
  }) {
    const { after: currentAfter, take: currentLimit } = normalizeCursorPagination({ after, take });

    return this.notificationPrisma.notification.findMany({
      where,
      orderBy: orderBy ?? [{ lastEventAt: 'desc' }, { publicId: 'desc' }],
      cursor: currentAfter ? { publicId: currentAfter } : undefined,
      skip: currentAfter ? 1 : 0,
      take: currentLimit + 1,
    });
  }

  create(data: {
    recipientId: string;
    type: NotificationType;
    targetType: string;
    targetId: string;
    actorIds: string[];
    lastActorId: string;
    lastActor?: { id: string; username: string; avatar: string };
    lastEventAt: Date;
    count?: number;
    isRead?: boolean;
  }) {
    return this.notificationPrisma.notification.create({
      data: {
        ...data,
        targetType: data.targetType as Prisma.NotificationCreateInput['targetType'],
        count: data.count ?? 1,
        isRead: data.isRead ?? false,
      },
    });
  }

  findByRecipientId({
    recipientId,
    after,
    take,
  }: {
    recipientId: string;
    after?: string;
    take: number;
  }) {
    return this.findAll({ after, take, where: { recipientId } });
  }

  findPostTargetsByPublicIds(publicIds: string[]) {
    if (!publicIds.length) return Promise.resolve([]);

    return this.apiPrisma.post.findMany({
      where: { publicId: { in: publicIds } },
      select: {
        publicId: true,
        content: true,
        likesCount: true,
        repliesCount: true,
        repostsCountAndQuoteCount: true,
        replyPermission: true,
      },
    });
  }

  findUnreadByRecipientId(recipientId: string) {
    return this.notificationPrisma.notification.findFirst({
      where: { recipientId, isRead: false },
    });
  }

  createMany(data: Array<{
    recipientId: string;
    type: NotificationType;
    targetType: string;
    targetId: string;
    originPostId: string;
    actorIds: string[];
    lastActorId: string;
    lastEventAt: Date;
    count?: number;
    isRead?: boolean;
  }>) {
    return this.notificationPrisma.notification.createMany({
      data: data.map((item) => ({
        ...item,
        targetType: item.targetType as Prisma.NotificationCreateManyInput['targetType'],
        count: item.count ?? 1,
        isRead: item.isRead ?? false,
      })),
    });
  }

  markGroupAsRead(userId: string) {
    return this.notificationPrisma.notification.updateMany({
      where: { recipientId: userId, isRead: false },
      data: { isRead: true },
    });
  }
}
