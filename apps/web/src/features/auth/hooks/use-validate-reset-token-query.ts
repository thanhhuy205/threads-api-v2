"use client";

import { authKeys } from "@/features/auth/keys";
import { validateResetToken } from "@/features/auth/api";
import { useQuery } from "@tanstack/react-query";

export const useValidateResetTokenQuery = (token: string | null) =>
  useQuery({
    queryKey: authKeys.validateResetToken(token ?? ""),
    queryFn: () => validateResetToken(token ?? ""),
    enabled: Boolean(token),
    retry: false,
  });
