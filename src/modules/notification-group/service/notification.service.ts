import type {
  CreateNotificationGroupInput,
  FindAllNotificationGroupsInput,
} from "@/modules/notification-group/interface/notification.types";
import { notificationRepository } from "@/modules/notification-group/repository/notification.repository";
import {
  buildCursorPagination,
  type PaginationResponse,
} from "@/shared/pagination/cursor-pagination";
import { Prisma } from "@prisma/client";

type NotificationGroupListRow = Awaited<
  ReturnType<typeof notificationRepository.findByRecipientId>
>[number];

class NotificationService {
  create(data: CreateNotificationGroupInput, tx?: Prisma.TransactionClient) {
    return notificationRepository.create(
      {
        recipientId: data.recipientId,
        type: data.type,
        targetType: data.targetType,
        targetId: data.targetId,
        actorIds: [data.actorId],
        lastActorId: data.actorId,
        lastEventAt: data.lastEventAt ?? new Date(),
        userId: data.userId,
      },
      tx,
    );
  }

  async findAll({
    recipientId,
    after,
    take,
  }: FindAllNotificationGroupsInput): Promise<{
    rows: NotificationGroupListRow[];
    pagination: PaginationResponse<string | number | null>;
  }> {
    const notifications = await notificationRepository.findByRecipientId({
      recipientId,
      after,
      take,
    });

    return buildCursorPagination({
      rows: notifications,
      take,
      getAfter: (item) => item.publicId,
    });
  }
}

export const notificationService = new NotificationService();
