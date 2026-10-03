import type { ValidateEmail, ValidateResponse } from "@/types/auth";
import { http } from "@/utils/http";

export const validateEmail = (payload: ValidateEmail) =>
  http.post<ValidateResponse>("/api/auth/validate/email", payload);
