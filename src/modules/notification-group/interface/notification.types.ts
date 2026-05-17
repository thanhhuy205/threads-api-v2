import { NotificationType } from "@prisma/client";

export type CreateNotificationGroupInput = {
    recipientId: string;
    actorId: string;
    type: NotificationType;
    targetType: string;
    targetId: string;
    lastEventAt?: Date;
    userId?: string | null;
};

export type FindAllNotificationGroupsInput = {
    recipientId: string;
    after?: string;
    take: number;
};

export type PendingCommentNotificationGroupKey =
    | `post:${string}`
    | `thread:${string}`;

export type PendingCommentNotificationRedisKey =
    `notification:pending:${string}:comment:${PendingCommentNotificationGroupKey}`;

export type PendingCommentNotificationRedisMeta = {
    type: NotificationType;
    groupKey: PendingCommentNotificationGroupKey;
    originPostId: string;
    targetPostId: string;
    isOwner: "true" | "false";
    lastActorId: string;
    updatedAt: string;
    count: string;
    username: string;
};

export type PendingCommentNotificationRedisPayload = Omit<
    PendingCommentNotificationRedisMeta,
    "count"
>;

export type PendingCommentNotificationBatchItem = {
    redisKey: PendingCommentNotificationRedisKey;
    recipientId: string;
    meta: PendingCommentNotificationRedisMeta;
    actorCount: number;
    actors: string[];
};

export type CommentNotificationMessageMeta = Omit<
    PendingCommentNotificationRedisMeta,
    "isOwner" | "updatedAt" | "count"
> & {
    isOwner: boolean;
    updatedAt: Date;
    count: number;
};
