"use client";

import { Button } from "@/components/ui/button";
import { Check, CheckCircle2, Layers3, LockKeyhole } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

const members = [
  { initials: "GB", name: "Gia Bảo", percent: 40 },
  { initials: "TL", name: "Thu Linh", percent: 75 },
  { initials: "HN", name: "Hoàng Nam", percent: 20 },
];

type Milestone = {
  status: "done" | "pending" | "progress" | "locked";
  date: string;
  title: string;
  description: string;
  endorser?: string;
  skills: readonly string[];
};

const milestones: readonly Milestone[] = [
  {
    status: "done",
    date: "Tháng 5 · 2025 · Hoàn thành",
    title: "Hoàn thành onboarding & quy trình seed dữ liệu",
    description:
      "Làm quen môi trường dev, quy trình code review và cấu trúc dự án Backend.",
    endorser: "Minh Anh — Tech Lead",
    skills: ["Node.js", "SQL cơ bản"],
  },
  {
    status: "done",
    date: "Tháng 7 · 2025 · Hoàn thành",
    title: "Viết API CRUD đầu tiên cho module thông báo",
    description:
      "Tự thiết kế schema, viết test cơ bản và triển khai lên môi trường staging.",
    endorser: "Minh Anh — Tech Lead",
    skills: ["NestJS", "Prisma"],
  },
  {
    status: "pending",
    date: "Tháng 8 · 2025 · Vừa nộp",
    title: "Thiết kế API đăng nhập",
    description:
      "Đã hoàn thành phần code & test, đang chờ xác nhận để tính vào lộ trình chính thức.",
    skills: ["Xử lý lỗi API"],
  },
  {
    status: "progress",
    date: "Đang thực hiện",
    title: "Viết unit test cho module thanh toán",
    description:
      "Mốc hiện tại — dự kiến hoàn thành trước 30/08, mentor trực tiếp: Đức Anh.",
    skills: [],
  },
  {
    status: "locked",
    date: "Sắp tới",
    title: 'Chủ trì một thread "Quyết định" nhỏ',
    description: "Mốc cuối trước khi xét lên Junior Backend.",
    skills: [],
  },
] as const;

export default function GrowthPageClient() {
  const locale = useLocale();
  const [activeMember, setActiveMember] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const member = members[activeMember];
  const completed = isApproved ? 3 : 2;

  const approveMilestone = () => {
    setIsApproved(true);
    toast.success(
      locale === "vi"
        ? "Đã xác nhận milestone của Gia Bảo"
        : "Gia Bảo's milestone has been approved",
    );
  };

  return (
    <div className="mx-auto min-h-full w-full border-x border-border bg-background">
      <header className="px-4 pb-1 pt-[18px] sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full border border-border bg-accent text-[15px] font-bold">
            {member.initials}
          </span>
          <div>
            <h1 className="text-[15.5px] font-extrabold">{member.name}</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Intern Backend · Lộ trình Intern → Junior Backend
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-6">
          <div>
            <p className="text-xl font-extrabold">{completed}/5</p>
            <p className="text-[11px] text-muted-foreground">Mốc hoàn thành</p>
          </div>
          <div>
            <p className="text-xl font-extrabold">{isApproved ? 4 : 3}</p>
            <p className="text-[11px] text-muted-foreground">
              Kỹ năng được xác nhận
            </p>
          </div>
          <div>
            <p className="text-xl font-extrabold">4</p>
            <p className="text-[11px] text-muted-foreground">
              Tháng tại Acme Tech
            </p>
          </div>
        </div>

        <div className="mt-3.5 flex h-1.5 gap-0.5 overflow-hidden rounded-full bg-input">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className={`flex-1 ${index < completed ? "bg-primary" : "bg-input"}`}
            />
          ))}
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto px-4 pb-4 pt-2 sm:px-5">
        {members.map((item, index) => (
          <button
            type="button"
            key={item.name}
            onClick={() => setActiveMember(index)}
            className={`flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 transition-colors ${
              activeMember === index
                ? "border-accent bg-accent"
                : "border-border bg-card hover:bg-muted"
            }`}>
            <span className="flex size-6 items-center justify-center rounded-full border border-border bg-card text-[10px] font-bold">
              {item.initials}
            </span>
            <span className="text-xs font-semibold">{item.name}</span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {item.percent}%
            </span>
          </button>
        ))}
      </div>

      <div className="px-4 pb-8 pt-2 sm:px-5">
        {milestones.map((milestone, index) => {
          const approvedPending = milestone.status === "pending" && isApproved;
          const status = approvedPending ? "done" : milestone.status;

          return (
            <div key={milestone.title} className="flex gap-3.5">
              <div className="flex shrink-0 flex-col items-center pt-0.5">
                <span
                  className={`relative size-[11px] shrink-0 rounded-full ring-[3px] ring-muted ${
                    status === "done"
                      ? "bg-primary"
                      : status === "progress"
                        ? "border-2 border-foreground bg-card after:absolute after:inset-[2px] after:rounded-full after:bg-foreground"
                        : "border-2 border-border bg-card"
                  }`}
                />
                {index < milestones.length - 1 ? (
                  <span className="my-1 min-h-9 w-0.5 flex-1 bg-border" />
                ) : null}
              </div>

              <div className="min-w-0 flex-1 pb-6">
                <p
                  className={`font-mono text-[10.5px] uppercase tracking-[0.06em] ${
                    status === "locked"
                      ? "text-muted-foreground"
                      : "text-muted-foreground"
                  }`}>
                  {approvedPending
                    ? "Tháng 8 · 2025 · Hoàn thành"
                    : milestone.date}
                </p>
                <h2
                  className={`mt-1 text-[14.5px] font-bold tracking-tight ${
                    status === "locked" ? "text-muted-foreground" : ""
                  }`}>
                  {milestone.title}
                </h2>
                <p
                  className={`mt-1 text-[13px] leading-relaxed ${
                    status === "locked"
                      ? "text-muted-foreground"
                      : "text-foreground"
                  }`}>
                  {milestone.description}
                </p>

                {milestone.endorser || approvedPending ? (
                  <div className="mt-2.5 flex items-center gap-2.5 rounded-lg bg-muted px-3 py-2.5">
                    <Layers3 className="size-3.5 shrink-0" />
                    <p className="text-xs">
                      Xác nhận bởi{" "}
                      <b>{milestone.endorser || "Bạn — Tech Lead"}</b>
                    </p>
                  </div>
                ) : null}

                {milestone.status === "pending" && !isApproved ? (
                  <div className="mt-2.5 flex flex-wrap items-center gap-2.5 rounded-lg border border-dashed border-foreground px-3 py-2.5">
                    <p className="min-w-[220px] flex-1 text-xs leading-relaxed">
                      Đang chờ xác nhận — chỉ Tech Lead hoặc HR có quyền duyệt
                      milestone.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      className="h-7 rounded-full px-3 text-[11.5px]"
                      onClick={approveMilestone}>
                      Xác nhận
                    </Button>
                  </div>
                ) : null}

                {status === "locked" ? (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                    <LockKeyhole className="size-3" />
                    Mở khoá sau khi hoàn thành mốc hiện tại
                  </p>
                ) : null}

                {milestone.skills.length ? (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {milestone.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 font-mono text-[10.5px] font-semibold">
                        {approvedPending ? <Check className="size-3" /> : null}
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {isApproved ? (
        <div className="fixed bottom-5 right-5 hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold shadow-lg md:flex">
          <CheckCircle2 className="size-4" /> Milestone đã được xác nhận
        </div>
      ) : null}
    </div>
  );
}
