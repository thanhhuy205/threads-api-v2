import prisma from "@/config/prisma";
import { FriendRequestStatus, Prisma } from "@prisma/client";

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

const userBasicIdentitySelect = {
  id: true,
  username: true,
} as const;

export type UserProfile = Prisma.UserGetPayload<{
  select: typeof userProfileSelect;
}>;
export type UserBasicIdentity = Prisma.UserGetPayload<{
  select: typeof userBasicIdentitySelect;
}>;
export type UserUsernameItem = {
  username: string;
  id: string;
  avatar: string | null;
  name: string | null;
  verifiedAt: Date | null;
};

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

  async findByUsernames(
    usernames: string[],
    tx: Prisma.TransactionClient = prisma,
  ): Promise<UserBasicIdentity[]> {
    if (!usernames.length) {
      return [];
    }

    return tx.user.findMany({
      where: {
        username: {
          in: usernames,
        },
      },
      select: userBasicIdentitySelect,
    });
  }

  async findNetworkUsernames({
    userId,
    query,
    after,
    take = 10,
  }: {
    userId: string;
    query: string;
    after?: string;
    take?: number;
  }): Promise<UserUsernameItem[]> {
    return prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
        username: {
          contains: query,
        },
      },
      orderBy: {
        username: "asc",
      },
      take: take + 1,
      skip: after ? 1 : 0,
      cursor: after
        ? {
          username: after,
        }
        : undefined,
      select: {
        avatar: true,
        id: true,
        username: true,
        name: true,
        verifiedAt: true,
      },
    });
  }

  async findUserRequestFriend(currentUserId: string, targetUserId: string) {
    const [receivedFriendRequest, sentFriendRequest, isFriend] = await Promise.all([
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
      prisma.friendRequest.findFirst({
        where: {
          OR: [
            {
              senderId: currentUserId,
              receiverId: targetUserId,
            },
            {
              senderId: targetUserId,
              receiverId: currentUserId,
            },
          ],
          status: FriendRequestStatus.ACCEPTED,
        },
        select: {
          id: true,
        },
      }),
    ]);

    return {
      hasReceivedFriendRequest: Boolean(receivedFriendRequest),
      hasSentFriendRequest: Boolean(sentFriendRequest),
      isFriend: Boolean(isFriend),
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

  async searchUsernameOneQuery(query: string) {
    return prisma.user.findMany({
      where: {
        username: {
          startsWith: query,
        },
      },
      orderBy: {
        username: "asc",
      },
      take: 40,
      select: {
        id: true,
        username: true,
        name: true,
        verifiedAt: true,
      },
    });
  }

  async searchUsername(query: string) {
    const rows = await prisma.$queryRaw<UserUsernameItem[]>`
      SELECT username, id, avatar, name, verified_at as verifiedAt
      FROM users
      WHERE MATCH(username , name) AGAINST (${query} IN BOOLEAN MODE)
        AND deleted_at IS NULL
      ORDER BY MATCH(username, name) AGAINST (${query} IN BOOLEAN MODE) DESC, username ASC
      LIMIT 40
    `;

    return rows;
  }
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        verifiedAt: true,
      },
    });
  }
}

export const userRepository = new UserRepository();
