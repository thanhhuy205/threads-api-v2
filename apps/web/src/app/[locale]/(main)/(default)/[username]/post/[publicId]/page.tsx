import { PER_PAGE } from "@/constant/pagination";
import { getRepliesServer, getSinglePostServer } from "@/features/post/api/server";
import type { ReplyResponse } from "@/types/post";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetailClient from "./post-detail-client";

type PostDetailPageProps = {
  params: Promise<{
    publicId?: string;
    username?: string;
  }>;
  searchParams?: Promise<{
    loading?: string;
  }>;
};

const emptyReplies: ReplyResponse = {
  success: true,
  data: [],
  pagination: {
    after: undefined,
    hasMore: false,
    take: PER_PAGE,
  },
};

export const revalidate = 120;

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { publicId } = resolvedParams;

  if (!publicId) {
    return {
      title: "Post not found",
    };
  }

  const singlePost = await getSinglePostServer(publicId, revalidate);

  if (!singlePost?.data) {
    return {
      title: "Post not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  } else {
    console.log(singlePost);
  }

  const post = singlePost.data;
  const displayName = post.userSnapshot?.name ?? post.userSnapshot?.username ?? "User";
  const username = post.userSnapshot?.username ?? resolvedParams.username ?? "";
  const contentPreview = post.content?.trim().slice(0, 150) || "Post detail";

  return {
    title: `${displayName}${username ? ` (@${username})` : ""} | PulseBoard`,
    description: contentPreview,
  };
}

export default async function MainUserPostDetailPage({
  params,
  searchParams,
}: PostDetailPageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const { publicId } = resolvedParams;

  if (!publicId) {
    return notFound();
  }

  const [singlePostResponse, repliesResponse] = await Promise.all([
    getSinglePostServer(publicId, revalidate),
    // Replies change frequently and must not be seeded from a stale route cache.
    getRepliesServer(publicId),
  ]);

  if (!singlePostResponse?.data) {
    return notFound();
  }

  return (
    <PostDetailClient
      publicId={publicId}
      initialSinglePost={singlePostResponse}
      initialReplies={repliesResponse ?? emptyReplies}
      isLoadingFromNavigation={resolvedSearchParams?.loading === "1"}
    />
  );
}
