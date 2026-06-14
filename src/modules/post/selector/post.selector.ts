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
  viewsCount: true,
  isGhost: true,
  isSurvey: true,
  isDisinformation: true,
  createdAt: true,
  polls: {
    select: {
      id: true,
      expiresAt: true,
      pollOptions: {
        select: {
          id: true,
          optionText: true,
          votesCount: true,
        },
        orderBy: {
          id: "asc",
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  },
  media: {
    select: {
      id: true,
      url: true,
      type: true,
      width: true,
      height: true,
      status: true,
    },
  },
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
  contentJson: true,
  userId: true,
  visibility: true,
  createdAt: true,
  userSnapshot: true,
  isDisinformation: true,
} satisfies Prisma.PostSelect;
