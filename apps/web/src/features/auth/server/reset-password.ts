import "server-only";

import { serverFetch } from "@/lib/http/server";
import type { ValidateTokenResponse } from "@/types/auth";

export const validateResetPasswordToken = async (token: string) => {
  if (!token) {
    return false;
  }

  const encodedToken = encodeURIComponent(token);
  const response = await serverFetch(`/auth/reset-password/validate?token=${encodedToken}`, {
    auth: false,
  });

  if (!response.ok) {
    return false;
  }

  try {
    const data = (await response.json()) as ValidateTokenResponse;
    return Boolean(data?.data?.valid);
  } catch {
    return false;
  }
};
