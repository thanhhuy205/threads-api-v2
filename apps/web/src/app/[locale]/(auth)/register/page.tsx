import type { Metadata } from "next";
import RegisterPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account.",
};

export default function RegisterPage() {
  return <RegisterPageClient />;
}
