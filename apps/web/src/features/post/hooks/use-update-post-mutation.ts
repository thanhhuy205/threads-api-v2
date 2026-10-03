"use client";

import { updatePost } from "@/features/post/api/update-post";
import type { UpdatePostDto } from "@/types/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "@/features/post/keys";

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      publicId,
      payload,
    }: {
      publicId: string;
      payload: UpdatePostDto;
    }) => updatePost(publicId, payload),
    onSuccess: (_, { publicId }) => {
      // Invalidate all post-related queries
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
};
