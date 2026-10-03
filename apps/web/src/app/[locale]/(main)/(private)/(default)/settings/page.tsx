import type { Metadata } from "next";
import PrivateSettingsPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences.",
};

export default function PrivateSettingsPage() {
  return <PrivateSettingsPageClient />;
}
