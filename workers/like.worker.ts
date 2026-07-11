import { baseLogger } from "@/middlewares/logger";
import { likeService } from "@/modules/post/service/like-service.service";
import { postService } from "@/modules/post/service/post.service";
import { LIKE_JOB_NAME, QUEUE_NAME } from "../src/constants/queue";
import { createWorker } from "../src/providers/bullmq.provider";
import { redisService } from "../src/providers/redis.provider";

type LikeEvent = {
  postPublicId: string;
  createdAt: string;
  userId: string;
  isLiked: boolean;
};

class LikeWorker {
  private readonly worker = createWorker(QUEUE_NAME.LIKE_QUEUE, async (job) => {
    switch (job.name) {
      case LIKE_JOB_NAME.INIT_SYNC_JOB:
        return this.initSyncJob();
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }, {
    concurrency: 1,
  });

  async initSyncJob() {
    try {
      await this.processLikeEvents();
    } finally {
    }
  }

  private async processLikeEvents() {
    const events = await this.rPopCustomBatch(
      QUEUE_NAME.POST_LIKE_EVENT_QUEUE,
      500,
    );
    if (events.length === 0) {
      return;
    }

    const map = new Map<string, LikeEvent[]>();
    for (const event of events) {
      const postEvents = map.get(event.postPublicId);
      if (postEvents) {
        postEvents.push(event);
      } else {
        map.set(event.postPublicId, [event]);
      }
    }

    for (const [postPublicId, postEvents] of map.entries()) {
      const likes = postEvents.filter((event) => event.isLiked).map((event) => ({
        userId: event.userId,
        postId: event.postPublicId,
        isLike: true,
      }));

      const unlikes = postEvents.filter((event) => !event.isLiked).map((event) => ({
        userId: event.userId,
        postId: event.postPublicId,
        isLike: false,
      }));

      const uniqueLikeCount = new Map(likes.map((event) => [event.userId, event]));
      const uniqueUnLikeCount = new Map(unlikes.map((event) => [event.userId, event]));

      const newLike = [...uniqueLikeCount.values()];
      const newUnlike = [...uniqueUnLikeCount.values()];
      const count = uniqueLikeCount.size - uniqueUnLikeCount.size;
      try {
        await Promise.all([
          postService.increaseLikeCount(postPublicId, count),
          likeService.createMany(newLike),
          likeService.deleteMany(newUnlike),
        ]);
      } catch (error) {
        await postService.decreaseLikeCount(postPublicId, count);
        baseLogger.error({ error }, "Failed to process like events");
        await this.restoreEvents(events);
        return;
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
      ) {
        return null;
      }

      return event as LikeEvent;
    } catch {
      return null;
    }
  }
}

export const likeWorker = new LikeWorker();
