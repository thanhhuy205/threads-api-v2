import type { SimilarPostsRequest } from "@/types/post";
import { useMutation } from "@tanstack/react-query";
import { getSimilarPosts } from "../api";

export const useSimilarPostsMutation = (publicId: string) => {
  return useMutation({
    mutationFn: (payload: SimilarPostsRequest) =>
      getSimilarPosts(publicId, payload),
  });
};
