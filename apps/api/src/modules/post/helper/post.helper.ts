import { PostType, Prisma, VisibilityPost } from "../../../../generated/prisma";

type PostCursorInfo = {
    id: number;
    createdAt: Date;
};

type BuildUserPostsWhereOptions = {
    after?: string | null;
    cursorInfo?: PostCursorInfo | null;
    userId: string;
    postTypes?: readonly PostType[];
    excludeReplies?: boolean;
}

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

export const buildNewFeedWhere = (): Prisma.PostWhereInput => ({
    type: { in: [PostType.POST, PostType.ANNOUNCEMENT] },
    visibility: VisibilityPost.WORKSPACE,
    parentId: null,
    originPostId: null,
});


export const buildRepliesWhere = ({
    publicId,
}: BuildRepliesWhereOptions): Prisma.PostWhereInput => {
    return ({
        parentPublicId: publicId,
        parentId: { not: null },
    });
};
export const buildUserPostsWhere = ({
    userId,
    postTypes,
    excludeReplies = false
}: BuildUserPostsWhereOptions): Prisma.PostWhereInput => {
    const where: Prisma.PostWhereInput = {
        userId
    };

    if (postTypes) {
        return ({
            ...where,
            type: { in: [...postTypes] },
        });
    }

    return { ...where, parentId: excludeReplies ? null : undefined };
};
export const buildQuoteWhere = ({
    userId,
}: BuildQuoteWhereOptions): Prisma.PostWhereInput => {
    return ({
        userId,
        originPostId: { not: null },
    });
};
