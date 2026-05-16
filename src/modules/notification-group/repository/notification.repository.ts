import prisma from "@/config/prisma";
import { buildPagination } from "@/shared/pagination/cursor-pagination";
import { NotificationType, Prisma } from "@prisma/client";

const notificationGroupSelect = {
    id: true,
    publicId: true,
    recipientId: true,
    type: true,
    targetType: true,
    targetId: true,
    actorIds: true,
    count: true,
    isRead: true,
    lastActorId: true,
    lastEventAt: true,
    createdAt: true,
    updatedAt: true,
} satisfies Prisma.NotificationGroupSelect;

class NotificationRepository
    implements
    ICursorPagination<
        Prisma.NotificationGroupWhereInput,
        Prisma.NotificationGroupGetPayload<{
            select: typeof notificationGroupSelect;
        }>
    > {
    findAll({
        after,
        take,
        where,
        cursor,
        select,
        orderBy,
    }: {
        after?: string;
        take?: number;
        where?: Prisma.NotificationGroupWhereInput;
        cursor?: Prisma.NotificationGroupWhereUniqueInput;
        select?: Prisma.NotificationGroupSelect;
        orderBy?:
        | Prisma.NotificationGroupOrderByWithRelationInput
        | Prisma.NotificationGroupOrderByWithRelationInput[];
    }) {
        const { currentAfter, currentLimit } = buildPagination({ after, take });

        return prisma.notificationGroup.findMany({
            where,
            take: currentLimit + 1,
            skip: currentAfter ? 1 : 0,
            cursor: currentAfter ? cursor : undefined,
            select: select ?? notificationGroupSelect,
            orderBy: orderBy ?? [{ lastEventAt: "desc" }, { publicId: "desc" }],
        });
    }

    create(
        data: {
            recipientId: string;
            type: NotificationType;
            targetType: string;
            targetId: string;
            actorIds: Prisma.InputJsonValue;
            lastActorId: string;
            lastEventAt: Date;
            count?: number;
            isRead?: boolean;
            userId?: string | null;
        },
        tx: Prisma.TransactionClient = prisma,
    ) {
        return tx.notificationGroup.create({
            data: {
                recipientId: data.recipientId,
                type: data.type,
                targetType: data.targetType,
                targetId: data.targetId,
                actorIds: data.actorIds,
                count: data.count,
                isRead: data.isRead,
                lastActorId: data.lastActorId,
                lastEventAt: data.lastEventAt,
                userId: data.userId ?? undefined,
            },
            select: notificationGroupSelect,
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
        return this.findAll({
            after,
            take,
            where: {
                recipientId,
            },
            cursor: after ? { publicId: after } : undefined,
        });
    }
}

export const notificationRepository = new NotificationRepository();
