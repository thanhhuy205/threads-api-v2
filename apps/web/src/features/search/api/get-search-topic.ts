import type { SearchTopicQueryDto, SearchTopicResponse } from "@/types/search";
import { http } from "@/utils/http";

// GET /search/topic?q=nestjs
export const getSearchTopic = (params: SearchTopicQueryDto) =>
  http.get<SearchTopicResponse>("/search/topic", {
    params: {
      q: params.q.trim(),
    },
  });
