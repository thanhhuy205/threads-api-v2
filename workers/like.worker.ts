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
      console.log(events);
      return;
    }
    const likes = events.filter((event) => event.isLiked).map((event) => ({
      userId: event.userId,
      postId: event.postPublicId,
      isLike: true,
    }));
    const unlikes = events.filter((event) => !event.isLiked).map((event) => ({
      userId: event.userId,
      postId: event.postPublicId,
      isLike: false,
    }));
    console.log(unlikes);
    const count = likes.length - unlikes.length;
    try {
      await Promise.all([
        postService.updateLike(count),
        likeService.createMany(likes),
        likeService.deleteMany(unlikes),
      ]);
    } catch (error) {
      await postService.updateLike(-count);
      baseLogger.error({ error }, "Failed to process like events");
      await this.restoreEvents(events);
      return;
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
