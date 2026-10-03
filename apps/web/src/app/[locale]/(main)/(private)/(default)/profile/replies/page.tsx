import type { Metadata } from "next";
import ProfileRouteClient from "@/app/[locale]/(main)/(private)/(default)/profile/_components/ProfileRouteClient";
import { verifySession } from "@/features/auth/server/session";
import { getMyRepliesServer } from "@/features/post/api/server";

export const metadata: Metadata = {
  title: "Profile · Replies",
  description: "Your replies to posts.",
};

export default async function PrivateProfileRepliesPage() {
  const [initialUser, initialPage] = await Promise.all([
    verifySession(),
    getMyRepliesServer(),
  ]);

  return (
    <ProfileRouteClient
      activeTab="replies"
      initialPage={initialPage}
      initialUser={initialUser}
    />
  );
}
