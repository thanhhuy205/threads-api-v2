import { baseLogger } from "@/middlewares/logger";
import { LIKE_JOB_NAME, QUEUE_NAME } from "../src/constants/queue";
import { likeRepository } from '../src/modules/post/repository/like.repository';
import { postRepository } from '../src/modules/post/repository/post.repository';
import { createWorker } from "../src/providers/bullmq.provider";
import { redisService } from "../src/providers/redis.provider";

type LikeResult = {
  postPublicId: string,
  createdAt: Date,
  userId: string,
}

const redisReady = redisService.isOpen
  ? Promise.resolve()
  : redisService.connect();


class LikeWorker {
  private readonly syncLockKey = "like:sync:init:lock";
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
    const results = await this.rPopCustomBatch(QUEUE_NAME.LIKED_ADD_QUEUE, 500);
    if (results.length === 0) return;
    baseLogger.info(`Processing add like jobs...`);
    const grouped = this.groupByPostPublicId(results);

    baseLogger.info(`Group item ${JSON.stringify(results)} ${results.length} like jobs into ${grouped.size} groups by postPublicId`);
    baseLogger.info(`Grouped like jobs: ${JSON.stringify(Array.from(grouped.entries()))}`);
    await Promise.all([
      likeRepository.createMany(results.map((item) => ({
        userId: item.userId as string,
        postId: item.postPublicId as string,
        isLike: true,
      }))),
      ...Array.from(grouped.entries()).map(([postPublicId, items]) =>
        postRepository.incrementLikedCount(postPublicId, items.length)
      ),
    ]);
  }

  async processRemoveLike() {
    const results = await this.rPopCustomBatch(QUEUE_NAME.LIKED_REMOVE_QUEUE, 500);

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
    await redisReady;
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
    await redisReady;
    const result = await redisService.set(this.syncLockKey, token, {
      NX: true,
      EX: this.syncLockTtlSeconds,
    });
    return result === "OK";
  }

  private async releaseSyncLock(token: string): Promise<void> {
    await redisReady;
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
