import { likeRepository } from "@/modules/post/repository/like.repository";
import { postRepository } from "@/modules/post/repository/post.repository";
import { transactionService } from "@/shared/transaction/transaction.service";

type ApplyLikeEventResult = {
  changed: boolean;
  likesCount: number;
  ownerId: string;
};

class LikeEventService {
  applyEvent(payload: {
    userId: string;
    postId: string;
    isLiked: boolean;
  }): Promise<ApplyLikeEventResult> {
    return transactionService.doInTransaction(async (tx) => {
      const result = payload.isLiked
        ? await likeRepository.createIfAbsent({
          userId: payload.userId,
          postId: payload.postId,
        }, tx)
        : await likeRepository.deleteByUserAndPost({
          userId: payload.userId,
          postId: payload.postId,
        }, tx);

      const changed = result.count === 1;
      if (changed) {
        await postRepository.applyLikeCountDelta(
          payload.postId,
          payload.isLiked ? 1 : -1,
          tx,
        );
      }

      const post = await postRepository.findLikeCountSnapshot(
        payload.postId,
        tx,
      );

      return {
        changed,
        likesCount: post.likesCount,
        ownerId: post.ownerId,
      };
    });
  }
}

export const likeEventService = new LikeEventService();
