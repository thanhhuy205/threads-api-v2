import type { Metadata } from "next";
import { getNotificationsServer } from "@/features/notification/api/server";
import PrivateActivityPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Activity",
  description: "View your notifications and recent activity.",
};

export default async function PrivateActivityPage() {
  const initialResponse = await getNotificationsServer();

  return <PrivateActivityPageClient initialResponse={initialResponse} />;
}
