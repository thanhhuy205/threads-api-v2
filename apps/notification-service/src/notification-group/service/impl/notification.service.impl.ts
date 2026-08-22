import { buildCursorPagination, type CursorPaginationMeta } from '@/common/helpers/cursor-pagination.helper';
import { NOTIFICATION_JOB_KEY } from "@libs/core/constants/queue";
import { registerNotificationHandlers } from '../../events/notification.dispatcher';
import { MentionNotification, ReplyNotification } from "../../events/notification.events";
import type {
  CreateNotificationGroupInput,
  EnqueuePendingNotificationInput,
  FindAllNotificationGroupsInput,
  PendingCommentNotificationGroupKey,
  PendingCommentNotificationRedisKey,
  PendingCommentNotificationRedisPayload,
} from "../../interface/notification.types";
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepository,
} from "../../repository/notification.repository";
import { PusherService } from "@/modules/pusher/service/pusher.service";
import { USER_SERVICE, type UserService } from "@/modules/user/service/user.service";
import { RedisService } from "@libs/cache/redis.service";
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { NotificationService } from '../notification.service';

type NotificationGroupListRow = Awaited<
  ReturnType<NotificationRepository['findByRecipientId']>
>[number];

type NotificationTargetPost = Awaited<
  ReturnType<NotificationRepository['findPostTargetsByPublicIds']>
>[number];

