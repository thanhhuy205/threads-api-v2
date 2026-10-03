import UserProfilePageShell from "@/app/[locale]/(main)/(default)/[username]/_components/UserProfilePageShell";
import UserProfilePosts from "@/app/[locale]/(main)/(default)/[username]/_components/UserProfilePosts";
import UserProfileQuotes from "@/app/[locale]/(main)/(default)/[username]/_components/UserProfileQuotes";
import UserProfileReplies from "@/app/[locale]/(main)/(default)/[username]/_components/UserProfileReplies";
import type { PostResponse } from "@/types/post";
import type { UserProfileResponse } from "@/types/user";

type UserProfileTab = "threads" | "replies" | "quote";

type UserProfileRouteClientProps = {
  activeTab: UserProfileTab;
  initialPage?: PostResponse | null;
  initialProfile?: UserProfileResponse | null;
  username: string;
};

export default function UserProfileRouteClient({
  activeTab,
  initialPage,
  initialProfile,
  username,
}: UserProfileRouteClientProps) {
  return (
    <UserProfilePageShell
      username={username}
      activeTab={activeTab}
      initialProfile={initialProfile}
    >
      {activeTab === "threads" ? (
        <UserProfilePosts username={username} initialPage={initialPage} />
      ) : null}
      {activeTab === "replies" ? (
        <UserProfileReplies username={username} initialPage={initialPage} />
      ) : null}
      {activeTab === "quote" ? (
        <UserProfileQuotes username={username} initialPage={initialPage} />
      ) : null}
    </UserProfilePageShell>
  );
}
