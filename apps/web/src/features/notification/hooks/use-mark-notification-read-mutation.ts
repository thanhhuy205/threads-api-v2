"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationRead } from "../api/mark-notification-read";
import { notificationKeys } from "../keys";

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.unread() });
      queryClient.setQueryData(notificationKeys.unread(), (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            isNotification: false,
          },
        };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
    },
  });
};
