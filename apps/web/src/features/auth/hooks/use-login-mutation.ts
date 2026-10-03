"use client";

import { login } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { postKeys } from "@/features/post/keys";
import type { UserResponse } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "../keys";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const userData: UserResponse = {
        success: response.success,
        data: response.data.user,
      };
      queryClient.setQueryData<UserResponse>(authKeys.currentUser, userData);
      useAuthStore.getState().setUser(response.data.user);

      // Refetch feeds with authenticated user context
      void queryClient.invalidateQueries({ queryKey: postKeys.feeds.base });
    },
    onError: () => {
      queryClient.removeQueries({ queryKey: authKeys.currentUser });
      useAuthStore.getState().clearUser();
    },
  });
};
