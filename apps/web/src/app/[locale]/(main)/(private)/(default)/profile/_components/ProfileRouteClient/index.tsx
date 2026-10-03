"use client";

import ProfilePageShell from "@/app/[locale]/(main)/(private)/(default)/profile/_components/ProfilePageShell";
import ProfileReplies from "@/app/[locale]/(main)/(private)/(default)/profile/_components/ProfileReplies";
import ProfileReposts from "@/app/[locale]/(main)/(private)/(default)/profile/_components/ProfileReposts";
import ProfileThreads from "@/app/[locale]/(main)/(private)/(default)/profile/_components/ProfileThreads";
import type { PostResponse } from "@/types/post";
import type { User } from "@/types/user";

type ProfileTab = "threads" | "replies" | "repost";

type ProfileRouteClientProps = {
  activeTab: ProfileTab;
  initialPage?: PostResponse | null;
  initialUser?: User | null;
};

export default function ProfileRouteClient({
  activeTab,
  initialPage,
  initialUser,
}: ProfileRouteClientProps) {
  return (
    <ProfilePageShell activeTab={activeTab} initialUser={initialUser}>
      {activeTab === "threads" ? (
        <ProfileThreads initialPage={initialPage} initialUser={initialUser} />
      ) : null}
      {activeTab === "replies" ? (
        <ProfileReplies initialPage={initialPage} initialUser={initialUser} />
      ) : null}
      {activeTab === "repost" ? (
        <ProfileReposts initialPage={initialPage} initialUser={initialUser} />
      ) : null}
    </ProfilePageShell>
  );
}
