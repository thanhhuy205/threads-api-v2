import { postKeys } from "@/features/post/keys";
import { savePost } from "@/features/post/api/save-post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  applyOptimisticPostPatch,
  restorePostSnapshots,
  type PostMutationContext,
} from "./shared";

export const useSavePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePost,
    onMutate: async ({ publicId, isSaved }): Promise<PostMutationContext> => {
      await queryClient.cancelQueries({ queryKey: postKeys.all });
      const previous = queryClient.getQueriesData({ queryKey: postKeys.all });

      applyOptimisticPostPatch(queryClient, postKeys.all, publicId, (post) => {
        post.isSavedByAuth = isSaved;
      });

      return { previous };
    },
    onError: (_error, _variables, context) => {
      restorePostSnapshots(queryClient, context);
    },
  });
};
