import type { GetNotificationMessageResponse } from "@/types/notification";
import { http } from "@/utils/http";

export const getNotificationMessage = () =>
  http.get<GetNotificationMessageResponse>("/notification/message");
