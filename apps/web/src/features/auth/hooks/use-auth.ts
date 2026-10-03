"use client";

import { useAuthContext } from "@/features/auth/components/AuthProvider";

export const useFetchCurrentUser = () => {
  const { user } = useAuthContext();
  return {
    data: user ? { success: true, data: user } : undefined,
    isLoading: false,
    isFetching: false,
  };
};

export const useCurrentUser = () => {
  return useAuthContext().user;
};

export const useAuth = () => {
  const { user, isAuthenticated } = useAuthContext();

  return {
    user,
    isAuthenticated,
    isLoading: false,
    isRefreshing: false,
  };
};
