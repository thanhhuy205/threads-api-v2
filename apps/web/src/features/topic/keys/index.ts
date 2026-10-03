import type { TopicSearchQueryDto } from "@/types/topic";

export const topicKeys = {
    all: ["topic"] as const,
    list: (query?: TopicSearchQueryDto) =>
        ["topic", "list", query].filter(Boolean),
    search: (query: Pick<TopicSearchQueryDto, "q">) =>
        ["topic", "search", query.q].filter(Boolean),
    detail: (name: string) => [...topicKeys.all, "detail", name] as const,
};
