import { PER_PAGE } from "@/constant/pagination";
import { serverGetJson } from "@/lib/http/server-api";
import {
    FeedType,
    type FeedType as FeedTypeValue,
    type PostResponse,
    type ReplyResponse,
    type SinglePostResponse,
} from "@/types/post";

const postDetailTags = (publicId: string) => [`post:${publicId}`];
const postRepliesTags = (publicId: string) => [
    `post:${publicId}`,
    `post:${publicId}:replies`,
];

export const getSinglePostServer = (publicId: string, revalidate?: number) =>
    serverGetJson<SinglePostResponse>(`/posts/${publicId}`, {
        auth: false,
        revalidate,
        tags: postDetailTags(publicId),
    });

export const getRepliesServer = (
    publicId: string,
    after?: string,
    revalidate?: number,
) => {
    return serverGetJson<ReplyResponse>(`/posts/${publicId}/replies`, {
        auth: false,
        params: {
            after,
            take: PER_PAGE,
        },
        revalidate,
        tags: postRepliesTags(publicId),
    });
};

export const getFeedsServer = (
    type: FeedTypeValue = FeedType.FOR_YOU,
    after?: string,
) =>
    serverGetJson<PostResponse>("/posts/news-feed", {
        params: {
            type,
            after,
            take: PER_PAGE,
        },
    });

export const getFeedsByFollowingServer = (after?: string) =>
    getFeedsServer(FeedType.FOLLOWING, after);

export const getMyPostsServer = (after?: string) =>
    serverGetJson<PostResponse>("/posts/me", {
        params: {
            after,
            take: PER_PAGE,
        },
    });

export const getMyRepliesServer = (after?: string) =>
    serverGetJson<PostResponse>("/posts/me/replies", {
        params: {
            after,
            take: PER_PAGE,
        },
    });

export const getMyQuotesServer = (after?: string) =>
    serverGetJson<PostResponse>("/posts/me/quote", {
        params: {
            after,
            take: PER_PAGE,
        },
    });

export const getPostsByUserServer = (username: string, after?: string) =>
    serverGetJson<PostResponse>(`/posts/user/${encodeURIComponent(username)}`, {
        params: {
            after,
            take: PER_PAGE,
        },
    });

export const getRepliesByUserServer = (username: string, after?: string) =>
    serverGetJson<PostResponse>(
        `/posts/user/${encodeURIComponent(username)}/replies`,
        {
            params: {
                after,
                take: PER_PAGE,
            },
        },
    );

export const getQuotesByUserServer = (username: string, after?: string) =>
    serverGetJson<PostResponse>(
        `/posts/user/${encodeURIComponent(username)}/quotes`,
        {
            params: {
                after,
                take: PER_PAGE,
            },
        },
    );
