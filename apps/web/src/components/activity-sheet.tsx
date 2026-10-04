"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  AtSign,
  Bell,
  Check,
  Heart,
  MessageSquareText,
  Pin,
  UserPlus,
  X,
} from "lucide-react";
import {
  cloneElement,
  type ReactElement,
  useMemo,
  useState,
} from "react";

type ActivityFilter = "all" | "mentions" | "workspace";

interface ActivityItem {
  id: number;
  actor: string;
  initials: string;
  message: string;
  subject?: string;
  time: string;
  group: "Today" | "Earlier";
  category: Exclude<ActivityFilter, "all">;
  type: "mention" | "reaction" | "comment" | "member" | "pin";
  unread: boolean;
  avatarClassName: string;
}

const initialActivities: ActivityItem[] = [
  {
    id: 1,
    actor: "Linh Tran",
    initials: "LT",
    message: "mentioned you in a discussion",
    subject: "Q4 partnership opportunities",
    time: "5m",
    group: "Today",
    category: "mentions",
    type: "mention",
    unread: true,
    avatarClassName: "bg-[#dbeafe] text-[#1d4ed8]",
  },
  {
    id: 2,
    actor: "Minh Pham",
    initials: "MP",
    message: "reacted to your announcement",
    subject: "Founder meetup — October edition",
    time: "24m",
    group: "Today",
    category: "mentions",
    type: "reaction",
    unread: true,
    avatarClassName: "bg-[#dcfce7] text-[#15803d]",
  },
  {
    id: 3,
    actor: "An Le",
    initials: "AL",
    message: "commented on your post",
    subject: "A practical playbook for hiring the first sales lead",
    time: "1h",
    group: "Today",
    category: "mentions",
    type: "comment",
    unread: false,
    avatarClassName: "bg-[#ffedd5] text-[#c2410c]",
  },
  {
    id: 4,
    actor: "PulseBoard",
    initials: "PB",
    message: "Quang Do accepted your invitation and joined the workspace.",
    time: "3h",
    group: "Today",
    category: "workspace",
    type: "member",
    unread: true,
    avatarClassName: "bg-[#0d121c] text-white",
  },
  {
    id: 5,
    actor: "Mai Hoang",
    initials: "MH",
    message: "pinned an important post for everyone",
    subject: "Community guidelines for confidential discussions",
    time: "Yesterday",
    group: "Earlier",
    category: "workspace",
    type: "pin",
    unread: false,
    avatarClassName: "bg-[#fce7f3] text-[#be185d]",
  },
  {
    id: 6,
    actor: "David Nguyen",
    initials: "DN",
    message: "mentioned you in a comment",
    subject: "Private capital roundtable notes",
    time: "2d",
    group: "Earlier",
    category: "mentions",
    type: "mention",
    unread: false,
    avatarClassName: "bg-[#ede9fe] text-[#6d28d9]",
  },
];

const activityIcons = {
  mention: AtSign,
  reaction: Heart,
  comment: MessageSquareText,
  member: UserPlus,
  pin: Pin,
};

const filters: Array<{ value: ActivityFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "mentions", label: "Mentions" },
  { value: "workspace", label: "Workspace" },
];

interface ActivitySheetProps {
  trigger: ReactElement;
  onOpenChange?: (open: boolean) => void;
}

