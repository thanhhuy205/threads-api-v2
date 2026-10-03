import type { RegisterPayload, RegisterResponse } from "@/types/auth";
import { http } from "@/utils/http";

export const register = (payload: RegisterPayload) =>
  http.post<RegisterResponse>("/api/auth/register", payload);
