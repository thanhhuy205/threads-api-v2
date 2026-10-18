import { KeycloakProvider } from "@/components/layout/KeycloakProvider";
import type { ReactNode } from "react";
import MainLayoutClient from "./layout.client";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <KeycloakProvider>
      <MainLayoutClient>{children}</MainLayoutClient>
    </KeycloakProvider>
  );
}
