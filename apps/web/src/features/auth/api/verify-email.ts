import type { ValidateTokenBody } from "@/types/auth";
import { http } from "@/utils/http";

export const verifyEmail = (payload: ValidateTokenBody) =>
  http.post("/auth/verify-email", payload);
