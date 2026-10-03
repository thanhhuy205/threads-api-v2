"use client";

import AvatarGroup from "@/app/[locale]/(main)/_components/common/AvatarGroup";
import { Button } from "@/components/ui/button";
import { useGetUserByUsernameQuery } from "@/features/user/hooks";
import { cn } from "@/lib/utils";
import type { UserProfileResponse } from "@/types/user";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

type UserProfileTab = "threads" | "replies" | "quote";

type UserProfilePageShellProps = {
  username: string;
  activeTab: UserProfileTab;
  children: ReactNode;
  initialProfile?: UserProfileResponse | null;
};

const UserProfilePageShell = ({
  username,
  activeTab,
  children,
  initialProfile,
}: UserProfilePageShellProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const normalizedUsername = username.trim();
  const encodedUsername = encodeURIComponent(normalizedUsername);

  const {
    data: response,
    isLoading,
    isError,
  } = useGetUserByUsernameQuery({
    query: { username: normalizedUsername },
    enabled: Boolean(normalizedUsername),
    options: {
      initialData: initialProfile ?? undefined,
      refetchOnMount: false,
      staleTime: 30_000,
    },
  });

  const user = response?.data;

  if (isLoading && !response) return null;

  if (isError || !user) {
    return notFound();
  }

  const displayName = user.name ?? user.username;
  const basePath = `/${locale}/${encodedUsername}`;
  const tabs: Array<{ value: UserProfileTab; label: string; href: string }> = [
    { value: "threads", label: t("profile.thread"), href: basePath },
    {
      value: "replies",
      label: t("profile.threadReplies"),
      href: `${basePath}/replies`,
    },
    { value: "quote", label: t("common.reposts"), href: `${basePath}/quote` },
  ];

  return (
    <div className="mx-auto max-w-[680px]">
      <div className="rounded-3xl  bg-card px-5 py-5 md:p-8">
        <div className="space-y-5">
          <div className="grid grid-cols-[1fr_auto] items-start gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-[32px] leading-none font-bold tracking-tight">
                  {displayName}
                </h1>

                {user.verifiedAt && (
                  <span className="text-sm text-blue-500">✔</span>
                )}

              </div>

              <p className="mt-1 truncate text-[18px] text-muted-foreground">
                @{user.username}
              </p>
            </div>

            <AvatarGroup
              size={20}
              url={user.avatar ?? ""}
              fallBack={displayName.slice(0, 2).toUpperCase()}
              className="ring-1 ring-border/70"
              classNameFallback="bg-secondary text-xl font-semibold"
            />
          </div>

          <div className="space-y-3">
            {user.bio && (
              <p className="whitespace-pre-line text-[16px] leading-relaxed">
                {user.bio}
              </p>
            )}

            {(user.location || user.website) && (
              <div className="space-y-1 text-sm text-muted-foreground">
                {user.location && <p>{user.location}</p>}

                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all font-medium text-foreground hover:underline"
                  >
                    {user.website}
                  </a>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-sm">
                {user.postsCount} bài viết
              </span>
              {user.isPrivate && (
                <span className="rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-sm">
                  Tài khoản riêng tư
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="mt-5 border-b border-border/60">
        <div className="flex items-center">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={tab.href}
              className={cn(
                "flex-1 border-b py-2.5 text-center text-sm font-medium transition-all duration-150",
                activeTab === tab.value
                  ? "border-b-accent-foreground text-foreground"
                  : "border-b-transparent text-muted-foreground hover:text-foreground/90",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
};

export default UserProfilePageShell;
