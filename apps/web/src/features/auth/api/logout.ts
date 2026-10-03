import type { MessageResponse } from "@/types/api";
import { http } from "@/utils/http";

export const logout = () => http.post<MessageResponse>("/api/auth/logout");
