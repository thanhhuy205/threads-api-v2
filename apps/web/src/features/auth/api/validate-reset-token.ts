import type { ValidateTokenResponse } from "@/types/auth";
import { http } from "@/utils/http";

export const validateResetToken = (token: string) =>
  http.get<ValidateTokenResponse>(`/api/auth/reset-password/validate?token=${token}`);
