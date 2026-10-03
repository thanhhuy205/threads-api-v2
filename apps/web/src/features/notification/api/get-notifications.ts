import type { GetNotificationsResponse } from "@/types/notification";
import { http } from "@/utils/http";

export type GetNotificationsQueryDto = {
  after?: string;
  take?: number;
};

export const getNotifications = (params?: GetNotificationsQueryDto) =>
  http.get<GetNotificationsResponse>("/notification", { params });
