import type { Metadata } from "next";
import RestPasswordFound from "@/app/[locale]/(auth)/_components/RestPasswordFailed";
import { validateResetPasswordToken } from "@/features/auth/server/reset-password";
import { redirect } from "next/navigation";
import ResetPasswordPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your account.",
};

export default async function ResetPasswordPage({
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
    redirect(`/${locale}/forgot-password`);
  }

  const isTokenValid = await validateResetPasswordToken(token);

  if (!isTokenValid) {
    return <RestPasswordFound />;
  }

  return <ResetPasswordPageClient token={token} />;
}
