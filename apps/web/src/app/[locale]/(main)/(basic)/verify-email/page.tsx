import type { Metadata } from "next";
import { verifyEmailToken } from "@/features/auth/server/verify-email";
import { redirect } from "next/navigation";
import VerifyEmailPageClient from "./page.client";
import { toast } from "sonner";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to activate your account.",
};

export default async function VerifyEmailPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ token?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const query = await searchParams;
  const { locale } = await params;
  const token = query.token?.trim() ?? "";

  if (!token) {
    redirect(`/${locale}/login`);
  }

  const isVerified = await verifyEmailToken(token);

  if (isVerified) {
    redirect(`/${locale}/?verified=1`);
  } else {
    redirect(`/${locale}/?error=verify-failed`);
  }

  return <VerifyEmailPageClient />;
}
