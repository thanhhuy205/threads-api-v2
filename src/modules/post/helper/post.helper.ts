import { NewFeedType } from "@/modules/post/enum";
import { PostType, Prisma } from "@prisma/client";

type BuildUserPostsWhereOptions = {
    userId: string;
    postType?: PostType;
    excludeReplies?: boolean;
}


export const buildNewFeedWhere = (userId: string | null, feedType: NewFeedType) => {
    const baseWhere: Prisma.PostWhereInput = {
        type: {
            not: PostType.REPLY
        }
    };

    if (feedType === NewFeedType.FOR_YOU && userId) {
        return {
            ...baseWhere,
            userId: {
                not: userId,
            },
        };
    }

    return baseWhere;

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
        return {
            ...where,
            type: postType
        };
    }

    if (excludeReplies) {
        return {
            ...where,
            type: {
                not: PostType.REPLY
            }
        };
    }

    return where;
};