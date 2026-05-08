import { NewFeedType } from "@/modules/post/enum";
import { PostType, Prisma } from "@prisma/client";

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
            not: PostType.REPLY
        },
    };

    if (feedType === NewFeedType.FOR_YOU && userId) {
        return ({
            ...where,
            userId: {
                not: userId,
            },
        });
    }

    return where;

}


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
                not: PostType.REPLY
            }
        });
    }

    return where;
};

export const buildRepliesWhere = ({
    publicId,
}: BuildRepliesWhereOptions): Prisma.PostWhereInput => {
    return ({
        parentPublicId: publicId,
        type: PostType.REPLY,
    });
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
