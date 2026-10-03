"use client";

import { getTopics } from "@/features/topic/api/get-topics";
import { topicKeys } from "@/features/topic/keys";
import type { ApiError } from "@/types/axios";
import type { TopicListResponse, TopicSearchQueryDto } from "@/types/topic";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

type TopicsQueryOptions<TData> = Omit<
    UseQueryOptions<TopicListResponse, ApiError, TData, readonly unknown[]>,
    "queryKey" | "queryFn"
>;

type UseGetTopicsQueryInput = {
    query?: TopicSearchQueryDto;
    options?: TopicsQueryOptions<TopicListResponse>;
};

export const useGetTopicsQuery = ({ query, options }: UseGetTopicsQueryInput = {}) =>
    useQuery({
        queryKey: topicKeys.list(query),
        queryFn: () => getTopics(query),
        ...options,
    });
