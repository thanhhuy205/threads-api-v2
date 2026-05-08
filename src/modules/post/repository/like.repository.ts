import prisma from "@/config/prisma";

class LikeRepository {
  async createMany(payloads: { userId: string; postId: string }[]) {
    return prisma.like.createMany({
      data: payloads,
      skipDuplicates: true,
    });
  }

  async deleteMany(payloads: { userId: string; postId: string; }[]) {
    return prisma.like.deleteMany({
      where: {
        userId: { in: payloads.map((item) => item.userId) },
        postId: { in: payloads.map((item) => item.postId) },
      }
    });
  }

}

export const likeRepository = new LikeRepository();
