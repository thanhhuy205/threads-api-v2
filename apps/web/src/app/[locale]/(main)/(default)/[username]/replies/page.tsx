import UserProfileRouteClient from "../_components/UserProfileRouteClient";
import { getRepliesByUserServer } from "@/features/post/api/server";
import { getUserByUsernameServer } from "@/features/user/api/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type UserProfileRepliesPageProps = {
  params: Promise<{
    username?: string;
  }>;
};

export async function generateMetadata({
  params,
}: UserProfileRepliesPageProps): Promise<Metadata> {
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

export default async function UserProfileRepliesPage({
  params,
}: UserProfileRepliesPageProps) {
  const { username } = await params;
  const normalizedUsername = username?.trim();

  if (!normalizedUsername) return notFound();

  const [initialProfile, initialPage] = await Promise.all([
    getUserByUsernameServer(normalizedUsername),
    getRepliesByUserServer(normalizedUsername),
  ]);

  return (
    <UserProfileRouteClient
      username={normalizedUsername}
      activeTab="replies"
      initialProfile={initialProfile}
      initialPage={initialPage}
    />
  );
}
