import type { ValidateResponse, ValidateUsername } from "@/types/auth";
import { http } from "@/utils/http";

export const validateUsername = (payload: ValidateUsername) =>
  http.post<ValidateResponse>("/auth/validate/username", payload);
