"use client";

import { getTopic } from "@/features/topic/api/get-topic";
import { topicKeys } from "@/features/topic/keys";
import type { ApiError } from "@/types/axios";
import type { TopicItemResponse } from "@/types/topic";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

type TopicQueryOptions<TData> = Omit<
    UseQueryOptions<TopicItemResponse, ApiError, TData, readonly unknown[]>,
    "queryKey" | "queryFn"
>;

type UseGetTopicQueryInput = {
    name?: string;
    options?: TopicQueryOptions<TopicItemResponse>;
};

export const useGetTopicQuery = ({ name, options }: UseGetTopicQueryInput = {}) =>
    useQuery({
        queryKey: topicKeys.detail(name ?? ""),
        queryFn: () => getTopic(name ?? ""),
        enabled: Boolean(name),
        ...options,
    });
