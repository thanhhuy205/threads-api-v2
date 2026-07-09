import { NotificationType } from "@prisma/client";

export type CreateNotificationGroupInput = {
    recipientId: string;
    actorId: string;
    type: NotificationType;
    targetType: string;
    targetId: string;
    lastEventAt?: Date;
    count?: number;
    userId?: string | null;
    lastActor?: {
        id: string,
        username: string,
        avatar: string,
    }
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
    `notification:pending:${string}:${string}:${PendingCommentNotificationGroupKey}`;

export type PendingCommentNotificationRedisMeta = {
    key: string;
    type: NotificationType;
    targetType: string;
    groupKey: PendingCommentNotificationGroupKey;
    originPostId: string;
    targetPostId: string;
    isOwner: "true" | "false";
    lastActorId: string;
    updatedAt: string;
    count: string;
    username: string;
    avatar: string;
};

export type PendingCommentNotificationRedisPayload = Omit<
    PendingCommentNotificationRedisMeta,
    "count"
>;

export type EnqueuePendingNotificationInput = {
    actorId: string;
    recipientId: string;
    targetPostId: string;
    originPostId: string;
    username: string;
    avatar?: string;
    postOwnerId: string;
    type: NotificationType;
    targetType: string;
    key: string;
    groupKey?: PendingCommentNotificationGroupKey;
};

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
