import { postKeys } from "@/features/post/keys";
import { deleteThread } from "@/features/post/api/delete-thread";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteThreadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteThread,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
};
