import { Prisma } from "@prisma/client";

export const postFeedSelect = Prisma.validator<Prisma.PostSelect>()({
    id: true,
    publicId: true,
    userId: true,
    content: true,
    type: true,
    parentId: true,
    originPostId: true,
    rootPostId: true,
    userSnapshot: true,
    replyPermission: true,
    likesCount: true,
    repliesCount: true,
    repostsCount: true,
    quotesCount: true,
    viewsCount: true,
    createdAt: true,
    media: true,
    mentions: true
});
    