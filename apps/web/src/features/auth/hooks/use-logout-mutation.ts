"use client";

import { logout } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "../keys";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.removeQueries({ queryKey: authKeys.currentUser });
      useAuthStore.getState().clearUser();
    },
  });
};
