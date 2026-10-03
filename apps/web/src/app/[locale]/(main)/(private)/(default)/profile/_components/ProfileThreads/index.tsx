import ContentNotFetch from "@/app/[locale]/(main)/_components/common/ContentNotFetch";
import SkeletonFetch from "@/app/[locale]/(main)/_components/common/Skeleton/SkeletonFetch";
import SkeletonPost from "@/app/[locale]/(main)/_components/common/Skeleton/SkeletonPost";
import InfiniteList from "@/app/[locale]/(main)/_components/post/InfiniteList";
import PostCard from "@/app/[locale]/(main)/_components/post/PostCard";
import { useAuth } from "@/features/auth/hooks";
import { useGetMyPostsQuery } from "@/features/post";
import { mapPost } from "@/features/post/map";
import { toInfiniteInitialData } from "@/lib/tanstack-query/infinite";
import type { PostItem, PostResponse } from "@/types/post";
import type { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type ProfileThreadsProps = {
  initialPage?: PostResponse | null;
  initialUser?: User | null;
};

const ProfileThreads = ({ initialPage, initialUser }: ProfileThreadsProps) => {
  const { user: authUser } = useAuth();
  const user = authUser ?? initialUser;
  const router = useRouter();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetMyPostsQuery({
      options: {
        enabled: Boolean(user),
        initialData: toInfiniteInitialData(initialPage),
        refetchOnMount: false,
        staleTime: 30_000,
      },
    });

  const posts = useMemo(
    () => (data?.pages ?? []).flatMap((page) => page.data ?? []),
    [data?.pages],
  );

  if (!user) return null;

  if (isLoading && !data) {
    return (
      <div>
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonPost key={`profile-thread-skeleton-${index}`} />
          ))}
      </div>
    );
  }

  const handleNavigateToDetail = (publicId: string, username: string) => {
    if (username) {
      router.push(`/${username}/post/${publicId}`);
      return;
    }

    router.push(`/post/${publicId}`);
  };

  return (
    <div>
      <InfiniteList
        data={posts}
        endReached={() => {
          if (!isFetchingNextPage && hasNextPage) {
            void fetchNextPage();
          }
        }}
        contentNotFoundItem={posts.length === 0 ? "" : <ContentNotFetch />}
        continuePage={Boolean(hasNextPage)}
        skeleton={<SkeletonFetch />}
        itemContent={(_index, post: PostItem) => (
          <PostCard
            mode="profile"
            presentation="feed"
            onClick={() => {
              const postUser = post.userSnapshot;
              handleNavigateToDetail(post.publicId, postUser?.username);
            }}
            post={mapPost(post)}
          />
        )}
      />
    </div>
  );
};

export default ProfileThreads;
