"use client";

import AccountPrivacyIcon from "@/app/[locale]/(main)/_components/common/Icon/AccountPrivacyIcon";
import HelpPrivacyIcon from "@/app/[locale]/(main)/_components/common/Icon/HelpPrivacyIcon";
import PrivacyIcon from "@/app/[locale]/(main)/_components/common/Icon/PrivacyIcon";
import UserPrivacyIcon from "@/app/[locale]/(main)/_components/common/Icon/UserPrivacyIcon";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const items = [
  { title: "Quyền riêng tư", url: "/settings/privacy", icon: PrivacyIcon },
  { title: "Trạng thái tài khoản", url: "/settings/account_status", icon: UserPrivacyIcon },
  { title: "Tài khoản", url: "/settings/account", icon: AccountPrivacyIcon },
  { title: "Trợ giúp", url: "/settings/help", icon: HelpPrivacyIcon },
];

const SidebarSettings = () => {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="w-56 shrink-0 pt-4 px-2 border-r border-border/40">
      <nav className="flex flex-col gap-0.5">
        {items.map((item) => {
          const isActive = pathname.includes(item.url);
          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-[15px]",
                isActive
                  ? "bg-muted text-foreground font-medium"
                  : "text-foreground hover:bg-muted/60",
              )}
            >
              <item.icon size={20} className="shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarSettings;
