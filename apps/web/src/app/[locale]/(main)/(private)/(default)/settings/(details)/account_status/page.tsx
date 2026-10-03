import type { Metadata } from "next";
import AccountStatusClient from "./page.client";

export const metadata: Metadata = {
  title: "Settings · Account Status",
  description: "View and manage your account status.",
};

export default function AccountStatus() {
  return <AccountStatusClient />;
}
