import { Prisma } from "@prisma/client";

export const postFeedSelect = Prisma.validator<Prisma.PostSelect>()({
    publicId: true,
    userId: true,
    content: true,
    parentId: true,
    originPostId: true,
    // origin: postOriginSelect,
    parent: true,
    rootPostId: true,
    userSnapshot: true,
    replyPermission: true,
    likesCount: true,
    repliesCount: true,
    repostsCountAndQuoteCount: true,
    viewsCount: true,
    createdAt: true,
    media: true,
    mentions: true,
    isGhost: true,
});

const postOriginSelect = Prisma.validator<Prisma.PostSelect>()({
    userId: true,
    content: true,
    parentId: true,
    originPostId: true,
    rootPostId: true,
    userSnapshot: true,
    replyPermission: true,
    likesCount: true,
    repliesCount: true,
    repostsCountAndQuoteCount: true,
    viewsCount: true,
    isPinned: false,
});