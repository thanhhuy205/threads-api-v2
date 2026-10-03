import { replyThread } from "@/features/post/api/reply-thread";
import { applyOptimisticPostPatch, PostMutationContext } from "@/features/post/hooks/shared";
import { postKeys } from "@/features/post/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useReplyThreadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: replyThread,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: postKeys.replies.root });
      queryClient.invalidateQueries({
        queryKey: postKeys.single(variables.publicId),
      });
    },
    onMutate: async ({ publicId }): Promise<PostMutationContext> => {
      await queryClient.cancelQueries({ queryKey: postKeys.all });
      const previous = queryClient.getQueriesData({ queryKey: postKeys.all });

      applyOptimisticPostPatch(queryClient, postKeys.all, publicId, (post) => {
        post.repliesCount = post.repliesCount + 1;
      });

      return { previous };
    },
  });
};
