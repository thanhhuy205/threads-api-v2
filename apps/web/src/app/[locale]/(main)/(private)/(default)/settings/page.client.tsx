"use client";

import AccountPrivacyIcon from "@/app/[locale]/(main)/_components/common/Icon/AccountPrivacyIcon";
import HelpPrivacyIcon from "@/app/[locale]/(main)/_components/common/Icon/HelpPrivacyIcon";
import PrivacyIcon from "@/app/[locale]/(main)/_components/common/Icon/PrivacyIcon";
import UserPrivacyIcon from "@/app/[locale]/(main)/_components/common/Icon/UserPrivacyIcon";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

const items = [
  {
    title: "Quyền riêng tư",
    url: "/settings/privacy",
    icon: PrivacyIcon,
  },
  {
    title: "Trạng thái tài khoản",
    url: "/settings/account_status",
    icon: UserPrivacyIcon,
  },

  {
    title: "Tài khoản",
    url: "/settings/account",
    icon: AccountPrivacyIcon,
  },
  {
    title: "Trợ giúp",
    url: "/settings/help",
    icon: HelpPrivacyIcon,
  },
];

export default function PrivateSettingsPageClient() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <SidebarProvider>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-4 ">
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className="hover:!bg-transparent"
                  render={
                    <Link
                      className="w-full flex items-center justify-between "
                      href={item.url}
                    />
                  }
                >
                  <div className="flex items-center gap-5">
                    <item.icon size={25} className="text-foreground" />
                    <span className="text-[16px]">{item.title}</span>
                  </div>
                  <span>
                    <ChevronRight size={20} className="text-[#ccc]" />
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarProvider>
  );
}
