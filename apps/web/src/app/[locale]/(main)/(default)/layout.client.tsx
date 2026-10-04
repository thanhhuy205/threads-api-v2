"use client";

import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { CSSProperties, ReactNode } from "react";
import { AppSidebar } from "./_components/app-sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider
      style={{ "--header-height": "3.5rem" } as CSSProperties}
    >
      <AppSidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <SiteHeader />
        {children}
      </main>
    </SidebarProvider>
  );
}