@Injectable()
export class NotificationServiceImpl implements NotificationService, OnModuleInit {
  private readonly logger = new Logger(NotificationServiceImpl.name, { timestamp: true });

  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
    private readonly pusherService: PusherService,
    @Inject(USER_SERVICE) private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) { }

  onModuleInit() {
    registerNotificationHandlers({
      handleReply: (payload) => this.handleNewComment(payload),
      handleMention: (payload) => this.handleMention(payload),
    });
  }

  create(data: CreateNotificationGroupInput) {
    return this.notificationRepository.create(
      {
        recipientId: data.recipientId,
        type: data.type,
        targetType: data.targetType,
        targetId: data.targetId,
        actorIds: [data.actorId],
        count: data.count,
        lastActorId: data.actorId,
        lastActor: data.lastActor,
        lastEventAt: data.lastEventAt ?? new Date(),
      },
    );
  }

  async findAll({
    recipientId,
    after,
    take,
  }: FindAllNotificationGroupsInput): Promise<{
    rows: Array<NotificationGroupListRow & { targetPost: NotificationTargetPost | null }>;
    pagination: CursorPaginationMeta;
  }> {
    const notifications = await this.notificationRepository.findByRecipientId({
      recipientId,
      after,
      take,
    });

    const postTargetIds = [
      ...new Set(
        notifications
          .filter((item) => item.targetType === "POST")
          .map((item) => item.targetId),
      ),
    ];

    const posts =
      postTargetIds.length > 0
        ? await this.notificationRepository.findPostTargetsByPublicIds(postTargetIds)
        : [];
    const postMap = new Map(posts.map((post) => [post.publicId, post]));

    const rows = notifications.map((item) => ({
      ...item,
      targetPost:
        item.targetType === "POST" ? postMap.get(item.targetId) ?? null : null,
    }));

    return buildCursorPagination({
      rows,
      take,
      getAfter: (item) => item.publicId,
    });
  }

  async hasUnread(recipientId: string) {
    const unread = await this.notificationRepository.findUnreadByRecipientId(
      recipientId,
    );
    return Boolean(unread);
  }

  private resolveGroupKey({
    isOwner,
    originPostId,
    groupKey,
  }: {
    isOwner: boolean;
    originPostId: string;
    groupKey?: PendingCommentNotificationGroupKey;
  }): PendingCommentNotificationGroupKey {
    if (groupKey) return groupKey;

    return isOwner ? `post:${originPostId}` : `thread:${originPostId}`;
  }

  async enqueuePendingNotification(input: EnqueuePendingNotificationInput) {
    const {
      actorId,
      recipientId,
      targetPostId,
      originPostId,
      username,
      postOwnerId,
      type,
      targetType,
      key,
      groupKey,
      avatar
    } = input;

    const isOwner = recipientId === postOwnerId;
    if (key.includes(":")) {
      throw new Error("Notification key must not contain ':'");
    }

    const resolvedGroupKey = this.resolveGroupKey({
      isOwner,
      originPostId,
      groupKey,
    });

    const redisKey: PendingCommentNotificationRedisKey =
      `notification:pending:${recipientId}:${key}:${resolvedGroupKey}`;

    this.logger.log(`Handling pending notification for Redis key: ${redisKey}`);
    const pipeline = this.redisService.redis.multi();

    const payload: PendingCommentNotificationRedisPayload = {
      key,
      type,
      targetType,
      groupKey: resolvedGroupKey,
      originPostId,
      targetPostId,
      isOwner: isOwner ? "true" : "false",
      lastActorId: actorId,
      updatedAt: String(Date.now()),
      username,
      avatar: avatar ?? "",
    };
    pipeline.hSet(redisKey, payload);

    pipeline.sAdd(`${redisKey}:actors`, actorId);
    pipeline.sCard(`${redisKey}:actors`);
    pipeline.hIncrBy(redisKey, "count", 1);

    pipeline.expire(redisKey, 3600);

    await pipeline.exec();

    await this.redisService.redis.zAdd(NOTIFICATION_JOB_KEY.BATCH_SYNC_NOTIFICATION, {
      score: Date.now() + 5000,
      value: redisKey,
    });

    return redisKey;
  }

  async handleNewComment(relyNotification: ReplyNotification) {
    return this.enqueuePendingNotification({
      ...relyNotification,
      type: "REPLY",
      targetType: "POST",
      key: "comment",
    });
  }

  async handleMention(mentionNotification: MentionNotification) {
    return this.enqueuePendingNotification({
      ...mentionNotification,
      type: "MENTION",
      targetType: "POST",
      key: "mention",
    });
  }

  async sendLikeCountUpdateNotification(postPublicId: string, recipientId: string, likeCount: number, itemLike: {
    postPublicId: string,
    createdAt: Date,
    userId: string,
  }[]) {
    const lastActorId = itemLike?.[itemLike.length - 1]?.userId ?? null;
    const actorIds = itemLike.map((item) => item.userId);
    const user = itemLike?.[0]?.userId ? await this.userService.findByUserId(lastActorId) : null;
    const notificationData = {
      groupPublicId: `like-count-update:${postPublicId}`,
      name: "Cập nhật lượt thích",
      recipientId,
      lastActorId: lastActorId,
      actorIds,
      content: likeCount >= 2 ? `${user?.username} và ${likeCount - 1} người khác đã thích bài viết của bạn` : `${user?.username ?? "Một người dùng"} đã thích bài viết của bạn`,
      avatar: user?.avatar ?? "",
      type: "LIKE",
      targetType: "POST",
    };

    this.logger.log(`Enqueuing like count update notification for recipient ${recipientId} for post ${postPublicId} with like count ${likeCount}`);
    const actorNotIncludeOwner = actorIds.filter((id) => id !== recipientId);
    if (actorNotIncludeOwner.length === 0) {
      this.logger.log(`No actors to notify for like count update on post ${postPublicId} for recipient ${recipientId}, skipping notification`);
      return;
    }
    await Promise.all([
      this.notificationRepository.create({
        recipientId,
        type: "LIKE",
        targetType: "POST",
        targetId: postPublicId,
        actorIds: actorNotIncludeOwner.length > 0 ? actorNotIncludeOwner : [recipientId],
        count: likeCount,
        lastActorId: actorNotIncludeOwner?.[0],
        lastEventAt: new Date(),
      }),
      ...(actorNotIncludeOwner.length > 0 ? [this.pusherService.trigger(`private-user-notification-${recipientId}`, "like-count-update", notificationData)] : []),
    ]);
  }

  async markGroupAsRead(userId: string) {
    await this.notificationRepository.markGroupAsRead(userId);
  }
}

