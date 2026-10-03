"use client";
import SkeletonFetch from "@/app/[locale]/(main)/_components/common/Skeleton/SkeletonFetch";
import SkeletonPost from "@/app/[locale]/(main)/_components/common/Skeleton/SkeletonPost";
import InfiniteList from "@/app/[locale]/(main)/_components/post/InfiniteList";
import PostCard from "@/app/[locale]/(main)/_components/post/PostCard";
import { useGetPostsByUserQuery } from "@/features/post";
import { mapPost } from "@/features/post/map";
import { toInfiniteInitialData } from "@/lib/tanstack-query/infinite";
import type { PostItem, PostResponse } from "@/types/post";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type UserProfilePostsProps = {
  initialPage?: PostResponse | null;
  username: string;
};

const UserProfilePosts = ({ initialPage, username }: UserProfilePostsProps) => {
  const router = useRouter();
  const normalizedUsername = username.trim();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetPostsByUserQuery({
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

  const posts = useMemo(
    () => (data?.pages ?? []).flatMap((page) => page.data ?? []),
    [data?.pages],
  );

  if (isLoading && !data) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonPost key={`user-profile-posts-skeleton-${index}`} />
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
      data={posts}
      endReached={() => {
        if (!isFetchingNextPage && hasNextPage) {
          void fetchNextPage();
        }
      }}
      contentNotFoundItem={
        posts.length === 0 && (
          <div className="py-16 flex flex-col items-center gap-3">
            <p className="text-sm text-gray-500">No posts yet</p>
          </div>
        )
      }
      continuePage={Boolean(hasNextPage)}
      skeleton={<SkeletonFetch />}
      itemContent={(_index, post: PostItem) => (
        <PostCard
          mode="profile"
          onClick={() => {
            const postUser = post.userSnapshot;
            handleNavigateToDetail(post.publicId, postUser?.username);
          }}
          post={mapPost(post)}
        />
      )}
    />
  );
};

export default UserProfilePosts;
