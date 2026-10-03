"use client";

import type { NotificationItem } from "@/types/notification";
import { Bell, MessageCircle, Repeat2, Send, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import NotificationCardFrame from "./NotificationCardFrame";
import {
  getActorLabel,
  getActorName,
  normalizeNotificationType,
  resolveTargetPath,
} from "../notification-utils";

type FallbackMeta = {
  Icon: LucideIcon;
  badgeClassName: string;
  messageKey: "message" | "share" | "post" | "fallback";
};

const getFallbackMeta = (notification: NotificationItem): FallbackMeta => {
  const normalizedType = normalizeNotificationType(notification.type);

  if (normalizedType === "MESSAGE") {
    return {
      Icon: MessageCircle,
      badgeClassName: "bg-blue-500 text-white",
      messageKey: "message",
    };
  }

  if (normalizedType === "REPOST" || normalizedType === "SHARE") {
    return {
      Icon: Repeat2,
      badgeClassName: "bg-emerald-500 text-white",
      messageKey: "share",
    };
  }

  if (normalizedType === "POST") {
    return {
      Icon: Send,
      badgeClassName: "bg-slate-500 text-white",
      messageKey: "post",
    };
  }

  return {
    Icon: Bell,
    badgeClassName: "bg-zinc-500 text-white",
    messageKey: "fallback",
  };
};

type FallbackNotificationCardProps = {
  notification: NotificationItem;
};

export default function FallbackNotificationCard({
  notification,
}: FallbackNotificationCardProps) {
  const t = useTranslations("activity.notification");
  const router = useRouter();
  const actorName = getActorName(notification, t("unknownUser"));
  const actorLabel = getActorLabel(notification, actorName, t);
  const meta = getFallbackMeta(notification);
  const targetPath = resolveTargetPath(notification);

  return (
    <NotificationCardFrame
      notification={notification}
      actorName={actorName}
      Icon={meta.Icon}
      badgeClassName={meta.badgeClassName}
      description={t(meta.messageKey, { actor: actorLabel })}
      previewText={notification.targetPost?.content?.trim() || undefined}
      footer={
        <div className="inline-flex items-center rounded-full border border-border/70 bg-muted/20 px-2 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
          {String(notification.type || "UNKNOWN")}
        </div>
      }
      onClick={
        targetPath
          ? () => {
              router.push(targetPath);
            }
          : undefined
      }
    />
  );
}
