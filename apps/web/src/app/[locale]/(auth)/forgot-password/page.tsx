import type { Metadata } from "next";
import ForgotPasswordPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />;
}
