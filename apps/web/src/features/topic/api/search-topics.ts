import type { TopicSearchQueryDto, TopicSearchResponse } from "@/types/topic";
import { http } from "@/utils/http";

// GET /topic?q=nestjs — returns at most 40 items, no pagination
export const searchTopics = (params: TopicSearchQueryDto) =>
  http.get<TopicSearchResponse>("/topic", { params });
