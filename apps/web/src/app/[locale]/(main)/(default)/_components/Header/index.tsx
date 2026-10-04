"use client";

import AvatarGroup from "@/app/[locale]/(main)/_components/common/AvatarGroup";
import { useTheme } from "@/components/layout/ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, useLogoutMutation } from "@/features/auth/hooks";
import {
  useGetNotificationUnreadQuery,
  useMarkNotificationReadMutation,
} from "@/features/notification/hooks";
import {
  Activity,
  Bell,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  UserRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const Header = () => {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const { isAuthenticated, user } = useAuth();
  const { mutateAsync: logout } = useLogoutMutation();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  const { data: unreadData } = useGetNotificationUnreadQuery({
    options: { enabled: isAuthenticated },
  });
  const { mutateAsync: markReads } = useMarkNotificationReadMutation();
  const hasUnread = Boolean(unreadData?.data?.isNotification);

  if (!mounted) {
    return (
      <div className="hidden h-[50px] shrink-0 border-b border-border bg-card md:block" />
    );
  }

  const profileFallback = (user?.username ?? "U").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 hidden h-[50px] shrink-0 items-center gap-5 border-b border-border bg-card px-5 md:flex">
      <button
        type="button"
        onClick={() => router.push(`/${locale}`)}
        className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-75"
        aria-label="PulseBoard"
      >
        <span className="flex size-[26px] items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Activity className="size-[15px]" strokeWidth={2.4} />
        </span>
        <span className="hidden text-[16.5px] font-bold tracking-[-0.01em] lg:block">
          PulseBoard
        </span>
      </button>

      <button
        type="button"
        onClick={() => router.push(`/${locale}/search`)}
        className="flex h-[34px] min-w-0 max-w-[520px] flex-1 items-center gap-2 rounded-full bg-input px-3.5 text-muted-foreground transition-colors hover:text-foreground"
        aria-label={t("nav.search")}
      >
        <Search className="size-[15px] shrink-0" />
        <span className="hidden truncate text-left text-[13.5px] lg:block">
          {locale === "vi"
            ? "Tìm kiếm bài viết, chủ đề, hoặc thành viên…"
            : "Search posts, topics, or members…"}
        </span>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-2.5">
        <div
          className="flex items-center rounded-full border border-border bg-input p-0.5"
          aria-label={locale === "vi" ? "Giao diện" : "Appearance"}
        >
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex size-7 items-center justify-center rounded-full transition-colors ${
              theme === "light"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Light"
            aria-pressed={theme === "light"}
          >
            <Sun className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex size-7 items-center justify-center rounded-full transition-colors ${
              theme === "dark"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Dark"
            aria-pressed={theme === "dark"}
          >
            <Moon className="size-3.5" />
          </button>
        </div>

        {isAuthenticated ? (
          <button
            type="button"
            onClick={() => {
              if (hasUnread) markReads().catch(() => {});
              router.push(`/${locale}/activity`);
            }}
            className="relative flex size-[34px] items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-accent"
            aria-label={t("nav.activity")}
          >
            <Bell className="size-4" />
            {hasUnread ? (
              <span className="absolute -right-1 -top-1 flex min-w-[15px] items-center justify-center rounded-full border-2 border-card bg-destructive px-0.5 text-[9px] font-bold leading-[13px] text-destructive-foreground">
                1
              </span>
            ) : null}
          </button>
        ) : null}

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex size-8 items-center justify-center overflow-hidden rounded-full border border-border bg-accent outline-none ring-2 ring-card ring-offset-1 ring-offset-primary transition-opacity hover:opacity-80"
                aria-label={locale === "vi" ? "Mở menu cá nhân" : "Open profile menu"}
              >
                <AvatarGroup
                  className="h-full w-full"
                  size={8}
                  url={user.avatar ?? ""}
                  fallBack={profileFallback}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={9}
              className="w-72 rounded-2xl p-2 shadow-xl"
            >
              <div className="flex flex-col items-center px-4 pb-5 pt-4 text-center">
                <div className="size-16 overflow-hidden rounded-full ring-1 ring-border">
                  <AvatarGroup
                    className="h-full w-full"
                    size={16}
                    url={user.avatar ?? ""}
                    fallBack={profileFallback}
                  />
                </div>
                <p className="mt-3 text-sm font-semibold">
                  {user.name ?? user.username}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  @{user.username}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => router.push(`/${locale}/profile`)}
              >
                <UserRound />
                {t("nav.profile")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => router.push(`/${locale}/settings/privacy`)}
              >
                <Settings />
                {t("nav.settings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => {
                  logout()
                    .then(() => router.replace(`/${locale}`))
                    .catch(() => {});
                }}
              >
                <LogOut />
                {t("nav.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
