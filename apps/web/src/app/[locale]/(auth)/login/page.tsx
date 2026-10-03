import type { Metadata } from "next";
import LoginPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string }>;
}) {
  const params = await searchParams;
  return <LoginPageClient verified={params.verified === "1"} />;
}
