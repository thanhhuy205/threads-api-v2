import { baseLogger } from "@/middlewares/logger";
import { notificationService } from "@/modules/notification-group/service/notification.service";
import { LIKE_JOB_NAME, QUEUE_NAME } from "../src/constants/queue";
import { redisKey } from "../src/constants/resolve-key/redis-key";
import { likeRepository } from '../src/modules/post/repository/like.repository';
import { postRepository } from '../src/modules/post/repository/post.repository';
import { createWorker } from "../src/providers/bullmq.provider";
import { redisService } from "../src/providers/redis.provider";

type LikeResult = {
  postPublicId: string,
  createdAt: Date,
  userId: string,
}


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
    baseLogger.info(`Attempting to acquire lock for like sync job with token ${lockToken}: ${isLocked ? 'acquired' : 'not acquired'}`);
    if (!isLocked) {
      return;
    }
    baseLogger.info(`Starting like sync job...`);

    try {
      await Promise.all([
        this.processAddLike(),
        this.processRemoveLike(),
      ]);
    } finally {
      await this.releaseSyncLock(lockToken);
    }
  }

  async processAddLike() {
    const results = await this.rPopCustomBatch(QUEUE_NAME.POST_LIKE_EVENT_QUEUE, 500);
    if (results.length === 0) return;
    baseLogger.info(`Processing add like jobs...`);
    const grouped = this.groupByPostPublicId(results);

    baseLogger.info(`Group item ${JSON.stringify(results)} ${results.length} like jobs into ${grouped.size} groups by postPublicId`);
    baseLogger.info(`Grouped like jobs: ${JSON.stringify(Array.from(grouped.entries()))}`);

    for (const [postPublicId, items] of grouped.entries()) {
      const uniqueItems = Array.from(
        new Map(items.map((item) => [item.userId, item])).values(),
      );

      const post = await postRepository.findByPublicId(postPublicId);

      if (!post) {
        baseLogger.warn({ postPublicId }, "Post not found when processing like events");
        continue;
      }

      const insertedActors: typeof uniqueItems = [];

      for (const item of uniqueItems) {
        try {
          await likeRepository.create({
            userId: item.userId,
            postId: post.publicId,
            isLike: true,
          });

          insertedActors.push(item);
        } catch (error) {
          baseLogger.warn({
            postPublicId,
            userId: item.userId,
          }, "Like already exists or failed, skip increment");
        }
      }

      const insertedCount = insertedActors.length;

      if (insertedCount === 0) {
        continue;
      }

      const updatedPost = await postRepository.incrementLikedCount(
        postPublicId,
        insertedCount,
      );

      baseLogger.info({
        postPublicId,
        ownerId: updatedPost.ownerId,
        insertedCount,
      }, "Incremented liked count");

      await notificationService.sendLikeCountUpdateNotification(
        postPublicId,
        updatedPost.ownerId,
        insertedCount,
        insertedActors,
      );
    }

  }

  async processRemoveLike() {
    const results = await this.rPopCustomBatch(QUEUE_NAME.POST_UNLIKE_EVENT_QUEUE, 500);
    console.log("🚀 ~ file: like.worker.ts:122 ~ LikeWorker ~ processRemoveLike ~ results:", results)
    if (results.length === 0) return;
    // gom nhóm theo postPublicId để giảm số lần gọi postRepository.decrementLikedCount
    const grouped = this.groupByPostPublicId(results);
    baseLogger.info(`Grouped remove like jobs: ${JSON.stringify(Array.from(grouped.entries()))}`);

    await Promise.all([
      likeRepository.deleteMany(results.map((item) => ({
        userId: item.userId as string,
        postId: item.postPublicId as string,
      }))),
      // vì mỗi item trong results là một like bị xóa, nên số lần giảm liked count sẽ bằng số item trong nhóm
      // grouped.entries() trả về [postPublicId, items], trong đó items là mảng các like bị xóa của post đó
      ...Array.from(grouped.entries()).map(([postPublicId, items]) =>
        postRepository.decrementLikedCount(postPublicId, items.length)
      ),
    ]);
  }



  private async rPopCustomBatch(key: string, count: number): Promise<LikeResult[]> {
    const elements = await redisService.rPopCount(key, count);
    if (!elements) throw new Error(`Failed to RPop batch from ${key}`);

    baseLogger.info(`RPop batch from ${key}, got ${JSON.stringify(elements)} items`);
    return elements
      .map((item) => this.safeParseLikeItem(item))
      .filter((item): item is LikeResult => item !== null);
  }


  private safeParseLikeItem(item: string): LikeResult | null {
    try {
      return JSON.parse(item) as LikeResult;
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

  private groupByPostPublicId(items: LikeResult[]): Map<string, LikeResult[]> {
    return items.reduce((acc, item) => {
      const bucket = acc.get(item.postPublicId);
      if (bucket) {
        bucket.push(item);
      } else {
        acc.set(item.postPublicId, [item]);
      }
      return acc;
    }, new Map<string, LikeResult[]>());
  }

}

export const likeWorker = new LikeWorker();
