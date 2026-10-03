import type { SearchPostsSerpType } from "@/types/search";

const SEARCH_DEFAULT_TAKE = 20;

export const searchKeys = {
  all: ["search"] as const,
  suggestions: ["search", "suggestions"] as const,
  posts: {
    root: (query: {
      q: string;
      take?: number;
      serp_type?: SearchPostsSerpType;
    }) =>
      [
        "search",
        "posts",
        "infinite",
        query.q.trim(),
        query.take ?? SEARCH_DEFAULT_TAKE,
        query.serp_type ?? "default",
      ] as const,
  },
  // Username & topic no longer paginated — removed take/after from key
  username: {
    root: (query: { q: string }) =>
      ["search", "username", query.q.trim()] as const,
  },
  topic: {
    root: (query: { q: string }) =>
      ["search", "topic", query.q.trim()] as const,
  },
};
