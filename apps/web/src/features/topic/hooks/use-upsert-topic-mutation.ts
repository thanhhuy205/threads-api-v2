"use client";

import { upsertTopic } from "@/features/topic/api/upsert-topic";
import { topicKeys } from "@/features/topic/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpsertTopicMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: upsertTopic,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: topicKeys.list() });
            const name = response?.data?.name;
            if (name) {
                queryClient.invalidateQueries({ queryKey: topicKeys.detail(name) });
            }
        },
    });
};
