"use client";

import FavoriteIcon from "@/app/[locale]/(main)/_components/common/Icon/FavoriteIcon";
import HomeIcon from "@/app/[locale]/(main)/_components/common/Icon/HomeIcon";
import SubtractIcon from "@/app/[locale]/(main)/_components/common/Icon/SubtractIcon";
import UserIcon from "@/app/[locale]/(main)/_components/common/Icon/UserIcon";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks";
import {
  useGetNotificationUnreadQuery,
  useMarkNotificationReadMutation,
} from "@/features/notification/hooks";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import Footer from "@/app/[locale]/(main)/_components/common/ModalPopup/Footer";
import Header from "@/app/[locale]/(main)/_components/common/ModalPopup/Header";
import UserPostForm from "@/app/[locale]/(main)/_components/user/UserPostForm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCreatePost } from "@/hooks/use-create-post";
import { useLocale, useTranslations } from "next-intl";

const navItems = [
  { key: "home", icon: <HomeIcon size={26} />, link: "/" },
  { key: "search", icon: <SearchIcon size={26} />, link: "/search" },
  { key: "write", icon: <SubtractIcon size={20} /> },
  {
    key: "activity",
    icon: <FavoriteIcon size={26} />,
    link: "/activity",
  },
  {
    key: "profile",
    icon: <UserIcon size={26} />,
    link: "/profile",
  },
];

const NavMobile: React.FC = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const [openSheet, setOpenSheet] = useState(false);

  const router = useRouter();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { data: unreadNotificationData } = useGetNotificationUnreadQuery({
    options: { enabled: Boolean(user) },
  });
  const { mutateAsync: markAsRead } = useMarkNotificationReadMutation();
  const hasUnreadNotification = Boolean(
    unreadNotificationData?.data?.isNotification,
  );

  const {
    content,
    setContent,
    setTopic,
    setMentions,
    loadingPosts,
    setPreviewImage,
    setPostType,
    visibility,
    setVisibility,
    replyPermission,
    setReplyPermission,
    handlePost,
    setScheduledDate,
    setScheduledTimeFrom,
    setScheduledTimeTo,
  } = useCreatePost(() => setOpenSheet(false));
  const t = useTranslations();
  const localizedPathname =
    pathname.startsWith(`/${locale}`) && pathname.length > locale.length + 1
      ? pathname.slice(locale.length + 1)
      : pathname === `/${locale}`
        ? "/"
        : pathname;

  const localizeRoute = (path: string) =>
    path === "/" ? `/${locale}` : `/${locale}${path}`;

  const activeNav = (() => {
    const exact = navItems.find((item) => item.link === localizedPathname);
    if (exact) return exact.key;

    const nested = navItems.find(
      (item) =>
        item.link &&
        item.link !== "/" &&
        localizedPathname.startsWith(`${item.link}/`),
    );

    return nested?.key ?? "home";
  })();

  if (!isMobile) return null;

  const handleNavClick = (item: (typeof navItems)[0]) => {
    if (item.key === "activity" && hasUnreadNotification) {
      markAsRead().catch(() => {});
    }

    if (item.link) {
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
    }
  };

  const handleWriteClick = () => {
    setOpenSheet(true);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex justify-around items-center py-2">
        {navItems.map((item) => (
          <Button
            key={item.key}
            variant="ghost"
            size="icon"
            className={`rounded-full transition ${
              activeNav === item.key
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={
              item.key === "write"
                ? handleWriteClick
                : () => handleNavClick(item)
            }>
            <span className="relative inline-flex">
              {item.icon}
              {item.key === "activity" && hasUnreadNotification ? (
                <span className="absolute -right-1 -top-1 size-2 rounded-full bg-red-500" />
              ) : null}
            </span>
          </Button>
        ))}
      </nav>

      <Sheet modal={false} open={openSheet}>
        <SheetTitle className="sr-only">Nav Mobile</SheetTitle>
        <SheetContent
          aria-describedby={undefined}
          side="bottom"
          className="h-[100vh]">
          <SheetHeader className="p-0">
            <Header
              className="p-10"
              headerText={t("post.newThread")}
              onClose={() => setOpenSheet(false)}
              visibility={visibility}
              onVisibilityChange={setVisibility}
            />
          </SheetHeader>

          {user ? (
            <UserPostForm
              user={user}
              setContent={setContent}
              setTopic={setTopic}
              setMentions={setMentions}
              setPreviewImage={setPreviewImage}
              setPostType={setPostType}
              setScheduledDate={setScheduledDate}
              setScheduledTimeFrom={setScheduledTimeFrom}
              setScheduledTimeTo={setScheduledTimeTo}
              t={t}
            />
          ) : null}

          <Footer
            content={content}
            loading={loadingPosts}
            onSubmit={handlePost}
            replyPermission={replyPermission}
            onReplyPermissionChange={setReplyPermission}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default NavMobile;
