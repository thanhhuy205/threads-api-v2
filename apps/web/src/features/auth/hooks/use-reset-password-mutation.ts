"use client";

import { resetPassword } from "@/features/auth/api";
import { useMutation } from "@tanstack/react-query";

export const useResetPasswordMutation = () =>
  useMutation({
    mutationFn: resetPassword,
  });
