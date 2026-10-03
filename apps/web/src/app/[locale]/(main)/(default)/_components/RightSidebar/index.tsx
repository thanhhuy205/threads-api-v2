"use client";

import { useAuth } from "@/features/auth/hooks";
import { normalizePathname } from "@/utils/normalize-pathname";
import {
  BellRing,
  CalendarDays,
  Check,
  Clock3,
  Heart,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

const skills = ["Node.js", "SQL cơ bản", "NestJS", "Prisma"];
const profileSkills = [
  "NestJS",
  "Prisma",
  "MariaDB",
  "Kiến trúc hệ thống",
  "Docker",
  "Mentoring",
];

function RailCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border px-3.5 py-3">
        {icon}
        <h2 className="text-[13px] font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function RightSidebar() {
  const pathname = normalizePathname(usePathname());
  const locale = useLocale();
  const { user } = useAuth();

  if (pathname === "/activity") return null;

  if (pathname === "/growth") {
    return (
      <aside className="sticky top-0 hidden h-full w-[320px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-border bg-card p-4 xl:flex">
        <RailCard
          title="Kỹ năng đã tích luỹ"
          icon={<Check className="size-4" />}>
          <div className="flex flex-wrap gap-1.5 p-3.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-accent px-2.5 py-1 font-mono text-[10.5px] font-semibold">
                {skill}
              </span>
            ))}
          </div>
        </RailCard>

        <RailCard
          title="Ai được xác nhận milestone"
          icon={<LockKeyhole className="size-4" />}>
          <div className="flex items-center gap-2 border-b border-border px-3.5 py-2.5 text-xs">
            <Check className="size-3.5" /> Tech Lead &amp; HR
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2.5 text-xs text-muted-foreground">
            <LockKeyhole className="size-3.5" /> Intern không tự xác nhận cho
            bản thân
          </div>
        </RailCard>
      </aside>
    );
  }

  if (pathname.startsWith("/profile")) {
    // const joinedAt = user?.createdAt
    //   ? new Intl.DateTimeFormat(locale, {
    //       month: "2-digit",
    //       year: "numeric",
    //     }).format(new Date(user.createdAt))
    //   : "—";
    const role = user?.role === "ADMIN" ? "Quản trị viên" : "Thành viên";

    return (
      <aside className="sticky top-0 hidden h-full w-[320px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-border bg-card p-4 xl:flex">
        <RailCard
          title="Thông tin nhanh"
          icon={<UserRound className="size-4" />}>
          {[
            ["Vai trò", role],
            ["Tổ chức", "Acme Tech"],
            ["Tham gia", 0],
            [
              "Trạng thái",
              user?.status === "ACTIVE" ? "Đang hoạt động" : "Không hoạt động",
            ],
          ].map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between border-b border-border px-3.5 py-2.5 text-xs last:border-b-0">
              <span className="text-muted-foreground">{key}</span>
              <span className="font-semibold">{value}</span>
            </div>
          ))}
        </RailCard>

        <RailCard
          title="Kỹ năng được xác nhận"
          icon={<Check className="size-4" />}>
          <div className="flex flex-wrap gap-1.5 p-3.5">
            {profileSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-accent px-2.5 py-1 font-mono text-[10.5px] font-semibold">
                {skill}
              </span>
            ))}
          </div>
        </RailCard>

        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 px-3.5 pb-1 pt-3">
            <span className="size-2 animate-pulse rounded-full bg-destructive" />
            <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">
              Điểm nổi bật quý này
            </p>
          </div>
          <p className="px-3.5 pb-2 text-[11.5px] leading-relaxed text-muted-foreground">
            Tổng hợp tự động từ hoạt động và phản hồi của đồng nghiệp.
          </p>
          <div className="flex gap-2 border-t border-border px-3.5 py-2.5 text-xs leading-relaxed">
            <Check className="size-3.5 shrink-0" />
            <span>
              <b>{user?.postsCount ?? 0} bài viết</b> đã đóng góp cho tổ chức
            </span>
          </div>
          <div className="flex gap-2 border-t border-border px-3.5 py-2.5 text-xs leading-relaxed">
            <Heart className="size-3.5 shrink-0" />
            <span>
              Có <b>{user?.followersCount ?? 0} người theo dõi</b> trong mạng
              lưới
            </span>
          </div>
        </section>
      </aside>
    );
  }

  const pendingNotifications = [
    { id: 1, title: "Yêu cầu tham gia nhóm", time: "5 phút" },
    { id: 2, title: "Bài viết đang chờ duyệt", time: "20 phút" },
  ];
  const upcomingActivities = [
    { id: 1, title: "Họp nhóm sản phẩm", date: "Hôm nay, 14:00" },
    { id: 2, title: "Chia sẻ kiến thức nội bộ", date: "Ngày mai, 09:30" },
  ];

  return (
    <aside className="sticky top-0 hidden h-full w-[320px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-border bg-card p-4 xl:flex">
      <RailCard
        title="Thông báo cần xác nhận"
        icon={<BellRing className="size-4" />}>
        <ul>
          {pendingNotifications.map((notification) => (
            <li
              key={notification.id}
              className="flex items-center gap-2.5 border-b border-border px-3.5 py-2.5 last:border-b-0">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {notification.id}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs font-semibold">
                {notification.title}
              </span>
              <span className="font-mono text-[9.5px] text-muted-foreground">
                {notification.time}
              </span>
            </li>
          ))}
        </ul>
      </RailCard>

      <RailCard
        title="Hoạt động sắp tới"
        icon={<CalendarDays className="size-4" />}>
        <ul>
          {upcomingActivities.map((activity) => (
            <li
              key={activity.id}
              className="flex gap-2.5 border-b border-border px-3.5 py-2.5">
              <Clock3 className="mt-0.5 size-4 shrink-0" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold">
                  {activity.title}
                </p>
                <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                  {activity.date}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <Link
          href={`/${locale}/growth`}
          className="flex items-center justify-center py-2.5 text-xs font-bold hover:bg-muted">
          Xem lịch đầy đủ
        </Link>
      </RailCard>
    </aside>
  );
}
