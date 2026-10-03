import { postKeys } from "@/features/post/keys";
import { likePost } from "@/features/post/api/like-post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  applyOptimisticPostPatch,
  restorePostSnapshots,
  type PostMutationContext,
} from "./shared";

export const useLikePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likePost,
    onMutate: async ({ publicId, isLiked }): Promise<PostMutationContext> => {
      await queryClient.cancelQueries({ queryKey: postKeys.all });
      const previous = queryClient.getQueriesData({ queryKey: postKeys.all });

      applyOptimisticPostPatch(queryClient, postKeys.all, publicId, (post) => {
        post.isLikedByAuth = !post.isLikedByAuth;
        post.likesCount += isLiked ? 1 : -1;
      });

      return { previous };
    },
    onError: (_error, _variables, context) => {
      restorePostSnapshots(queryClient, context);
    },
  });
};
