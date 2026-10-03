"use client";

import type { NotificationItem } from "@/types/notification";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import NotificationCardFrame from "./NotificationCardFrame";
import { getActorLabel, getActorName } from "../notification-utils";

type InvitationNotificationCardProps = {
  notification: NotificationItem;
};

export default function InvitationNotificationCard({
  notification,
}: InvitationNotificationCardProps) {
  const t = useTranslations("activity.notification");
  const actorName = getActorName(notification, t("unknownUser"));
  const actorLabel = getActorLabel(notification, actorName, t);
  return (
    <NotificationCardFrame
      notification={notification}
      actorName={actorName}
      Icon={Mail}
      badgeClassName="bg-amber-500 text-white"
      description={t("invitation", { actor: actorLabel })}
    />
  );
}
