import type { Metadata } from "next";
import AppShell from "../(default)/layout.client";
import MembersPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Members | PulseBoard",
  description: "Manage the people in your workspace.",
};

export default function TeamsPage() {
  return (
    <AppShell>
      <MembersPageClient />
    </AppShell>
  );
}
