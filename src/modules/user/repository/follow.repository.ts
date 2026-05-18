import prisma from "@/config/prisma";
import { toFollowerUserDto, toFollowingUserDto, type FollowerUserDto } from "@/modules/user/mapper/follower.mapper";
import type { Prisma } from "@prisma/client";

class FollowRepository {
  async findFollowers({
    after,
    take = 10,
    where = {},
    props
  }: {
    after?: string;
    take?: number;
    where?: Prisma.FollowWhereInput;
    props: {
      followingId: string
    };
  }): Promise<FollowerUserDto[]> {
    const { followingId } = props

    const follows = await prisma.follow.findMany({
      where,
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      take: after ? take + 1 : take,
      skip: after ? 1 : 0,
      cursor:
        after && followingId
          ? {
            userId_followingId: {
              userId: after,
              followingId,
            },
          }
          : undefined,
      select: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            verifiedAt: true,
          },
        },
      },
    });

    return follows.map(toFollowerUserDto);
  }

  async findFollowing({
    after,
    take = 10,
    where = {},
    props
  }: {
    after?: string;
    take?: number;
    where?: Prisma.FollowWhereInput;
    props: {
      userId: string
    };
  }): Promise<FollowerUserDto[]> {
    const { userId } = props

    const follows = await prisma.follow.findMany({
      where,
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      take: after ? take + 1 : take,
      skip: after ? 1 : 0,
      cursor:
        after && userId
          ? {
            userId_followingId: {
              userId,
              followingId: after,
            },
          }
          : undefined,
      select: {
        following: {
          select: {
            id: true,
            username: true,
            name: true,
            verifiedAt: true,
          },
        },
      },
    });

    return follows.map(toFollowingUserDto);
  }

  async findAll(params: any) {
    return this.findFollowers(params);
  }

  async findFollowRecord(userId: string, followingId: string) {
    return prisma.follow.findUnique({
      where: {
        userId_followingId: {
          userId,
          followingId,
        },
      },
      select: {
        id: true,
        isFollowing: true,
      },
    });
  }

  async create(userId: string, followingId: string) {
    return prisma.follow.create({
      data: {
        userId,
        followingId,
        isFollowing: true,
      },
      select: {
        id: true,
        isFollowing: true,
      },
    });
  }

  async updateStatusByFollowId(followId: number, isFollowing: boolean) {
    return prisma.follow.update({
      where: {
        id: followId,
      },
      data: {
        isFollowing,
      },
      select: {
        id: true,
        isFollowing: true,
      },
    });
  }

  async findUserFollowingPostByAuth(userId: string, authorIds: string[]) {
    return prisma.follow.findMany({
      where: {
        userId,
        followingId: {
          in: authorIds,
        },
      }
    });
  }

  async findUserFollowersByAuth(userId: string, authorIds: string[]) {
    return prisma.follow.findMany({
      where: {
        followingId: userId,
        userId: {
          in: authorIds,
        },
      }
    });
  }
}
export const followRepository = new FollowRepository();
