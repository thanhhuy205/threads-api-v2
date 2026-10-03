"use client";
import SkeletonFetch from "@/app/[locale]/(main)/_components/common/Skeleton/SkeletonFetch";
import SkeletonPost from "@/app/[locale]/(main)/_components/common/Skeleton/SkeletonPost";
import InfiniteList from "@/app/[locale]/(main)/_components/post/InfiniteList";
import PostCard from "@/app/[locale]/(main)/_components/post/PostCard";
import { useGetQuotesByUserQuery } from "@/features/post";
import { mapPost } from "@/features/post/map";
import { toInfiniteInitialData } from "@/lib/tanstack-query/infinite";
import type { PostItem, PostResponse } from "@/types/post";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type UserProfileQuotesProps = {
  initialPage?: PostResponse | null;
  username: string;
};

const UserProfileQuotes = ({
  initialPage,
  username,
}: UserProfileQuotesProps) => {
  const router = useRouter();
  const normalizedUsername = username.trim();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetQuotesByUserQuery({
      query: {
        username: normalizedUsername,
      },
      options: {
        enabled: Boolean(normalizedUsername),
        initialData: toInfiniteInitialData(initialPage),
        refetchOnMount: false,
        staleTime: 30_000,
      },
    });

  const quotes = useMemo(
    () => (data?.pages ?? []).flatMap((page) => page.data ?? []),
    [data?.pages],
  );

  if (isLoading && !data) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonPost key={`user-profile-quotes-skeleton-${index}`} />
        ))}
      </div>
    );
  }

  const handleNavigateToDetail = (publicId: string, postUsername?: string) => {
    const targetUsername = postUsername?.trim() || normalizedUsername;
    router.push(`/${targetUsername}/post/${publicId}`);
  };

  return (
    <InfiniteList
      data={quotes}
      endReached={() => {
        if (!isFetchingNextPage && hasNextPage) {
          void fetchNextPage();
        }
      }}
      contentNotFoundItem="Người dùng này chưa có bài đăng lại nào"
      continuePage={Boolean(hasNextPage)}
      skeleton={<SkeletonFetch />}
      itemContent={(_index, post: PostItem) => (
        <PostCard
          onClick={() => {
            const postUser = post.userSnapshot;
            handleNavigateToDetail(post.publicId, postUser?.username);
          }}
          post={mapPost(post)}
          mode="repost"
        />
      )}
    />
  );
};

export default UserProfileQuotes;
