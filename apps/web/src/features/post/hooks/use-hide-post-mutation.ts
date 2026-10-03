import { postKeys } from "@/features/post/keys";
import { hidePost } from "@/features/post/api/requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  applyOptimisticPostPatch,
  restorePostSnapshots,
  type PostMutationContext,
} from "./shared";

export const useHidePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: hidePost,
    onMutate: async ({ publicId, isHidden }): Promise<PostMutationContext> => {
      await queryClient.cancelQueries({ queryKey: postKeys.all });
      const previous = queryClient.getQueriesData({ queryKey: postKeys.all });

      applyOptimisticPostPatch(queryClient, postKeys.all, publicId, (post) => {
        post.isHiddenByAuth = isHidden;
      });

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context) {
        restorePostSnapshots(queryClient, context);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
};
