import { verifySession } from "@/features/auth/server/session";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function PrivateLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await verifySession();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return <>{children}</>;
}
