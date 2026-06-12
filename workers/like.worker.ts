import { baseLogger } from "@/middlewares/logger";
import { notificationService } from "@/modules/notification-group/service/notification.service";
import { likeEventService } from "@/modules/post/service/like-event.service";
import { LIKE_JOB_NAME, QUEUE_NAME } from "../src/constants/queue";
import { redisKey } from "../src/constants/resolve-key/redis-key";
import { createWorker } from "../src/providers/bullmq.provider";
import { redisService } from "../src/providers/redis.provider";

type LikeEvent = {
  postPublicId: string;
  createdAt: string;
  userId: string;
  isLiked: boolean;
};

class LikeWorker {
  private readonly syncLockKey = redisKey.job.likeSyncInitLock();
  private readonly syncLockTtlSeconds = 30;

  private readonly worker = createWorker(QUEUE_NAME.LIKE_QUEUE, async (job) => {
    switch (job.name) {
      case LIKE_JOB_NAME.INIT_SYNC_JOB:
        return this.initSyncJob();
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  });

  async initSyncJob() {
    const lockToken = `${process.pid}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
    const isLocked = await this.acquireSyncLock(lockToken);

    if (!isLocked) {
      return;
    }

    try {
      await this.processLikeEvents();
    } finally {
      await this.releaseSyncLock(lockToken);
    }
  }

  private async processLikeEvents() {
    const events = await this.rPopCustomBatch(
      QUEUE_NAME.POST_LIKE_EVENT_QUEUE,
      500,
    );

    for (const [index, event] of events.entries()) {
      let result;

      try {
        result = await likeEventService.applyEvent({
          userId: event.userId,
          postId: event.postPublicId,
          isLiked: event.isLiked,
        });
      } catch (error) {
        baseLogger.error({
          error,
          event,
        }, "Failed to process like event");

        await this.restoreEvents(events.slice(index));
        return;
      }

      if (!result.changed || !event.isLiked) {
        continue;
      }

      try {
        await notificationService.sendLikeCountUpdateNotification(
          event.postPublicId,
          result.ownerId,
          result.likesCount,
          [{
            postPublicId: event.postPublicId,
            createdAt: new Date(event.createdAt),
            userId: event.userId,
          }],
        );
      } catch (error) {
        baseLogger.error({
          error,
          event,
        }, "Failed to send like notification");
      }
    }
  }

  private async rPopCustomBatch(
    key: string,
    count: number,
  ): Promise<LikeEvent[]> {
    const elements = await redisService.rPopCount(key, count);
    if (!elements) {
      return [];
    }

    return elements
      .map((item) => this.safeParseLikeEvent(item))
      .filter((item): item is LikeEvent => item !== null);
  }

  private async restoreEvents(events: LikeEvent[]): Promise<void> {
    if (events.length === 0) {
      return;
    }

    await redisService.rPush(
      QUEUE_NAME.POST_LIKE_EVENT_QUEUE,
      events
        .slice()
        .reverse()
        .map((event) => JSON.stringify(event)),
    );
  }

  private safeParseLikeEvent(item: string): LikeEvent | null {
    try {
      const event = JSON.parse(item) as Partial<LikeEvent>;
      if (
        typeof event.postPublicId !== "string"
        || typeof event.createdAt !== "string"
        || typeof event.userId !== "string"
        || typeof event.isLiked !== "boolean"
      ) {
        return null;
      }

      return event as LikeEvent;
    } catch {
      return null;
    }
  }

  private async acquireSyncLock(token: string): Promise<boolean> {
    const result = await redisService.set(this.syncLockKey, token, {
      NX: true,
      EX: this.syncLockTtlSeconds,
    });
    return result === "OK";
  }

  private async releaseSyncLock(token: string): Promise<void> {
    const currentToken = await redisService.get(this.syncLockKey);

    if (currentToken === token) {
      await redisService.del(this.syncLockKey);
    }
  }
}

export const likeWorker = new LikeWorker();
