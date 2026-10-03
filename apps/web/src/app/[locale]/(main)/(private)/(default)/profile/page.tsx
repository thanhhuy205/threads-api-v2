import ProfileRouteClient from "@/app/[locale]/(main)/(private)/(default)/profile/_components/ProfileRouteClient";
import { verifySession } from "@/features/auth/server/session";
import { getMyPostsServer } from "@/features/post/api/server";
import { Metadata } from "next";
export async function generateMetadata(): Promise<Metadata> {
  const user = await verifySession();

  return !user
    ? {
        title: "Trang cá nhân", // → "Tên bài viết | My App"
        description: "",
      }
    : {
        title: `Trang cá nhân của | ${user.username}`, // → "Tên bài viết | My App"
        description: user?.bio,
      };
}
export default async function PrivateProfilePage() {
  const [initialUser, initialPage] = await Promise.all([
    verifySession(),
    getMyPostsServer(),
  ]);

  return (
    <ProfileRouteClient
      activeTab="threads"
      initialPage={initialPage}
      initialUser={initialUser}
    />
  );
}
