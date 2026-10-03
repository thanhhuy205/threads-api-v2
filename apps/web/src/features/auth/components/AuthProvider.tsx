"use client";

import { useAuthStore } from "@/features/auth/store/auth-store";
import type { User } from "@/types/user";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

interface AuthProviderProps {
  initialUser?: User | null;
  children: ReactNode;
}

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({
  initialUser = null,
  children,
}: AuthProviderProps) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    if (initialUser) setUser(initialUser);
  }, [initialUser, setUser]);

  const value = useMemo(
    () => ({ user, isAuthenticated, setUser, clearUser }),
    [clearUser, isAuthenticated, setUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
