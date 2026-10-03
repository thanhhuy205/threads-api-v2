import SkeletonFetch from "@/app/[locale]/(main)/_components/common/Skeleton/SkeletonFetch";
import SkeletonPost from "@/app/[locale]/(main)/_components/common/Skeleton/SkeletonPost";
import InfiniteList from "@/app/[locale]/(main)/_components/post/InfiniteList";
import PostCard from "@/app/[locale]/(main)/_components/post/PostCard";
import { useAuth } from "@/features/auth/hooks";
import { useGetMyRepliesQuery } from "@/features/post";
import { mapPost } from "@/features/post/map";
import { toInfiniteInitialData } from "@/lib/tanstack-query/infinite";
import type { PostItem, PostResponse } from "@/types/post";
import type { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type ProfileRepliesProps = {
    initialPage?: PostResponse | null;
    initialUser?: User | null;
};

const ProfileReplies = ({ initialPage, initialUser }: ProfileRepliesProps) => {
    const { user: authUser } = useAuth();
    const user = authUser ?? initialUser;
    const router = useRouter();
    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useGetMyRepliesQuery({
        options: {
            enabled: Boolean(user),
            initialData: toInfiniteInitialData(initialPage),
            refetchOnMount: false,
            staleTime: 30_000,
        },
    });

    const replies = useMemo(
        () => (data?.pages ?? []).flatMap((page) => page.data ?? []),
        [data?.pages],
    );

    if (!user) return null;

    if (isLoading && !data) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonPost key={`profile-replies-skeleton-${index}`} />
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
        <InfiniteList
            data={replies}
            endReached={() => {
                if (!isFetchingNextPage && hasNextPage) {
                    void fetchNextPage();
                }
            }}
            contentNotFoundItem="Bạn chưa có bài trả lời nào"
            continuePage={Boolean(hasNextPage)}
            skeleton={<SkeletonFetch />}
            itemContent={(_index, post: PostItem) => (
                <PostCard
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

export default ProfileReplies;
