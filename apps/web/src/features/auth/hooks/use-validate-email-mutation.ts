"use client";

import { validateEmail } from "@/features/auth/api";
import { useMutation } from "@tanstack/react-query";

export const useValidateEmailMutation = () =>
  useMutation({
    mutationFn: validateEmail,
  });
