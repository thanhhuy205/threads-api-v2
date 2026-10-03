"use client";

import { Loading } from "@/app/[locale]/(main)/_components/common/Loading";
import { Suspense, type ReactNode } from "react";
import Navbar from "../(default)/_components/Navbar";
import NavMobile from "../(default)/_components/NavMobile";

export default function BasicRoutesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <div className="bg-background main-container min-h-screen">
        <div className="hidden md:block">
          <Navbar />
        </div>

        <div className="block md:hidden">
          <NavMobile />
        </div>

        {/* Main content area with left padding for navbar, no Content wrapper */}
        <main className="w-full min-h-screen text-foreground md:pl-19 lg:pl-68">
          {children}
        </main>
      </div>
    </Suspense>
  );
}
