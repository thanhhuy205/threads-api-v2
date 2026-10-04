"use client";

import { authKeys } from "@/features/auth/keys";
import { getCurrentUser } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const CURRENT_USER_STALE_TIME = 5 * 60 * 1000;

export const useCurrentUserQuery = () => {
  const setUser = useAuthStore((s) => s.setUser);

  const query = useQuery({
    queryKey: authKeys.currentUser,
    queryFn: getCurrentUser,
    retry: false,
    retryOnMount: false,
    staleTime: CURRENT_USER_STALE_TIME,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  // Sync successful query data → Zustand store
  useEffect(() => {
    if (query.data?.data) {
      setUser(query.data.data);
    }
  }, [query.data, setUser]);

  // Clear Zustand store on error (401/404 = auth is gone)
  useEffect(() => {
    if (query.error) {
      setUser(null);
    }
  }, [query.error, setUser]);

  return query;
};

export const useGetMe = useCurrentUserQuery;
