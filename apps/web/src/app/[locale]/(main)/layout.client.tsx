"use client";

import { type ReactNode } from "react";
import { NotificationRealtimeListener } from "@/app/[locale]/(main)/_components/layout/realtime/NotificationRealtimeListener";

interface MainLayoutClientProps {
  children: ReactNode;
}

export default function MainLayoutClient({ children }: MainLayoutClientProps) {
  return (
    <>
      <NotificationRealtimeListener />
      {children}
    </>
  );
}
