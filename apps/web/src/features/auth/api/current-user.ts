import type { UserResponse } from "@/types/user";
import { http } from "@/utils/http";

export const getCurrentUser = () => http.get<UserResponse>("/api/auth/me");
