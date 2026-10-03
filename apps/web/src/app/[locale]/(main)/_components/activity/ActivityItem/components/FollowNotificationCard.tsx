"use client";

import type { NotificationItem } from "@/types/notification";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import NotificationCardFrame from "./NotificationCardFrame";
import { getActorLabel, getActorName } from "../notification-utils";

type FollowNotificationCardProps = {
  notification: NotificationItem;
};

export default function FollowNotificationCard({
  notification,
}: FollowNotificationCardProps) {
  const t = useTranslations("activity.notification");
  const router = useRouter();
  const actorName = getActorName(notification, t("unknownUser"));
  const actorLabel = getActorLabel(notification, actorName, t);
  const profilePath = notification.targetId
    ? `/${notification.targetId}`
    : notification.lastActor?.username
      ? `/${notification.lastActor.username}`
      : null;

  return (
    <NotificationCardFrame
      notification={notification}
      actorName={actorName}
      Icon={UserPlus}
      badgeClassName="bg-violet-500 text-white"
      description={t("follow", { actor: actorLabel })}
      onClick={
        profilePath
          ? () => {
              router.push(profilePath);
            }
          : undefined
      }
    />
  );
}
