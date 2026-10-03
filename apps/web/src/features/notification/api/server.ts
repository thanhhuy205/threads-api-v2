import "server-only";

import { PER_PAGE } from "@/constant/pagination";
import { serverGetJson } from "@/lib/http/server-api";
import type { GetNotificationsQueryDto } from "@/features/notification/api/get-notifications";
import type { GetNotificationsResponse } from "@/types/notification";

export const getNotificationsServer = ({
  after,
  take = PER_PAGE,
}: GetNotificationsQueryDto = {}) =>
  serverGetJson<GetNotificationsResponse>("/notification", {
    params: { after, take },
  });
