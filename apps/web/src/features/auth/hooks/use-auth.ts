"use client";

import { useAuthStore } from "@/features/auth/store/auth-store";

export const useFetchCurrentUser = () => {
  const user = useAuthStore((state) => state.user);
  return {
    data: user ? { success: true, data: user } : undefined,
    isLoading: false,
    isFetching: false,
  };
};

export const useCurrentUser = () => {
  return useAuthStore((state) => state.user);
};

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return {
    user,
    isAuthenticated,
    isLoading: false,
    isRefreshing: false,
  };
};
