"use client";

import { cn } from "@/lib/utils";
import type { NotificationItem } from "@/types/notification";
import { formatTime } from "@/utils/format-time";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type NotificationCardFrameProps = {
  notification: NotificationItem;
  actorName: string;
  Icon: LucideIcon;
  badgeClassName: string;
  description: ReactNode;
  previewText?: string;
  footer?: ReactNode;
  onClick?: () => void;
};

export default function NotificationCardFrame({
  notification,
  Icon,
  description,
  previewText,
  footer,
  onClick,
}: NotificationCardFrameProps) {
  const isUnread = !notification.isRead;
  const cleanPreviewText = previewText?.trim() || "";
  const normalizedType = String(notification.type ?? "").toUpperCase();
  const priority =
    normalizedType === "INVITATION"
      ? "urgent"
      : ["REPLY", "MENTION", "MESSAGE", "POST"].includes(normalizedType)
        ? "important"
        : "fyi";
  const priorityLabel =
    priority === "urgent"
      ? "Khẩn cấp · Cần duyệt"
      : priority === "important"
        ? "Quan trọng"
        : "Tham khảo";

  const rootClassName = cn(
    "relative flex w-full items-start gap-3 border-b border-l-[3px] border-b-border px-4 py-3 text-left transition-colors sm:px-5",
    priority === "urgent" && "border-l-destructive",
    priority === "important" && "border-l-foreground",
    priority === "fyi" && "border-l-border",
    isUnread && "bg-muted/75 pl-6 sm:pl-7",
    onClick && "cursor-pointer hover:bg-accent/60",
  );

  const contentNode = (
    <>
      {isUnread ? (
        <span className="absolute left-2 top-[19px] size-1.5 rounded-full bg-destructive" />
      ) : null}

      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground",
          priority === "urgent" && "bg-destructive text-destructive-foreground",
        )}
      >
        <Icon className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        <span
          className={cn(
            "mb-1 inline-flex rounded-[5px] px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.04em]",
            priority === "urgent" &&
              "bg-destructive text-destructive-foreground",
            priority === "important" &&
              "bg-primary text-primary-foreground",
            priority === "fyi" && "bg-muted text-muted-foreground",
          )}
        >
          {priorityLabel}
        </span>

        <p className="text-[13.5px] leading-relaxed text-foreground">
          {description}
        </p>

        {cleanPreviewText ? (
          <p className="mt-1.5 line-clamp-2 text-xs italic text-muted-foreground">
            {cleanPreviewText}
          </p>
        ) : null}

        {footer ? <div className="mt-2">{footer}</div> : null}
      </div>

      <span className="mt-0.5 shrink-0 whitespace-nowrap font-mono text-[11px] text-muted-foreground">
        {formatTime(notification.lastEventAt)}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={rootClassName} onClick={onClick}>
        {contentNode}
      </button>
    );
  }

  return <div className={rootClassName}>{contentNode}</div>;
}
