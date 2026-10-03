"use client";

import LoadingFetch from "@/app/[locale]/(main)/_components/common/LoadingFetch";
import ScrollTop from "@/app/[locale]/(main)/_components/common/ScrollTop";
import ContentNotFound from "@/app/[locale]/(main)/_components/post/ContentNotFound";
import InfiniteList from "@/app/[locale]/(main)/_components/post/InfiniteList";
import PostCard from "@/app/[locale]/(main)/_components/post/PostCard";
import NotFound from "@/app/[locale]/not-found";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRepliesQuery, useGetSinglePostQuery } from "@/features/post/api";
import { mapPost } from "@/features/post/map";
import { toInfiniteInitialData } from "@/lib/tanstack-query/infinite";
import type {
  ReplyData,
  ReplyResponse,
  SinglePostResponse,
} from "@/types/post";
import { ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import SimilarPostsTag from "./SimilarPostsSidebar";

type PostDetailClientProps = {
  publicId: string;
  initialSinglePost: SinglePostResponse;
  initialReplies: ReplyResponse;
  isLoadingFromNavigation: boolean;
};

const SEEDED_POST_DETAIL_QUERY_OPTIONS = {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  staleTime: 30_000,
};

const PostDetailClient = ({
  publicId,
  initialSinglePost,
  initialReplies,
  isLoadingFromNavigation,
}: PostDetailClientProps) => {
  const router = useRouter();

  const {
    data: singlePostResponse,
    isLoading: loadingSingle,
    isError: singleError,
  } = useGetSinglePostQuery(publicId, {
    ...SEEDED_POST_DETAIL_QUERY_OPTIONS,
    enabled: Boolean(publicId),
    initialData: initialSinglePost,
  });

  const {
    data: repliesResponse,
    isLoading: loadingReplies,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage: isFetchingReplies,
  } = useGetRepliesQuery(
    { publicId },
    {
      ...SEEDED_POST_DETAIL_QUERY_OPTIONS,
      // Always reconcile the server seed with the live reply list. This also
      // protects the UI when a previously cached page supplied stale replies.
      refetchOnMount: "always",
      enabled: Boolean(publicId),
      initialData: toInfiniteInitialData(initialReplies),
    },
  );

  const replies = repliesResponse?.pages.flatMap((page) => page.data) ?? [];
  const postDetail = singlePostResponse?.data;

  if (!publicId || singleError) return <NotFound />;
  if (!postDetail && loadingSingle) return <LoadingFetch />;
  if (loadingSingle && isLoadingFromNavigation) {
    return <LoadingFetch />;
  }

  return (
    <>
      <ScrollTop />
      <Card className="border-0 shadow-none bg-primary-foreground rounded-none">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border sticky top-0 bg-background z-10">
          <button onClick={() => router.back()} className="hover:bg-accent p-2 rounded-full transition-colors inline-flex items-center justify-center">
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="text-lg font-bold">Bài viết</h1>
        </div>
        <CardContent className="space-y-3 p-0!">
          <PostCard mode="detail" post={mapPost(postDetail!)} />

          {postDetail && (
            <div className="flex items-center gap-2 pt-2 px-4">
              <SimilarPostsTag
                publicId={postDetail.publicId}
                content={postDetail.content || ""}
                topics={
                  (postDetail.topicsPosts
                    ?.map((tp) => tp.topic?.name)
                    .filter(Boolean) as string[]) ??
                  postDetail.topics ??
                  []
                }
              />
            </div>
          )}

          <div className="flex flex-col items-center justify-between text-sm pt-2 px-4 gap-4">
            <Separator />

            {replies.length < 1 ? (
              ""
            ) : (
              <>
                <div className="flex w-full justify-between">
                  <button className="flex items-center gap-1 font-semibold">
                    Hàng đầu <ChevronDown size={13} />
                  </button>
                  <button className="flex items-center gap-1 text-muted-foreground text-sm">
                    <p>Xem hoạt động</p> <ChevronRight size={13} />
                  </button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      <div>
        {loadingReplies ? (
          <LoadingFetch />
        ) : (
          <InfiniteList
            data={replies}
            continuePage={hasNextPage || false}
            skeleton={<Skeleton />}
            contentNotFoundItem={<ContentNotFound />}
            endReached={() => {
              if (hasNextPage && !isFetchingReplies) {
                fetchNextPage();
              }
            }}
            itemContent={(_index, reply: ReplyData) => (
              <PostCard
                key={reply.publicId}
                onClick={() =>
                  router.push(
                    `/${reply.userSnapshot.username}/post/${reply.publicId}`,
                  )
                }
                mode="comment"
                post={mapPost(reply)}
              />
            )}
          />
        )}
      </div>
    </>
  );
};

export default PostDetailClient;