export function ActivitySheet({
  trigger,
  onOpenChange,
}: ActivitySheetProps) {
  const [activities, setActivities] = useState(initialActivities);
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>("all");

  const visibleActivities = useMemo(
    () =>
      activities.filter(
        (activity) =>
          activeFilter === "all" || activity.category === activeFilter,
      ),
    [activeFilter, activities],
  );

  const unreadCount = activities.filter((activity) => activity.unread).length;
  const groupedActivities = ["Today", "Earlier"].map((group) => ({
    group,
    items: visibleActivities.filter((activity) => activity.group === group),
  }));

  const markAllAsRead = () => {
    setActivities((current) =>
      current.map((activity) => ({ ...activity, unread: false })),
    );
  };

  const markAsRead = (id: number) => {
    setActivities((current) =>
      current.map((activity) =>
        activity.id === id ? { ...activity, unread: false } : activity,
      ),
    );
  };

  return (
    <Sheet onOpenChange={onOpenChange}>
      <SheetTrigger render={cloneElement(trigger)} />
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full gap-0 border-l border-[#e5e7eb] bg-white p-0 text-[#0d121c] shadow-[-16px_0_48px_rgba(13,18,28,0.08)] sm:max-w-[430px]"
      >
        <SheetHeader className="gap-0 border-b border-[#f3f4f6] px-5 pb-0 pt-5">
          <div className="flex items-start justify-between gap-4 pr-0">
            <div>
              <div className="flex items-center gap-2">
                <SheetTitle className="text-xl font-semibold tracking-[-0.025em] text-[#0d121c]">
                  Activity
                </SheetTitle>
                {unreadCount > 0 ? (
                  <span className="flex min-w-5 items-center justify-center rounded-full bg-[#0d121c] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {unreadCount}
                  </span>
                ) : null}
              </div>
              <SheetDescription className="mt-1 text-[13px] text-[#6c737f]">
                Updates from your private business community.
              </SheetDescription>
            </div>
            <SheetClose
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="-mr-1 -mt-1 rounded-full text-[#6c737f] hover:bg-[#f9fafb] hover:text-[#0d121c]"
                />
              }
            >
              <X className="size-4" />
              <span className="sr-only">Close activity</span>
            </SheetClose>
          </div>

          <div className="mt-5 flex items-end justify-between gap-3">
            <div className="flex items-center gap-5">
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={cn(
                    "relative pb-3 text-[13px] font-medium text-[#6c737f] transition-colors hover:text-[#0d121c]",
                    activeFilter === filter.value &&
                      "font-semibold text-[#0d121c] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-[#1a84a3]",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="mb-2.5 h-6 gap-1 px-1.5 text-[11px] font-medium text-[#1a84a3] hover:bg-[#eff8fb] hover:text-[#146b84] disabled:opacity-40"
            >
              <Check className="size-3" />
              Mark all read
            </Button>
          </div>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#fafbfc]">
          {groupedActivities.map(({ group, items }) =>
            items.length > 0 ? (
              <section key={group}>
                <div className="sticky top-0 z-10 border-b border-[#f3f4f6] bg-[#fafbfc]/95 px-5 py-2.5 backdrop-blur-sm">
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.055em] text-[#6c737f]">
                    {group}
                  </h2>
                </div>
                <div className="divide-y divide-[#f3f4f6] bg-white">
                  {items.map((activity) => {
                    const Icon = activityIcons[activity.type];

                    return (
                      <button
                        type="button"
                        key={activity.id}
                        onClick={() => markAsRead(activity.id)}
                        className={cn(
                          "relative flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-[#fafbfc]",
                          activity.unread && "bg-[#f8fcfd]",
                        )}
                      >
                        {activity.unread ? (
                          <span className="absolute left-2 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[#1a84a3]" />
                        ) : null}
                        <div className="relative shrink-0">
                          <Avatar className="size-10 border border-white shadow-sm">
                            <AvatarFallback
                              className={cn(
                                "text-[11px] font-semibold",
                                activity.avatarClassName,
                              )}
                            >
                              {activity.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-white bg-[#f3f4f6] text-[#4d5761]">
                            <Icon className="size-2.5" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] leading-5 text-[#4d5761]">
                            <span className="font-semibold text-[#0d121c]">
                              {activity.actor}
                            </span>{" "}
                            {activity.message}
                          </p>
                          {activity.subject ? (
                            <p className="mt-1 line-clamp-2 rounded-lg border border-[#f3f4f6] bg-[#f9fafb] px-2.5 py-2 text-[12px] leading-[18px] text-[#4d5761]">
                              {activity.subject}
                            </p>
                          ) : null}
                        </div>
                        <span className="mt-0.5 shrink-0 text-[11px] text-[#9da4ae]">
                          {activity.time}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null,
          )}

          {visibleActivities.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-8 text-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-white text-[#6c737f] ring-1 ring-[#f3f4f6]">
                <Bell className="size-5" />
              </span>
              <p className="mt-3 text-sm font-semibold text-[#0d121c]">
                You’re all caught up
              </p>
              <p className="mt-1 max-w-[260px] text-[13px] leading-5 text-[#6c737f]">
                New activity for this workspace will appear here.
              </p>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
