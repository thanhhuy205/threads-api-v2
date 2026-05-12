import { LIKE_JOB_NAME, QUEUE_NAME } from "../src/constants/queue";
import type { CreateJobLikeProducer } from "../src/modules/job/like-job/dto/create-job-like-producer";
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
  private readonly worker = createWorker(QUEUE_NAME.LIKE_QUEUE, async (job) => {
    switch (job.name) {
      case LIKE_JOB_NAME.SYNC_POST_LIKE:
        return this.syncPostLike(job.data);
      case LIKE_JOB_NAME.INIT_SYNC_JOB:
        return this.initSyncJob();
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  });

  async syncPostLike(data: CreateJobLikeProducer) {
    const likeKey = `post:${data.publicId}:likes`;
    const batch = await redisService.rpop(likeKey, 500);
    console.log(batch);
    // if (batch.length === 0) {
    //   baseLogger.info(
    //     `Skip like sync for ${likeKey} because no Redis state was found`,
    //   );
    //   return;
    // }
    // const old = await likeRepository.findByUserIdAndPublicId(data.publicId);
    // baseLogger.info(`old: ${JSON.stringify(old)}`);
    // baseLogger.info(`likeState: ${likeState}`);
    // const isLiked = likeState === "1";

    // await likeRepository.upsert({
    //   publicId: data.publicId,
    //   userId: data.userId,
    //   isLiked,
    // });

    // if (isLiked) {
    //   if (old?.isLike) {
    //     return;
    //   } else {
    //     await postRepository.incrementLikedCount(data.publicId, data.userId);
    //   }
    // } else {
    //   if (old?.isLike) {
    //     await postRepository.decrementLikedCount(data.publicId, data.userId);
    //   } else {
    //     return;
    //   }
    // }
  }

  async initSyncJob() {
    await Promise.all([
      this.processAddLike(),
      this.processRemoveLike(),
    ]);
  }

  async processAddLike() {
    const results = await this.rPopCustomBatch(QUEUE_NAME.LIKED_ADD_QUEUE, 500);
    const grouped = Map.groupBy(results, (item: LikeResult) => item.postPublicId as string);
    if (results.length === 0) return;
    await Promise.all([
      likeRepository.createMany(results.map((item) => ({
        userId: item.userId as string,
        postId: item.postPublicId as string,
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
    const grouped = Map.groupBy(results, (item: LikeResult) => item.postPublicId as string);
    await Promise.all([
      likeRepository.createMany(results.map((item) => ({
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
    const result = await redisService.lMPop([key], "RIGHT", { count });

    if (!result || typeof result !== 'object' || !('elements' in result)) return [];

    const { elements } = result as { key: string; elements: string[] };

    return elements.map((item) => JSON.parse(item) as LikeResult);
  }

}

export const likeWorker = new LikeWorker();
