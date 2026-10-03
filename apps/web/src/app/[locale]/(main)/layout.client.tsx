"use client";

import { type ReactNode } from "react";
import { NotificationRealtimeListener } from "@/app/[locale]/(main)/_components/layout/realtime/NotificationRealtimeListener";
import { VerifyEmailToastHandler } from "@/app/[locale]/(main)/_components/layout/auth/VerifyEmailToastHandler";

interface MainLayoutClientProps {
  children: ReactNode;
}

export default function MainLayoutClient({ children }: MainLayoutClientProps) {
  return (
    <>
      <NotificationRealtimeListener />
      <VerifyEmailToastHandler />
      {children}
    </>
  );
}
