import prisma from "@/config/prisma";
import { FriendRequestStatus, type Prisma } from "@prisma/client";

const userProfileSelect = {
  id: true,
  email: true,
  username: true,
  name: true,
  bio: true,
  avatar: true,
  verifiedAt: true,
  status: true,
  followersCount: true,
  followingCount: true,
  postsCount: true,
  isPrivate: true,
  location: true,
  website: true,
  createdAt: true,
} as const;

const userByUsernameSelect = {
  id: true,
  username: true,
  name: true,
  bio: true,
  avatar: true,
  verifiedAt: true,
  followersCount: true,
  followingCount: true,
  postsCount: true,
  isPrivate: true,
  location: true,
  website: true,
} as const;

export type UserProfile = Prisma.UserGetPayload<{
  select: typeof userProfileSelect;
}>;

class UserRepository {
  async findById(id: string): Promise<UserProfile | null> {
    return prisma.user.findUnique({
      where: {
        id,
      },
      select: userProfileSelect,
    });
  }

  async findByUsername(
    username: string,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.user.findUnique({
      where: {
        username,
      },
      select: userByUsernameSelect,
    });
  }

  async findUserRequestFriend(currentUserId: string, targetUserId: string) {
    const [receivedFriendRequest, sentFriendRequest] = await Promise.all([
      prisma.friendRequest.findFirst({
        where: {
          senderId: targetUserId,
          receiverId: currentUserId,
          status: FriendRequestStatus.PENDING,
        },
        select: {
          id: true,
        },
      }),
      prisma.friendRequest.findFirst({
        where: {
          senderId: currentUserId,
          receiverId: targetUserId,
          status: FriendRequestStatus.PENDING,
        },
        select: {
          id: true,
        },
      }),
    ]);

    return {
      hasReceivedFriendRequest: Boolean(receivedFriendRequest),
      hasSentFriendRequest: Boolean(sentFriendRequest),
    };
  }

  async findUserFollowing(currentUserId: string, targetUserId: string) {
    const follow = await prisma.follow.findUnique({
      where: {
        userId_followingId: {
          userId: currentUserId,
          followingId: targetUserId,
        },
      },
      select: {
        isFollowing: true,
      },
    });

    return {
      isFollowing: Boolean(follow?.isFollowing),
    };
  }

  async findExistingIds(userIds: string[]) {
    if (!userIds.length) {
      return [];
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
      },
    });

    return users.map((user) => user.id);
  }

  async incrementFollowersCount(
    userId: string,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.user.update({
      where: {
        id: userId,
      },
      data: {
        followersCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        followersCount: true,
      },
    });
  }

  async decrementFollowersCount(
    userId: string,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.user.updateMany({
      where: {
        id: userId,
        followersCount: {
          gt: 0,
        },
      },
      data: {
        followersCount: {
          decrement: 1,
        },
      },
    });
  }
}

export const userRepository = new UserRepository();
