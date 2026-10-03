"use client";

import { register } from "@/features/auth/api";
import type { UserResponse } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "../keys";

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (response) => {
      queryClient.setQueryData<UserResponse>(authKeys.currentUser, {
        success: response.success,
        data: response.data.user,
      });
    },
    onError: () => {
      queryClient.removeQueries({ queryKey: authKeys.currentUser });
    },
  });
};
