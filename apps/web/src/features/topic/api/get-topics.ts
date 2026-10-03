import type { TopicListResponse, TopicSearchQueryDto } from "@/types/topic";
import { http } from "@/utils/http";

export const getTopics = (params?: TopicSearchQueryDto) =>
  http.get<TopicListResponse>("/topic", { params });
