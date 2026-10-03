import type { SearchPostsQueryDto, SearchPostsResponse } from "@/types/search";
import { http } from "@/utils/http";
import { normalizeSearchTake, normalizeSerpType } from "./helpers";

export const getSearchPosts = (params: SearchPostsQueryDto) =>
  http.get<SearchPostsResponse>("/search/posts", {
    params: {
      q: params.q.trim(),
      after: params.after,
      take: normalizeSearchTake(params.take),
      serp_type: normalizeSerpType(params.serp_type),
    },
  });
