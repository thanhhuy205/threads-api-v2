import { Prisma } from "@prisma/client";

export const postFeedSelect = Prisma.validator<Prisma.PostSelect>()({
  publicId: true,
  userId: true,
  content: true,
  visibility: true,
  parentId: true,
  originPostId: true,
  origin: true,
  parent: true,
  rootPostId: true,
  userSnapshot: true,
  replyPermission: true,
  likesCount: true,
  repliesCount: true,
  repostsCountAndQuoteCount: true,
  viewsCount: true,
  isGhost: true,
  createdAt: true,
  media: true,
  mentions: {
    select: {
      userId: true,
      user: {
        select: {
          username: true,
        }
      }
    },
  },
  topicsPosts: {
    select: {
      topic: {
        select: {
          name: true,
        },
      }
    }
  }
});

export const postSelectRepository = {
  id: true,
  publicId: true,
  content: true,
  userId: true,
  visibility: true,
  createdAt: true,
  userSnapshot: true,
} satisfies Prisma.PostSelect;
