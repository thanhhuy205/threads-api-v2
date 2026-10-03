import type { ForgotPasswordType } from "@/types/auth";
import { http } from "@/utils/http";

export const forgotPassword = (payload: ForgotPasswordType) =>
  http.post("/api/auth/forgot-password", payload);
