import AuthProvider from "@/features/auth/components/AuthProvider";
import { verifySession } from "@/features/auth/server/session";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import MainLayoutClient from "./layout.client";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await verifySession();

  if (!user) {
    redirect("/login");
  }
  return (
    <AuthProvider initialUser={user}>
      <MainLayoutClient>{children}</MainLayoutClient>
    </AuthProvider>
  );
}
