"use client";

import { validateUsername } from "@/features/auth/api";
import { useMutation } from "@tanstack/react-query";

export const useValidateUsernameMutation = () =>
  useMutation({
    mutationFn: validateUsername,
  });
