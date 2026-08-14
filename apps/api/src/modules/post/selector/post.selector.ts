import { Prisma } from "@prisma/client";

export const postFeedSelect = Prisma.validator<Prisma.PostSelect>()({
  publicId: true,
  userId: true,
  content: true,
  visibility: true,
  type: true,
  isPinned: true,
  expiresAt: true,
  groupTeam: {
    select: {
      publicId: true,
      name: true,
    },
  },
  parentId: true,
  parentPublicId: true,
  originPostId: true,
  rootPostId: true,
  rootPublicId: true,
  isQuote: true,
  origin: true,
  parent: true,
  userSnapshot: true,
  likesCount: true,
  viewsCount: true,
  isSurvey: true,
  createdAt: true,
  poll: {
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
      voteCount: true,
      isExpired: true,
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
  type: true,
  userId: true,
  visibility: true,
  isPinned: true,
  expiresAt: true,
  groupTeamId: true,
  createdAt: true,
  userSnapshot: true,
} satisfies Prisma.PostSelect;
