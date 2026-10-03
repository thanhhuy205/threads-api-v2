import type { CreateTopicDto, TopicItemResponse } from "@/types/topic";
import { http } from "@/utils/http";

export const upsertTopic = (payload: CreateTopicDto) =>
    http.post<TopicItemResponse>("/topic", payload);
