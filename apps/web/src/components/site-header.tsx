"use client";

import AvatarGroup from "@/app/[locale]/(main)/_components/common/AvatarGroup";
import Logo from "@/app/[locale]/(main)/_components/common/Logo";
import { ActivitySheet } from "@/components/activity-sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth, useLogoutMutation } from "@/features/auth/hooks";
import {
  useGetNotificationUnreadQuery,
  useMarkNotificationReadMutation,
} from "@/features/notification/hooks";
import { Bell, LogOut, MessageCircle, Settings, UserRound } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const topNavigation = [
  { label: "Home", path: "/" },
  { label: "Community", path: "/growth" },
  { label: "Discover", path: "/search" },
];

export function SiteHeader() {
  const { user, isAuthenticated } = useAuth();
  const { mutateAsync: logout } = useLogoutMutation();
  const { data: unreadData } = useGetNotificationUnreadQuery({
    options: { enabled: isAuthenticated },
  });
  const { mutateAsync: markReads } = useMarkNotificationReadMutation();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const hasUnread = Boolean(unreadData?.data?.isNotification);
  const localizedPath = (path: string) =>
    path === "/" ? `/${locale}` : `/${locale}${path}`;

  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) shrink-0 items-center border-b border-[#f3f4f6] bg-white px-4 md:px-6">
      <div className="flex w-full items-center">
        <SidebarTrigger className="-ml-2 mr-2 md:hidden" />
        <button
          type="button"
          onClick={() => router.push(`/${locale}`)}
          className="flex items-center gap-2 md:hidden"
          aria-label="PulseBoard"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#0d121c] text-white">
            <Logo className="size-[18px]" />
          </span>
          <span className="font-bold tracking-[-0.02em]">PulseBoard</span>
        </button>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {topNavigation.map((item) => {
            const href = localizedPath(item.path);
            const active =
              item.path === "/"
                ? pathname === href
                : pathname.startsWith(href);

            return (
              <Button
                key={item.label}
                variant="ghost"
                size="sm"
                onClick={() => router.push(href)}
                className={`rounded-full px-4 text-sm font-normal text-[#4d5761] hover:bg-[#f9fafb] hover:text-[#0d121c] ${
                  active ? "bg-[#f9fafb] font-semibold text-[#0d121c]" : ""
                }`}
              >
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ActivitySheet
            onOpenChange={(open) => {
              if (open && hasUnread) markReads().catch(() => {});
            }}
            trigger={
              <Button
                variant="ghost"
                size="icon-sm"
                className="relative rounded-full text-[#1f2a37] hover:bg-[#f9fafb]"
                aria-label="Notifications"
              >
                <Bell className="size-5" />
                {hasUnread ? (
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-white bg-[#e0245e]" />
                ) : null}
              </Button>
            }
          />
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full text-[#1f2a37] hover:bg-[#f9fafb]"
            aria-label="Messages"
          >
            <MessageCircle className="size-5" />
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="ml-1 size-9 overflow-hidden rounded-full border border-[#f3f4f6] bg-[#f9fafb] outline-none ring-[#1a84a3]/20 focus-visible:ring-4"
                  aria-label="Open profile menu"
                >
                  <AvatarGroup
                    className="size-full"
                    size={9}
                    url={user.avatar ?? ""}
                    fallBack={(user.username ?? "U").slice(0, 2).toUpperCase()}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="w-64 rounded-xl p-2"
              >
                <div className="px-2 py-2">
                  <p className="truncate text-sm font-semibold text-[#0d121c]">
                    {user.name ?? user.username}
                  </p>
                  <p className="truncate text-xs text-[#6c737f]">
                    @{user.username}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => router.push(`/${locale}/profile`)}
                >
                  <UserRound /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => router.push(`/${locale}/settings/privacy`)}
                >
                  <Settings /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() =>
                    logout()
                      .then(() => router.replace(`/${locale}`))
                      .catch(() => {})
                  }
                >
                  <LogOut /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </header>
  );
}
