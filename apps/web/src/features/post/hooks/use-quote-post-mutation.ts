import { postKeys } from "@/features/post/keys";
import { quotePost } from "@/features/post/api/quote-post";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useQuotePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: quotePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
};
