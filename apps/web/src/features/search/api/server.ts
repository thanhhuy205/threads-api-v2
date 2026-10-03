import "server-only";

import { serverGetJson } from "@/lib/http/server-api";
import type {
  SearchPostsQueryDto,
  SearchPostsResponse,
  SearchUsernameQueryDto,
  SearchUsernameResponse,
} from "@/types/search";
import { normalizeSearchTake, normalizeSerpType } from "./helpers";

export const getSearchPostsServer = (params: SearchPostsQueryDto) => {
  const q = params.q.trim();

  if (!q) return Promise.resolve(null);

  return serverGetJson<SearchPostsResponse>("/search/posts", {
    params: {
      q,
      after: params.after,
      take: normalizeSearchTake(params.take),
      serp_type: normalizeSerpType(params.serp_type),
    },
  });
};

export const getSearchUsernameServer = (params: SearchUsernameQueryDto) => {
  const q = params.q.trim();

  if (!q) return Promise.resolve(null);

  return serverGetJson<SearchUsernameResponse>("/search/username", {
    params: {
      q,
    },
  });
};
