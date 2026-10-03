import type { Metadata } from "next";
import ProfileRouteClient from "@/app/[locale]/(main)/(private)/(default)/profile/_components/ProfileRouteClient";
import { verifySession } from "@/features/auth/server/session";
import { getMyQuotesServer } from "@/features/post/api/server";

export const metadata: Metadata = {
  title: "Profile · Reposts",
  description: "Posts you have reposted.",
};

export default async function PrivateProfileRepostPage() {
  const [initialUser, initialPage] = await Promise.all([
    verifySession(),
    getMyQuotesServer(),
  ]);

  return (
    <ProfileRouteClient
      activeTab="repost"
      initialPage={initialPage}
      initialUser={initialUser}
    />
  );
}
