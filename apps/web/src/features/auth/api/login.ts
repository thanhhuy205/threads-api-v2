import type { LoginPayload, LoginResponse } from "@/types/auth";
import { http } from "@/utils/http";

export const login = (payload: LoginPayload) =>
  http.post<LoginResponse>("/api/auth/login", payload);
