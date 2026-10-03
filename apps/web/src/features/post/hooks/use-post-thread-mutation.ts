import { postThread } from "@/features/post/api/post-thread";
import { postKeys } from "@/features/post/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePostThreadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postThread,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.feeds.base });
    },
  });
};
