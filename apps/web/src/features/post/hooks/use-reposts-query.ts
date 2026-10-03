import { postKeys } from "@/features/post/keys";
import { getReposts } from "@/features/post/api/get-reposts";
import type { PostResponse } from "@/types/post";
import { useQuery } from "@tanstack/react-query";
import type { PostQueryOptions } from "./shared";

export const useGetRepostsQuery = (
  arg: { username: string; after?: string },
  options?: PostQueryOptions<PostResponse>,
) =>
  useQuery({
    queryKey: postKeys.reposts(arg.username, arg.after),
    queryFn: () => getReposts(arg),
    ...options,
  });
