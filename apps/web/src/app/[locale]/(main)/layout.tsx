import AuthProvider from "@/features/auth/components/AuthProvider";
import { verifySession } from "@/features/auth/server/session";
import type { ReactNode } from "react";
import MainLayoutClient from "./layout.client";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await verifySession();

  return (
    <AuthProvider initialUser={user}>
      <MainLayoutClient>{children}</MainLayoutClient>
    </AuthProvider>
  );
}
