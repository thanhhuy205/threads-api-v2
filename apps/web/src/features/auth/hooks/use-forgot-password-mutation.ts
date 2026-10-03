"use client";

import { forgotPassword } from "@/features/auth/api";
import { useMutation } from "@tanstack/react-query";

export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: forgotPassword,
  });
