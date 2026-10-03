"use client";

import type { NotificationItem } from "@/types/notification";
import { AtSign, Heart, MessageCircle, Quote, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import NotificationCardFrame from "./NotificationCardFrame";
import {
  getActorLabel,
  getActorName,
  normalizeNotificationType,
  resolvePostPublicId,
} from "../notification-utils";

type SupportedPostInteractionType = "REPLY" | "LIKE" | "QUOTE" | "MENTION";

type PostInteractionMeta = {
  Icon: LucideIcon;
  badgeClassName: string;
  messageKey: "reply" | "like" | "quote" | "mention";
};

const POST_INTERACTION_META: Record<
  SupportedPostInteractionType,
  PostInteractionMeta
> = {
  REPLY: {
    Icon: MessageCircle,
    badgeClassName: "bg-sky-500 text-white",
    messageKey: "reply",
  },
  LIKE: {
    Icon: Heart,
    badgeClassName: "bg-rose-500 text-white",
    messageKey: "like",
  },
  QUOTE: {
    Icon: Quote,
    badgeClassName: "bg-emerald-500 text-white",
    messageKey: "quote",
  },
  MENTION: {
    Icon: AtSign,
    badgeClassName: "bg-indigo-500 text-white",
    messageKey: "mention",
  },
};

const resolveSupportedType = (
  notificationType: NotificationItem["type"],
): SupportedPostInteractionType => {
  const normalizedType = normalizeNotificationType(notificationType);
  if (normalizedType === "REPLY") return "REPLY";
  if (normalizedType === "LIKE") return "LIKE";
  if (normalizedType === "QUOTE") return "QUOTE";
  if (normalizedType === "MENTION") return "MENTION";
  return "REPLY";
};

type PostInteractionNotificationCardProps = {
  notification: NotificationItem;
};

export default function PostInteractionNotificationCard({
  notification,
}: PostInteractionNotificationCardProps) {
  const t = useTranslations("activity.notification");
  const router = useRouter();
  const actorName = getActorName(notification, t("unknownUser"));
  const actorLabel = getActorLabel(notification, actorName, t);
  const type = resolveSupportedType(notification.type);
  const meta = POST_INTERACTION_META[type];
  const postPublicId = resolvePostPublicId(notification);
  const previewText = notification.targetPost?.content?.trim() || undefined;

  return (
    <NotificationCardFrame
      notification={notification}
      actorName={actorName}
      Icon={meta.Icon}
      badgeClassName={meta.badgeClassName}
      description={t(meta.messageKey, { actor: actorLabel })}
      previewText={previewText}
      onClick={
        postPublicId
          ? () => {
              router.push(`/post/${postPublicId}`);
            }
          : undefined
      }
    />
  );
}
