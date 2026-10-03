import type { NotificationItem } from "@/types/notification";

export type NormalizedNotificationType =
  | "POST"
  | "LIKE"
  | "FOLLOW"
  | "QUOTE"
  | "SHARE"
  | "MESSAGE"
  | "REPLY"
  | "MENTION"
  | "INVITATION"
  | "REPOST"
  | "UNKNOWN";

const KNOWN_NOTIFICATION_TYPES = new Set<string>([
  "POST",
  "LIKE",
  "FOLLOW",
  "QUOTE",
  "SHARE",
  "MESSAGE",
  "REPLY",
  "MENTION",
  "INVITATION",
  "REPOST",
]);

type TranslateFn = (
  key: string,
  values?: Record<string, string | number>,
) => string;

export const normalizeNotificationType = (
  type: NotificationItem["type"],
): NormalizedNotificationType => {
  const normalized = String(type ?? "").trim().toUpperCase();
  if (!normalized) return "UNKNOWN";

  return KNOWN_NOTIFICATION_TYPES.has(normalized)
    ? (normalized as NormalizedNotificationType)
    : "UNKNOWN";
};

export const getActorName = (
  notification: NotificationItem,
  fallbackName: string,
) => notification.lastActor?.username?.trim() || fallbackName;

export const getActorLabel = (
  notification: NotificationItem,
  actorName: string,
  t: TranslateFn,
) => {
  if (notification.count > 1) {
    return t("actorAndOthers", {
      actor: actorName,
      count: notification.count - 1,
    });
  }

  return actorName;
};

export const resolvePostPublicId = (notification: NotificationItem) =>
  notification.originPost?.publicId ??
  notification.targetId ??
  notification.targetPost?.publicId ??
  null;

export const resolveTargetPath = (notification: NotificationItem) => {
  const normalizedTargetType = String(notification.targetType ?? "")
    .trim()
    .toUpperCase();

  if (normalizedTargetType === "POST") {
    const postId =
      notification.targetId ??
      notification.originPost?.publicId ??
      notification.targetPost?.publicId;

    return postId ? `/post/${postId}` : null;
  }

  if (normalizedTargetType === "USER") {
    return notification.targetId ? `/${notification.targetId}` : null;
  }

  return null;
};
