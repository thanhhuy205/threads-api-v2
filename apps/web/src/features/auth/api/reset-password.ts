import type { RestPasswordBody } from "@/types/auth";
import { http } from "@/utils/http";

export const resetPassword = (payload: RestPasswordBody) =>
  http.post("/auth/reset-password", payload);
