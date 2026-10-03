import { postKeys } from "@/features/post/keys";
import { repostPost } from "@/features/post/api/repost-post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  applyOptimisticPostPatch,
  restorePostSnapshots,
  type PostMutationContext,
} from "./shared";

export const useRepostPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: repostPost,
    onMutate: async (publicId): Promise<PostMutationContext> => {
      await queryClient.cancelQueries({ queryKey: postKeys.all });
      const previous = queryClient.getQueriesData({ queryKey: postKeys.all });

      applyOptimisticPostPatch(queryClient, postKeys.all, publicId, (post) => {
        if (!post.isRepostByAuth) {
          post.repostsCountAndQuoteCount += 1;
        } else {
          post.repostsCountAndQuoteCount -= 1;
        }

        post.isRepostByAuth = !post.isRepostByAuth;
      });

      return { previous };
    },
    onError: (_error, _variables, context) => {
      restorePostSnapshots(queryClient, context);
    },
  });
};
