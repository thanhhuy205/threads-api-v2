import { getSinglePost } from "@/features/post/api/get-single-post";
import type { SinglePostResponse } from "@/types/post";
import { useQuery } from "@tanstack/react-query";
import type { PostQueryOptions } from "./shared";
import { postKeys } from "../keys";

export const useGetSinglePostQuery = (
  publicId: string,
  options?: PostQueryOptions<SinglePostResponse>,
) =>
  useQuery({
    queryKey: postKeys.single(publicId),
    queryFn: () => getSinglePost(publicId),
    ...options,
  });
