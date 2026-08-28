import { LIKE_JOB_NAME, QUEUE_NAME } from "@libs/core/constants/queue";
import { RedisService } from "@libs/core/src/redis/redis.service";
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { POST_REPOSITORY, type PostRepository } from "@post-service/modules/post/repository/post.repository";
import { LIKE_SERVICE, type LikeService } from "@post-service/modules/post/service/like.service";
import { Job } from 'bullmq';

type LikeEvent = {
  postPublicId: string;
  createdAt: string;
  userId: string;
  isLiked: boolean;
};

@Processor(QUEUE_NAME.LIKE_QUEUE, { concurrency: 1 })
export class LikeWorker extends WorkerHost {
  private readonly logger = new Logger(LikeWorker.name, { timestamp: true });

  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepository: PostRepository,
    @Inject(LIKE_SERVICE) private readonly likeService: LikeService,
    private readonly redisService: RedisService,
  ) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case LIKE_JOB_NAME.INIT_SYNC_JOB:
        return this.initSyncJob();
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

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
          this.postRepository.increaseLikeCount(postPublicId, count),
          this.likeService.createMany(newLike),
          this.likeService.deleteMany(newUnlike),
        ]);
      } catch (error) {
        await this.postRepository.decreaseLikeCount(postPublicId, count);
        this.logger.error(
          'Failed to process like events',
          error instanceof Error ? error.stack : String(error),
        );
        await this.restoreEvents(events);
        return;
      }
    }
  }

  private async rPopCustomBatch(
    key: string,
    count: number,
  ): Promise<LikeEvent[]> {
    const elements = await this.redisService.redis.rPopCount(key, count);
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

    await this.redisService.redis.rPush(
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
