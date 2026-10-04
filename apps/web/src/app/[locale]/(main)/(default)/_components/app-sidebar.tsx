"use client";

import Logo from "@/app/[locale]/(main)/_components/common/Logo";
import { ActivitySheet } from "@/components/activity-sheet";
import { TeamSidebarSection } from "@/components/team-sidebar-section";
import {
  WorkspaceSwitcher,
  type Workspace,
} from "@/components/workspace-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Activity,
  ChartNoAxesCombined,
  CircleHelp,
  Home,
  Search,
  Settings,
  UserRound,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import * as React from "react";

const workspaces: Workspace[] = [
  {
    id: "pulseboard",
    name: "PulseBoard",
    plan: "Company workspace",
    color: "#0d121c",
  },
  {
    id: "product",
    name: "Product Guild",
    plan: "Team workspace",
    color: "#6369ec",
  },
  {
    id: "marketing",
    name: "Marketing Hub",
    plan: "Team workspace",
    color: "#1a84a3",
  },
];

const navGroups = [
  {
    label: "General",
    items: [
      { title: "Feed", path: "/", icon: Home },
      { title: "Search", path: "/search", icon: Search },
      { title: "Activity", path: "/activity", icon: Activity },
    ],
  },
  {
    label: "Workspace",
    items: [
      { title: "Growth", path: "/growth", icon: ChartNoAxesCombined },
      { title: "Members", path: "/teams", icon: UsersRound },
    ],
  },
  {
    label: "Personal",
    items: [
      { title: "Profile", path: "/profile", icon: UserRound },
      { title: "Settings", path: "/settings/privacy", icon: Settings },
      { title: "Help", path: "/feedback", icon: CircleHelp },
    ],
  },
];

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const locale = useLocale();
  const pathname = usePathname();
  const localizedPath = (path: string) =>
    path === "/" ? `/${locale}` : `/${locale}${path}`;

  const isActive = (path: string) => {
    const target = localizedPath(path);
    return path === "/" ? pathname === target : pathname.startsWith(target);
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-[#f3f4f6]"
      {...props}
    >
      <SidebarHeader className="h-[68px] justify-center border-b border-[#f3f4f6] px-5 py-0">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2.5 text-[#0d121c]"
          aria-label="PulseBoard"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#0d121c] text-white">
            <Logo className="size-[19px]" />
          </span>
          <span className="text-[17px] font-bold tracking-[-0.025em]">
            PulseBoard
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="gap-0 bg-white px-3 py-4">
        <div className="px-1 pb-4">
          <WorkspaceSwitcher workspaces={workspaces} />
        </div>
        <SidebarSeparator className="mx-1 mb-2 bg-[#f3f4f6]" />
        {navGroups.map((group, groupIndex) => (
          <React.Fragment key={group.label}>
            <SidebarGroup className="px-1 py-2">
              <SidebarGroupLabel className="h-7 px-2 text-[12px] font-medium text-[#0d121c]">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {group.items.map((item) => (
                    <SidebarMenuItem key={`${group.label}-${item.title}`}>
                      {item.title === "Activity" ? (
                        <ActivitySheet
                          trigger={
                            <SidebarMenuButton className="h-10 rounded-lg px-3 text-[14px] text-[#1f2a37] hover:bg-[#f9fafb] hover:text-[#0d121c] data-open:bg-[#0d121c] data-open:font-medium data-open:text-white">
                              <item.icon className="size-4" />
                              <span>{item.title}</span>
                            </SidebarMenuButton>
                          }
                        />
                      ) : (
                        <SidebarMenuButton
                          isActive={isActive(item.path)}
                          render={<Link href={localizedPath(item.path)} />}
                          className="h-10 rounded-lg px-3 text-[14px] text-[#1f2a37] hover:bg-[#f9fafb] hover:text-[#0d121c] data-active:bg-[#0d121c] data-active:font-medium data-active:text-white"
                        >
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
              {groupIndex < navGroups.length - 1 ? (
                <SidebarSeparator className="mx-1 mt-4 bg-[#f3f4f6]" />
              ) : null}
            </SidebarGroup>
            {group.label === "Workspace" ? <TeamSidebarSection /> : null}
          </React.Fragment>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
