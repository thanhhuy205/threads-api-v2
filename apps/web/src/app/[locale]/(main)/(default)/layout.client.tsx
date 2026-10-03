"use client";

import { Loading } from "@/app/[locale]/(main)/_components/common/Loading";
import { useAuth } from "@/features/auth";
import { Suspense, type ReactNode } from "react";
import Content from "./_components/Content";
import Navbar from "./_components/Navbar";
import NavMobile from "./_components/NavMobile";
import Header from "./_components/Header";
import RightSidebar from "./_components/RightSidebar";

interface DefaultRoutesLayoutClientProps {
  children: ReactNode;
}

export default function DefaultRoutesLayoutClient({
  children,
}: DefaultRoutesLayoutClientProps) {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<Loading />}>
      <div className="main-container flex min-h-screen flex-col bg-background md:h-dvh md:min-h-0 md:overflow-hidden">
        <Header />

        {/* Mobile nav — bottom bar */}
        <div className="block md:hidden">
          <NavMobile />
        </div>

        <div className="flex min-h-0 flex-1">
          {/* The reference collapses the 320px sidebar to icons on tablet. */}
          <div className="hidden w-[60px] shrink-0 flex-col md:flex lg:w-[320px]">
            <Navbar />
          </div>

          <div
            data-main-scroll-container
            className="flex min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain bg-background"
          >
            <div className="flex-1 min-w-0 max-w-full w-full">
              <Content isAuthenticated={isAuthenticated}>{children}</Content>
            </div>
            <RightSidebar />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
