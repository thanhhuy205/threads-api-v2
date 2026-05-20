import { NewFeedType } from "@/modules/post/enum";
import { FriendRequestStatus, PostType, Prisma, VisibilityPost } from "@prisma/client";

type PostCursorInfo = {
    id: number;
    createdAt: Date;
};

type BuildUserPostsWhereOptions = {
    after?: string | null;
    cursorInfo?: PostCursorInfo | null;
    userId: string;
    postType?: PostType;
    excludeReplies?: boolean;
}

type BuildNewFeedWhereOptions = {
    after?: string | null;
    cursorInfo?: PostCursorInfo | null;
    userId: string | null;
    feedType: NewFeedType;
};

type BuildRepliesWhereOptions = {
    after?: string | null;
    cursorInfo?: PostCursorInfo | null;
    publicId: string;
};

type BuildQuoteWhereOptions = {
    after?: string | null;
    cursorInfo?: PostCursorInfo | null;
    userId: string;
};

export const buildNewFeedWhere = ({
    userId,
    feedType
}: BuildNewFeedWhereOptions) => {
    const where: Prisma.PostWhereInput = {
        type: {
            notIn: [PostType.REPLY, PostType.CIRCLE, PostType.CIRCLE_REPLY],
        },
        visibility: {
            notIn: [VisibilityPost.FRIEND, VisibilityPost.PRIVATE, VisibilityPost.CIRCLE]
        }
    };

    if (feedType === NewFeedType.FOR_YOU && userId) {
        return ({
            ...where,
            userId: {
                not: userId,
            },
        });
    }
    if (feedType === NewFeedType.FOLLOWING && userId) {
        return ({
            ...where,
            user: {
                followers: {
                    some: {
                        userId,
                        isFollowing: true,
                    },
                },
            },
        });
    }
    if (feedType === NewFeedType.FRIEND && userId) {
        return ({
            ...where,
            user: {
                OR: [
                    {
                        friendRequests: {
                            some: {
                                receiverId: userId,
                                status: FriendRequestStatus.ACCEPTED,
                            },
                        },
                    },
                    {
                        receivedRequests: {
                            some: {
                                senderId: userId,
                                status: FriendRequestStatus.ACCEPTED,
                            },
                        },
                    },
                ],
            },
        });
    }

    return where;

}



export const buildRepliesWhere = ({
    publicId,
}: BuildRepliesWhereOptions): Prisma.PostWhereInput => {
    return ({
        parentPublicId: publicId,
        type: PostType.REPLY,
    });
};
export const buildUserPostsWhere = ({
    userId,
    postType,
    excludeReplies = false
}: BuildUserPostsWhereOptions): Prisma.PostWhereInput => {
    const where: Prisma.PostWhereInput = {
        userId
    };

    if (postType) {
        return ({
            ...where,
            type: postType,
        });
    }

    if (excludeReplies) {
        return ({
            ...where,
            type: {
                notIn: [PostType.REPLY, PostType.CIRCLE_REPLY]
            }
        });
    }

    return where;
};
export const buildQuoteWhere = ({
    userId,
}: BuildQuoteWhereOptions): Prisma.PostWhereInput => {
    return ({
        userId,
        type: {
            in: [PostType.REPOST, PostType.QUOTE],
        },
    });
};
