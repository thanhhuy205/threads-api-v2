import type { BaseResponse } from "@/types/api";
import { http } from "@/utils/http";

export const markNotificationRead = () =>
  http.post<BaseResponse<unknown>>(`/notification/read`);
