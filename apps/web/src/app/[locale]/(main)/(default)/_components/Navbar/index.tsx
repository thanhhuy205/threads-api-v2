"use client";

import AvatarGroup from "@/app/[locale]/(main)/_components/common/AvatarGroup";
import HomeIcon from "@/app/[locale]/(main)/_components/common/Icon/HomeIcon";
import NewPostModal from "@/app/[locale]/(main)/_components/post/NewPostModal";
import { useCurrentUser } from "@/features/auth/hooks";
import {
  useGetNotificationUnreadQuery,
  useMarkNotificationReadMutation,
} from "@/features/notification/hooks";
import { useModal } from "@/hooks/use-modal";
import {
  Bell,
  Bookmark,
  Building2,
  ChevronDown,
  ClipboardCheck,
  Ellipsis,
  Lightbulb,
  Plus,
  Search,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import NavItem from "./NavItem";
import SlideUpMenu from "./SlideUpMenu";

type NavConfigItem = {
  key: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  link: string;
  labelKey: string;
  group: "main" | "core" | "personal";
};

const NAV_CONFIG: NavConfigItem[] = [
  {
    key: "home",
    Icon: HomeIcon,
    link: "/",
    labelKey: "nav.home",
    group: "main",
  },
  {
    key: "search",
    Icon: Search,
    link: "/search",
    labelKey: "nav.search",
    group: "main",
  },
  {
    key: "decisions",
    Icon: ClipboardCheck,
    link: "/decisions",
    labelKey: "nav.decisions",
    group: "core",
  },
  {
    key: "experts",
    Icon: Lightbulb,
    link: "/experts",
    labelKey: "nav.experts",
    group: "core",
  },
  {
    key: "growth",
    Icon: TrendingUp,
    link: "/growth",
    labelKey: "nav.growth",
    group: "core",
  },
  {
    key: "activity",
    Icon: Bell,
    link: "/activity",
    labelKey: "nav.activity",
    group: "core",
  },
  {
    key: "profile",
    Icon: UserRound,
    link: "/profile",
    labelKey: "nav.profile",
    group: "personal",
  },
  {
    key: "saved",
    Icon: Bookmark,
    link: "/saved",
    labelKey: "nav.saved",
    group: "personal",
  },
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const currentUser = useCurrentUser();
  const router = useRouter();
  const t = useTranslations();
  const modal = useModal();
  const { data: unreadNotificationData } = useGetNotificationUnreadQuery({
    options: { enabled: Boolean(currentUser) },
  });

  const { mutateAsync: markReads } = useMarkNotificationReadMutation();
  const hasUnreadNotification = Boolean(
    unreadNotificationData?.data?.isNotification,
  );

  const localizedPathname =
    pathname.startsWith(`/${locale}`) && pathname.length > locale.length + 1
      ? pathname.slice(locale.length + 1)
      : pathname === `/${locale}`
        ? "/"
        : pathname;

  const localizeRoute = (path: string) =>
    path === "/" ? `/${locale}` : `/${locale}${path}`;

  const activeNav = useMemo(() => {
    const exact = NAV_CONFIG.find((item) => item.link === localizedPathname);
    if (exact) return exact.key;

    const nested = NAV_CONFIG.find(
      (item) =>
        item.link &&
        item.link !== "/" &&
        localizedPathname.startsWith(`${item.link}/`),
    );
    return nested?.key || "home";
  }, [localizedPathname]);

  const handleNavClick = (item: (typeof NAV_CONFIG)[number]) => {
    if (item?.link) {
      if (
        item.key === "home" &&
        (localizedPathname === "/" || localizedPathname === "")
      ) {
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      } else {
        router.push(localizeRoute(item.link));
      }
      if (item.key === "activity" && hasUnreadNotification) {
        markReads().catch(() => {});
      }
    }
  };

  const handleWriteClick = () => {
    modal.show(<NewPostModal onClose={() => modal.hide()} />);
  };

  const navLabels: Record<string, string> = {
    home: t("nav.home"),
    search: t("nav.search"),
    activity: t("nav.activity"),
    decisions: t("nav.decisions"),
    experts: t("nav.experts"),
    growth: t("nav.growth"),
    profile: t("nav.profile"),
    saved: t("nav.saved"),
  };

  const renderNavGroup = (group: NavConfigItem["group"]) =>
    NAV_CONFIG.filter((item) => item.group === group).map((item) => (
      <NavItem
        key={item.key}
        icon={
          <span className="relative inline-flex">
            <item.Icon size={18} strokeWidth={2} />
            {item.key === "activity" && hasUnreadNotification ? (
              <span className="absolute -right-1 -top-1 size-2 rounded-full bg-destructive lg:hidden" />
            ) : null}
          </span>
        }
        label={navLabels[item.key]}
        badge={
          item.key === "activity" && hasUnreadNotification ? 1 : undefined
        }
        active={activeNav === item.key}
        onClick={() => handleNavClick(item)}
      />
    ));

  return (
    <nav className="sticky top-0 z-20 flex h-full w-full flex-col border-r border-border bg-sidebar px-2 py-4 text-sidebar-foreground lg:px-3">
      {/* Workspace switch from the design reference. */}
      <button
        type="button"
        className="mb-[18px] flex h-11 w-11 items-center justify-center rounded-lg border border-sidebar-border bg-card text-card-foreground transition-colors hover:bg-accent lg:h-auto lg:w-full lg:gap-2.5 lg:px-2.5 lg:py-2 lg:text-left"
        aria-label={t("nav.workspace")}
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Building2 className="size-3.5" />
        </span>
        <span className="hidden min-w-0 flex-1 leading-tight lg:block">
          <span className="block truncate text-[12.5px] font-semibold">
            {t("nav.workspace")}
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
            {t("nav.workspaceSubtitle")}
          </span>
        </span>
        <ChevronDown className="hidden size-3.5 shrink-0 text-muted-foreground lg:block" />
      </button>

      <NavItem
        icon={<Plus size={18} strokeWidth={2.2} />}
        label={t("nav.newThread")}
        onClick={handleWriteClick}
        className="mb-1 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground hover:opacity-90"
      />

      <div className="flex w-full flex-1 flex-col gap-0.5">
        {renderNavGroup("main")}

        <p className="hidden px-2.5 pb-1.5 pt-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground lg:block">
          {t("nav.coreFeatures")}
        </p>
        {renderNavGroup("core")}

        <p className="hidden px-2.5 pb-1.5 pt-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground lg:block">
          {t("nav.mine")}
        </p>
        {renderNavGroup("personal")}
      </div>

      <div className="border-t border-sidebar-border pt-2.5">
        <SlideUpMenu
          customPopup="translate-x-3"
          triggerClassName="h-auto w-full justify-start rounded-lg border border-sidebar-border bg-card p-2 text-card-foreground hover:bg-accent"
          motionProps={{
            initial: { opacity: 0, x: 0, scale: 0.96 },
            animate: { opacity: 1, x: 0, scale: 1 },
          }}
        >
          <span className="flex w-full min-w-0 items-center justify-center gap-2.5 lg:justify-start">
            {currentUser ? (
              <span className="size-8 shrink-0 overflow-hidden rounded-full border border-border">
                <AvatarGroup
                  className="h-full w-full"
                  size={8}
                  url={currentUser.avatar ?? ""}
                  fallBack={(currentUser.username ?? "U")
                    .slice(0, 2)
                    .toUpperCase()}
                />
              </span>
            ) : (
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-accent">
                <UserRound className="size-4" />
              </span>
            )}
            <span className="hidden min-w-0 flex-1 text-left leading-tight lg:block">
              <span className="block truncate text-[13px] font-semibold">
                {currentUser?.name ?? currentUser?.username ?? t("nav.more")}
              </span>
              <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                {currentUser ? `@${currentUser.username}` : "PulseBoard"}
              </span>
            </span>
            <Ellipsis className="hidden size-4 shrink-0 text-muted-foreground lg:block" />
          </span>
        </SlideUpMenu>
      </div>
    </nav>
  );
};

export default Navbar;
