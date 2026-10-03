"use client";

import ProfileSettings from "@/app/[locale]/(main)/(private)/(default)/profile/_components/ProfileSettings";
import AvatarGroup from "@/app/[locale]/(main)/_components/common/AvatarGroup";
import { VerifiedIcon } from "@/app/[locale]/(main)/_components/common/Icon/VerifiedIcon";
import ScrollTop from "@/app/[locale]/(main)/_components/common/ScrollTop";
import { Button } from "@/components/ui/button";
import {
  useAuth,
  useResendVerifyEmailSessionMutation,
} from "@/features/auth/hooks";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user";
import {
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import type { ReactNode } from "react";
import { toast } from "sonner";

type ProfileTab = "threads" | "replies" | "media" | "repost";

type ProfilePageShellProps = {
  activeTab: ProfileTab;
  children: ReactNode;
  initialUser?: User | null;
};

const ProfilePageShell = ({
  activeTab,
  children,
  initialUser,
}: ProfilePageShellProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const { show, hide } = useModal();
  const { user: authUser } = useAuth();
  const user = authUser ?? initialUser;
  const resendVerifyEmailMutation = useResendVerifyEmailSessionMutation();

  if (!user) return null;

  const handleVerifyEmail = () => {
    resendVerifyEmailMutation.mutate(undefined, {
      onSuccess: () => toast.success(t("auth.verifyEmailSuccess")),
      onError: (error) =>
        toast.error(error.message || t("auth.verifyEmailFailed")),
    });
  };

  const localizeRoute = (path: string) => `/${locale}${path}`;
  const tabs: Array<{ value: ProfileTab; label: string; href: string }> = [
    {
      value: "threads",
      label: locale === "vi" ? "Bài viết" : "Posts",
      href: "/profile",
    },
    {
      value: "replies",
      label: locale === "vi" ? "Trả lời" : "Replies",
      href: "/profile/replies",
    },
    {
      value: "media",
      label: locale === "vi" ? "Phương tiện" : "Media",
      href: "/profile/media",
    },
    {
      value: "repost",
      label: locale === "vi" ? "Đăng lại" : "Reposts",
      href: "/profile/repost",
    },
  ];
  const roleLabel =
    user.role === "ADMIN"
      ? locale === "vi"
        ? "Quản trị viên"
        : "Administrator"
      : locale === "vi"
        ? "Thành viên"
        : "Member";
  const joinedAt = 0;

  return (
    <>
      <ScrollTop />
      <div className="mx-auto min-h-full w-full  border-x border-border bg-background">
        <section>
          <div className="h-[132px] bg-gradient-to-br from-accent via-muted to-input" />
          <div className="px-4 pb-3 sm:px-5">
            <div className="-mt-10 w-fit overflow-hidden rounded-[20px] border-4 border-card bg-primary shadow-sm">
              <AvatarGroup
                size={20}
                url={user.avatar || ""}
                fallBack={user.username?.slice(0, 2).toUpperCase()}
                className="rounded-[16px] border-0 bg-primary text-primary-foreground"
                classNameFallback="rounded-[16px] bg-primary text-2xl font-extrabold text-primary-foreground"
              />
            </div>

            <div className="mt-3 flex flex-wrap items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-xl font-extrabold tracking-tight">
                    {user.name || user.username}
                  </h1>
                  {user.verifiedAt ? (
                    <VerifiedIcon className="size-4 text-foreground" />
                  ) : null}
                  <span className="rounded-full bg-primary px-2.5 py-1 text-[10.5px] font-semibold text-primary-foreground">
                    {roleLabel}
                  </span>
                </div>
                <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                  @{user.username} · Acme Tech
                </p>
              </div>

              <div className="ml-auto flex gap-2">
                {!user.verifiedAt ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs font-bold"
                    disabled={resendVerifyEmailMutation.isPending}
                    onClick={handleVerifyEmail}>
                    {locale === "vi" ? "Xác minh" : "Verify"}
                  </Button>
                ) : null}
                <Button
                  type="button"
                  size="sm"
                  className="rounded-full text-xs font-bold"
                  onClick={() =>
                    show(<ProfileSettings onClose={() => hide()} />)
                  }>
                  {t("profile.editProfile")}
                </Button>
              </div>
            </div>

            {user.bio ? (
              <p className="mt-3 whitespace-pre-wrap text-[13.5px] leading-relaxed">
                {user.bio}
              </p>
            ) : null}

            {user.website ? (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold hover:underline">
                {user.labelWebsite || user.website.replace(/^https?:\/\//, "")}
                <ExternalLink className="size-3" />
              </a>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5" />
                {locale === "vi"
                  ? `Tham gia từ ${joinedAt}`
                  : `Joined ${joinedAt}`}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <UsersRound className="size-3.5" />
                {user.followingCount}{" "}
                {locale === "vi" ? "đang theo dõi" : "following"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" />
                {user.status === "ACTIVE"
                  ? locale === "vi"
                    ? "Đang hoạt động"
                    : "Active"
                  : locale === "vi"
                    ? "Không hoạt động"
                    : "Inactive"}
              </span>
            </div>

            <div className="mt-4 flex gap-6">
              <div>
                <p className="text-[15px] font-extrabold">{user.postsCount}</p>
                <p className="text-[11px] text-muted-foreground">
                  {locale === "vi" ? "Bài viết" : "Posts"}
                </p>
              </div>
              <div>
                <p className="text-[15px] font-extrabold">
                  {user.followersCount}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {locale === "vi" ? "Người theo dõi" : "Followers"}
                </p>
              </div>
              <div>
                <p className="text-[15px] font-extrabold">
                  {user.followingCount}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {locale === "vi" ? "Đang theo dõi" : "Following"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <nav className="flex gap-6 overflow-x-auto border-b border-border px-4 pt-3 sm:px-5">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={localizeRoute(tab.href)}
              className={cn(
                "shrink-0 border-b-2 pb-3 text-sm font-semibold transition-colors",
                activeTab === tab.value
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}>
              {tab.label}
            </Link>
          ))}
        </nav>

        <Link
          href={localizeRoute("/growth")}
          className="mx-4 mt-4 flex items-center gap-3 rounded-xl border border-border bg-muted px-3.5 py-3 transition-colors hover:bg-accent sm:mx-5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <TrendingUp className="size-[18px]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13.5px] font-bold">
              {locale === "vi"
                ? "Lịch trưởng thành của bạn"
                : "Your growth timeline"}
            </span>
            <span className="mt-0.5 block truncate text-[11.5px] text-muted-foreground">
              {locale === "vi"
                ? "Theo dõi milestone và kỹ năng đã được xác nhận"
                : "Track milestones and verified skills"}
            </span>
          </span>
          <span className="hidden rounded-full border border-border bg-card px-3 py-1.5 text-[11.5px] font-bold sm:block">
            {locale === "vi" ? "Xem lịch" : "View"}
          </span>
        </Link>

        <div className="mt-4 border-t border-border">{children}</div>
      </div>
    </>
  );
};

export default ProfilePageShell;
