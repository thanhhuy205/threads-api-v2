import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

type LikeDbClient = Prisma.TransactionClient | typeof prisma;

class LikeRepository {
  async createMany(payloads: { userId: string; postId: string }[]) {
    return prisma.like.createMany({
      data: payloads,
      skipDuplicates: true,
    });
  }

  async create(payload: { userId: string; postId: string; isLike: boolean }) {
    return prisma.like.create({
      data: payload,
    });
  }


  async deleteMany(payloads: { userId: string; postId: string; }[]) {
    if (payloads.length === 0) {
      return { count: 0 };
    }
    return prisma.like.deleteMany({
      where: {
        OR: payloads.map((item) => ({
          userId: item.userId,
          postId: item.postId,
        })),
      },
    });
  }
  async updateMany(payloads: { userId: string; postId: string; }[]) {
    if (payloads.length === 0) {
      return { count: 0 };
    }

    return prisma.like.updateMany({
      where: {
        OR: payloads.map((item) => ({
          userId: item.userId,
          postId: item.postId,
        })),

      },
      data: {
        isLike: false,
      },
    });
  }

  createIfAbsent(payload: {
    userId: string;
    postId: string;
  }, tx: LikeDbClient = prisma) {
    return tx.like.createMany({
      data: [{
        ...payload,
        isLike: true,
      }],
      skipDuplicates: true,
    });
  }

  deleteByUserAndPost(
    payload: {
      userId: string;
      postId: string;
    },
    tx: LikeDbClient = prisma,
  ) {
    return tx.like.deleteMany({
      where: {
        userId: payload.userId,
        postId: payload.postId,
      },
    });
  }

}

export const likeRepository = new LikeRepository();
