"use client";

import {
  resendVerifyEmail,
  resendVerifyEmailSession,
} from "@/features/auth/api";
import { useMutation } from "@tanstack/react-query";

export const useResendVerifyEmailMutation = () =>
  useMutation({
    mutationFn: resendVerifyEmail,
  });

export const useResendVerifyEmailSessionMutation = () =>
  useMutation({
    mutationFn: resendVerifyEmailSession,
  });
