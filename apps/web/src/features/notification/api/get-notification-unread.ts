import type { GetNotificationUnreadResponse } from "@/types/notification";
import { http } from "@/utils/http";

export const getNotificationUnread = () =>
  http.get<GetNotificationUnreadResponse>("/notification/unread");
