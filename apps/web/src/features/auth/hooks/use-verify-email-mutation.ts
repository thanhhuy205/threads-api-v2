"use client";

import { verifyEmail } from "@/features/auth/api";
import { useMutation } from "@tanstack/react-query";

export const useVerifyEmailMutation = () =>
  useMutation({
    mutationFn: verifyEmail,
  });
