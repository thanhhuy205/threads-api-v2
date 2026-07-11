import prisma from "@/config/prisma";
import type { NotificationType } from "@/modules/notification-group/model/notification.model";
import { collections } from "@/providers/mongodb.provider";
import { buildPagination } from "@/shared/pagination/cursor-pagination";
import { Sort } from "mongodb";

class NotificationRepository {
    findAll({
        after,
        take,
        where,
        orderBy,
    }: {
        after?: string;
        take?: number;
        where?: Record<string, any>;
        orderBy?: Sort;
    }) {
        const { currentAfter, currentLimit } = buildPagination({ after, take });
        const defaultOrderBy = { lastEventAt: -1, publicId: -1 } as Sort;
        return collections('notifications')
            .find(where ?? {})
            .sort(orderBy as Sort ?? defaultOrderBy)
            .skip(currentAfter ? 1 : 0)
            .limit(currentLimit + 1)
            .toArray();
    }

    create(data: {
        recipientId: string;
        type: NotificationType;
        targetType: string;
        targetId: string;
        actorIds: any;
        lastActorId: string;
        lastActor?: {
            id: string,
            username: string,
            avatar: string,
        };
        lastEventAt: Date;
        count?: number;
        isRead?: boolean;
    }) {
        return collections('notifications').insertOne({
            recipientId: data.recipientId,
            type: data.type,
            targetType: data.targetType,
            targetId: data.targetId,
            actorIds: data.actorIds,
            count: data.count ?? 1,
            isRead: data.isRead ?? false,
            lastActorId: data.lastActorId,
            lastActor: data.lastActor,
            lastEventAt: data.lastEventAt,
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
            where: { recipientId },
        });
    }

    findPostTargetsByPublicIds(publicIds: string[]) {
        if (!publicIds.length) return Promise.resolve([]);

        return prisma.post.findMany({
            where: {
                publicId: { in: publicIds },
            },
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
        return collections('notifications').findOne({
            recipientId,
            isRead: false,
        });
    }

    createMany(data: {
        recipientId: string;
        type: NotificationType;
        targetType: string;
        targetId: string;
        originPostId: string;
        actorIds: any;
        lastActorId: string;
        lastEventAt: Date;
        count?: number;
        isRead?: boolean;
    }[]) {
        return collections('notifications').insertMany(
            data.map((item) => ({
                recipientId: item.recipientId,
                type: item.type,
                targetType: item.targetType,
                targetId: item.targetId,
                actorIds: item.actorIds,
                count: item.count ?? 1,
                isRead: item.isRead ?? false,
                lastActorId: item.lastActorId,
                lastEventAt: item.lastEventAt,
                originPostId: item.originPostId,
            })),
            { ordered: false }, // tương đương skipDuplicates
        );
    }

    markGroupAsRead(userId: string) {
        return collections('notifications').updateMany(
            { recipientId: userId, isRead: false },
            { $set: { isRead: true } },
        );
    }
}

export const notificationRepository = new NotificationRepository();