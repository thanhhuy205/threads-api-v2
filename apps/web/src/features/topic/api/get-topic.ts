import type { TopicItemResponse } from "@/types/topic";
import { http } from "@/utils/http";

export const getTopic = (name: string) =>
    http.get<TopicItemResponse>(`/topic/${encodeURIComponent(name)}`);
