import UserProfileRouteClient from "@/app/[locale]/(main)/(default)/[username]/_components/UserProfileRouteClient";
import { getPostsByUserServer } from "@/features/post/api/server";
import { getUserByUsernameServer } from "@/features/user/api/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type UserProfilePageProps = {
  params: Promise<{
    username?: string;
  }>;
};

export async function generateMetadata({
  params,
}: UserProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const normalizedUsername = username?.trim();

  if (!normalizedUsername) {
    return {
      title: "Trang cá nhân",
      description: "",
    };
  }

  try {
    const userRes = await getUserByUsernameServer(normalizedUsername);
    const user = userRes?.data;

    return !user
      ? {
          title: "Trang cá nhân",
          description: "",
        }
      : {
          title: `Trang cá nhân của | ${user.username}`,
          description: user.bio || "",
        };
  } catch (error) {
    return {
      title: "Trang cá nhân",
      description: "",
    };
  }
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { username } = await params;
  const normalizedUsername = username?.trim();

  if (!normalizedUsername) return notFound();

  const [initialProfile, initialPage] = await Promise.all([
    getUserByUsernameServer(normalizedUsername),
    getPostsByUserServer(normalizedUsername),
  ]);

  return (
    <UserProfileRouteClient
      username={normalizedUsername}
      activeTab="threads"
      initialProfile={initialProfile}
      initialPage={initialPage}
    />
  );
}
