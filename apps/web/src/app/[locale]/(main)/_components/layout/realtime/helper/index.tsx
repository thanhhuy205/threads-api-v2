type RealtimeNotificationToastPayload = {
  avatar?: string;
  originPostId?: string;
  message: string;
};
import { RealtimeToastPayload } from "../RealtimeNotificationToast";
import { RealtimeReportPayload } from "../RealtimeReportToast";
export const REALTIME_TOAST_DURATION = 4500;
export type RealtimeNotificationEvent = unknown;

export const extractRealtimeReportPayload = (
  payload: RealtimeNotificationEvent,
): RealtimeReportPayload => {
  const toRecord = (value: unknown): Record<string, unknown> | undefined =>
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : undefined;

  const root = toRecord(payload);
  const wrappedPayload = toRecord(root?.payload);
  const nestedReportPayload =
    toRecord(root?.report) ?? toRecord(root?.job) ?? toRecord(root?.data);
  const source = wrappedPayload ?? nestedReportPayload ?? root;

  const rawReportId = source?.reportId ?? source?.id;
  const rawTargetPublicId = source?.targetPublicId ?? source?.targetId;
  const rawTargetType = source?.targetType ?? source?.type;
  const rawMessage = source?.message;
  const rawAction = source?.action;

  return {
    reportId:
      typeof rawReportId === "string" || typeof rawReportId === "number"
        ? String(rawReportId)
        : "",
    targetPublicId:
      typeof rawTargetPublicId === "string" ||
      typeof rawTargetPublicId === "number"
        ? String(rawTargetPublicId)
        : "",
    targetType: typeof rawTargetType === "string" ? rawTargetType : "",
    message: typeof rawMessage === "string" ? rawMessage : "",
    action: typeof rawAction === "string" ? rawAction : "none",
  };
};

const extractRealtimeToastPayload = (
  payload: RealtimeNotificationEvent,
): RealtimeToastPayload => {
  const toRecord = (value: unknown): Record<string, unknown> | undefined => {
    let parsedValue = value;
    if (typeof value === "string") {
      try {
        parsedValue = JSON.parse(value);
      } catch (e) {
        // ignore JSON parse error
      }
    }
    return parsedValue &&
      typeof parsedValue === "object" &&
      !Array.isArray(parsedValue)
      ? (parsedValue as Record<string, unknown>)
      : undefined;
  };

  const root = toRecord(payload);
  const wrappedPayload = toRecord(root?.payload);
  const nestedMessagePayload = toRecord(root?.message);
  const source = wrappedPayload ?? nestedMessagePayload ?? root;

  const rawMessage = source?.message ?? source?.content;
  const rawAvatar = source?.avatar;
  let rawOriginPostId = source?.originPostId;
  if (
    !rawOriginPostId &&
    source?.groupPublicId &&
    typeof source.groupPublicId === "string" &&
    source.groupPublicId.startsWith("like-count-update:")
  ) {
    rawOriginPostId = source.groupPublicId.split(":")[1];
  }
  const rawType = source?.type;

  return {
    message: typeof rawMessage === "string" ? rawMessage : "",
    avatar: typeof rawAvatar === "string" && rawAvatar ? rawAvatar : undefined,
    originPostId:
      rawOriginPostId === null || rawOriginPostId === undefined
        ? undefined
        : String(rawOriginPostId),
    type: typeof rawType === "string" ? rawType : undefined,
  };
};

export const extractRealtimeNotificationToastPayload = (
  payload: RealtimeNotificationEvent,
): RealtimeNotificationToastPayload => {
  const toRecord = (value: unknown): Record<string, unknown> | undefined =>
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : undefined;

  const root = toRecord(payload);
  const wrappedPayload = toRecord(root?.payload);
  const nestedMessagePayload = toRecord(root?.message);
  const source = wrappedPayload ?? nestedMessagePayload ?? root;

  const rawAvatar = source?.avatar;
  const rawOriginPostId = source?.originPostId;
  const rawMessage = source?.message;

  return {
    avatar: typeof rawAvatar === "string" && rawAvatar ? rawAvatar : undefined,
    originPostId:
      rawOriginPostId === null || rawOriginPostId === undefined
        ? undefined
        : String(rawOriginPostId),
    message: typeof rawMessage === "string" ? rawMessage : "",
  };
};
