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
    count: true,
    isRead: true,
    lastActorId: true,
    lastEventAt: true,
    createdAt: true,
    updatedAt: true,
    lastActor: {
        select: {
            username: true,
            avatar: true,
        },
    },
    // bài gốc cmt
    originPost: {
        select: {
            publicId: true,
        }
    },
    targetPost: {
        select: {
            publicId: true,
        }
    }
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
            select: {
                publicId: true,
                type: true,
                targetType: true,
                count: true,
                isRead: true,
                createdAt: true,
                lastEventAt: true,
                lastActor: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
                originPost: {
                    select: {
                        publicId: true,
                        content: true,
                    }
                },
                targetPost: {
                    select: {
                        publicId: true,
                        content: true,
                        likesCount: true,
                        repliesCount: true,
                        repostsCountAndQuoteCount: true,
                        replyPermission: true,
                    }
                }
            },
            cursor: after ? { publicId: after } : undefined,
        });
    }

    findUnreadByRecipientId(recipientId: string) {
        return prisma.notificationGroup.findFirst({
            where: {
                recipientId,
                isRead: false,
            },
            select: {
                id: true,
            },
        });
    }

    createMany(
        data: {
            recipientId: string;
            type: NotificationType;
            targetType: string;
            targetId: string;
            originPostId: string;
            actorIds: Prisma.InputJsonValue;
            lastActorId: string;
            lastEventAt: Date;
            count?: number;
            isRead?: boolean;
        }[],
        tx: Prisma.TransactionClient = prisma,
    ) {
        return tx.notificationGroup.createMany({
            data: data.map((item) => ({
                recipientId: item.recipientId,
                type: item.type as NotificationType,
                targetType: item.targetType,
                targetId: item.targetId,
                actorIds: item.actorIds,
                count: item.count,
                isRead: item.isRead,
                lastActorId: item.lastActorId,
                lastEventAt: item.lastEventAt,
                originPostId: item.originPostId,

            })),
            skipDuplicates: true,
        });
    }
}

export const notificationRepository = new NotificationRepository();
