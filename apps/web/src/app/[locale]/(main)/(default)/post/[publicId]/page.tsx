import { PER_PAGE } from "@/constant/pagination";
import {
  getRepliesServer,
  getSinglePostServer,
} from "@/features/post/api/server";
import type { ReplyResponse } from "@/types/post";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetailClient from "../../[username]/post/[publicId]/post-detail-client";

type MainPostDetailPageProps = {
  params: Promise<{
    publicId?: string;
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

export const metadata: Metadata = {
  title: "Post",
  description: "View post details and replies.",
};

export default async function MainPostDetailPage({
  params,
  searchParams,
}: MainPostDetailPageProps) {
  const [{ publicId }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

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
