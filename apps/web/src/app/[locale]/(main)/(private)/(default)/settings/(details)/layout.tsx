"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import type { ReactNode } from "react";
import SidebarSettings from "./_components/SidebarSettings";

export default function PrivateSettingsDetailsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-full min-h-screen">
      {!isMobile && <SidebarSettings />}
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
