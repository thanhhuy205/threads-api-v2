import prisma from "@/config/prisma";

class LikeRepository {
  async createMany(payloads: { userId: string; postId: string, isLike: boolean }[]) {
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
      }
    });
  }

}

export const likeRepository = new LikeRepository();
