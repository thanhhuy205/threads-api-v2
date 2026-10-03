import type { SimilarPostsRequest, SimilarPostsResponse } from "@/types/post";
import { http } from "@/utils/http";

export const getSimilarPosts = async (
  publicId: string,
  payload: SimilarPostsRequest,
) => http.post<SimilarPostsResponse>(`/posts/${publicId}/similar`, payload);
