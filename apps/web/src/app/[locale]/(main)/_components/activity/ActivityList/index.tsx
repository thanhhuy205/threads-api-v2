"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { NotificationItem } from "@/types/notification";
import { AlertTriangle, Check, Clock3, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import ActivityItem from "../ActivityItem";

interface Props {
  notifications: NotificationItem[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

type ActivityTab = "all" | "mentions" | "approval" | "system";
type PriorityFilter = "all" | "urgent" | "important" | "fyi";

const normalizeType = (notification: NotificationItem) =>
  String(notification.type ?? "").toUpperCase();

const getPriority = (notification: NotificationItem): PriorityFilter => {
  const type = normalizeType(notification);
  if (type === "INVITATION") return "urgent";
  if (["REPLY", "MENTION", "MESSAGE", "POST"].includes(type)) {
    return "important";
  }
  return "fyi";
};

function ActivitySkeletonItem() {
  return (
    <div className="flex items-start gap-3 border-b border-border px-5 py-4">
      <Skeleton className="size-9 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-[88%]" />
        <Skeleton className="h-3 w-[62%]" />
      </div>
    </div>
  );
}

export default function ActivityList({
  notifications,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
}: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<ActivityTab>("all");
  const [priority, setPriority] = useState<PriorityFilter>("all");

  useEffect(() => {
    if (!hasNextPage) return;
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isFetchingNextPage) onLoadMore();
        });
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  const filteredNotifications = useMemo(
    () =>
      notifications.filter((notification) => {
        const type = normalizeType(notification);
        const matchesTab =
          activeTab === "all" ||
          (activeTab === "mentions" && type === "MENTION") ||
          (activeTab === "approval" && type === "INVITATION") ||
          (activeTab === "system" && ["POST", "MESSAGE"].includes(type));
        const matchesPriority =
          priority === "all" || getPriority(notification) === priority;
        return matchesTab && matchesPriority;
      }),
    [activeTab, notifications, priority],
  );

  const groupedNotifications = useMemo(() => {
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

    const groups = new Map<string, NotificationItem[]>();
    filteredNotifications.forEach((notification) => {
      const date = new Date(notification.lastEventAt || notification.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const label =
        key === todayKey
          ? locale === "vi"
            ? "Hôm nay"
            : "Today"
          : key === yesterdayKey
            ? locale === "vi"
              ? "Hôm qua"
              : "Yesterday"
            : locale === "vi"
              ? "Tuần này"
              : "This week";
      groups.set(label, [...(groups.get(label) ?? []), notification]);
    });
    return Array.from(groups.entries());
  }, [filteredNotifications, locale]);

  const urgentCount = notifications.filter(
    (notification) => getPriority(notification) === "urgent",
  ).length;
  const importantCount = notifications.filter(
    (notification) => getPriority(notification) === "important",
  ).length;
  const fyiCount = notifications.filter(
    (notification) => getPriority(notification) === "fyi",
  ).length;

  const tabs: Array<{ key: ActivityTab; label: string }> = [
    { key: "all", label: locale === "vi" ? "Tất cả" : "All" },
    {
      key: "mentions",
      label: locale === "vi" ? "Nhắc đến bạn" : "Mentions",
    },
    {
      key: "approval",
      label: locale === "vi" ? "Cần duyệt" : "Approvals",
    },
    { key: "system", label: locale === "vi" ? "Hệ thống" : "System" },
  ];

  const filters: Array<{
    key: PriorityFilter;
    label: string;
    dot?: string;
  }> = [
    {
      key: "all",
      label: locale === "vi" ? "Tất cả mức độ" : "All priorities",
    },
    {
      key: "urgent",
      label: locale === "vi" ? "Khẩn cấp" : "Urgent",
      dot: "bg-destructive",
    },
    {
      key: "important",
      label: locale === "vi" ? "Quan trọng" : "Important",
      dot: "bg-foreground",
    },
    {
      key: "fyi",
      label: locale === "vi" ? "Tham khảo" : "For reference",
      dot: "bg-border",
    },
  ];

  return (
    <div className="mx-auto min-h-full w-full  border-x border-border bg-background">
      <div className="sticky top-0 z-10 flex gap-5 overflow-x-auto border-b border-border bg-background/95 px-4 pt-3 backdrop-blur sm:gap-7 sm:px-5">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 border-b-2 pb-3 text-sm font-semibold transition-colors ${
              activeTab === tab.key
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 px-4 pt-3 sm:px-5">
        {filters.map((filter) => (
          <button
            type="button"
            key={filter.key}
            onClick={() => setPriority(filter.key)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] font-semibold transition-colors ${
              priority === filter.key
                ? "border-accent bg-accent text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}>
            {filter.dot ? (
              <span className={`size-1.5 rounded-full ${filter.dot}`} />
            ) : null}
            {filter.label}
          </button>
        ))}
      </div>

      <section className="mx-4 mb-1 mt-4 overflow-hidden rounded-xl border border-border bg-card sm:mx-5">
        <div className="flex items-center gap-2 px-3.5 pb-1 pt-3">
          <span className="size-2 animate-pulse rounded-full bg-destructive" />
          <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">
            {locale === "vi"
              ? "Ưu tiên theo vai trò của bạn"
              : "Prioritized for your role"}
          </span>
          <span className="ml-auto rounded-full bg-destructive px-2 py-0.5 font-mono text-[9px] font-bold text-destructive-foreground">
            {locale === "vi" ? "Mới" : "New"}
          </span>
        </div>
        <p className="px-3.5 pb-2 text-[11.5px] leading-relaxed text-muted-foreground">
          {locale === "vi"
            ? "Hệ thống đã lọc và sắp xếp lại theo mức độ bạn cần chú ý."
            : "Notifications are filtered and ordered by how much attention they need."}
        </p>
        <div className="border-t border-border">
          <div className="flex gap-2.5 px-3.5 py-2.5 text-xs">
            <AlertTriangle className="size-3.5 shrink-0" />
            <p>
              <b>
                {urgentCount} {locale === "vi" ? "việc cần duyệt" : "approvals"}
              </b>{" "}
              {locale === "vi" ? "đang chờ bạn." : "are waiting for you."}
            </p>
          </div>
          <div className="flex gap-2.5 border-t border-border px-3.5 py-2.5 text-xs">
            <Check className="size-3.5 shrink-0" />
            <p>
              <b>
                {importantCount}{" "}
                {locale === "vi" ? "thông báo quan trọng" : "important updates"}
              </b>{" "}
              {locale === "vi"
                ? "cần xem trong hôm nay."
                : "need a look today."}
            </p>
          </div>
          <div className="flex gap-2.5 border-t border-border px-3.5 py-2.5 text-xs">
            <Clock3 className="size-3.5 shrink-0" />
            <p>
              <b>
                {fyiCount}{" "}
                {locale === "vi" ? "thông báo tham khảo" : "reference updates"}
              </b>{" "}
              {locale === "vi"
                ? "đã được gộp lại."
                : "have been grouped together."}
            </p>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="mt-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <ActivitySkeletonItem key={`activity-skeleton-${index}`} />
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-3 inline-flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Sparkles className="size-5" />
          </div>
          <p className="text-base font-semibold text-foreground">
            {t("activity.emptyTitle")}
          </p>
          <p className="mt-1 max-w-[360px] text-sm leading-relaxed text-muted-foreground">
            {t("activity.emptyDescription")}
          </p>
        </div>
      ) : (
        <div>
          {groupedNotifications.map(([label, items]) => (
            <section key={label}>
              <h2 className="px-5 pb-2 pt-4 font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                {label}
              </h2>
              {items.map((notification) => (
                <ActivityItem
                  key={`${notification.publicId}-${notification.lastEventAt}`}
                  notification={notification}
                />
              ))}
            </section>
          ))}

          {isFetchingNextPage ? (
            <div>
              <ActivitySkeletonItem />
              <ActivitySkeletonItem />
            </div>
          ) : null}
          {hasNextPage ? <div ref={loadMoreRef} className="h-2" /> : null}
        </div>
      )}
    </div>
  );
}
