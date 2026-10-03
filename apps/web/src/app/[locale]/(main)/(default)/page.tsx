import SeededFeedPageClient from "@/app/[locale]/(main)/_components/post/SeededFeedPageClient";
import { getFeedsServer } from "@/features/post/api/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "See the latest posts from people you follow.",
};

export default async function RootHomePage() {
  const initialResponse = await getFeedsServer();

  return (
    <SeededFeedPageClient emptyState="home" initialResponse={initialResponse} />
  );
}
