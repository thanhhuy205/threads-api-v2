"use client";

import type { NotificationItem } from "@/types/notification";
import FallbackNotificationCard from "./components/FallbackNotificationCard";
import FollowNotificationCard from "./components/FollowNotificationCard";
import InvitationNotificationCard from "./components/InvitationNotificationCard";
import PostInteractionNotificationCard from "./components/PostInteractionNotificationCard";
import { normalizeNotificationType } from "./notification-utils";

interface Props {
  notification: NotificationItem;
}

export default function ActivityItem({ notification }: Props) {
  const normalizedType = normalizeNotificationType(notification.type);

  if (
    normalizedType === "REPLY" ||
    normalizedType === "LIKE" ||
    normalizedType === "QUOTE" ||
    normalizedType === "MENTION"
  ) {
    return <PostInteractionNotificationCard notification={notification} />;
  }

  if (normalizedType === "FOLLOW") {
    return <FollowNotificationCard notification={notification} />;
  }

  if (normalizedType === "INVITATION") {
    return <InvitationNotificationCard notification={notification} />;
  }

  return <FallbackNotificationCard notification={notification} />;
}
