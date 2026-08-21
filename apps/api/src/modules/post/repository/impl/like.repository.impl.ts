import { PrismaService } from '@/shared/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from "@prisma/client";
import type { LikeRepository } from '../like.repository';

type LikeDbClient = Prisma.TransactionClient | PrismaService;

@Injectable()
export class LikeRepositoryImpl implements LikeRepository {
  constructor(private readonly prismaService: PrismaService) { }

  async createMany(payloads: { userId: string; postId: string }[]) {
    return this.prismaService.like.createMany({
      data: payloads,
      skipDuplicates: true,
    });
  }

  async create(payload: { userId: string; postId: string; isLike: boolean }) {
    return this.prismaService.like.create({
      data: payload,
    });
  }


  async deleteMany(payloads: { userId: string; postId: string; }[]) {
    if (payloads.length === 0) {
      return { count: 0 };
    }
    return this.prismaService.like.deleteMany({
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

    return this.prismaService.like.updateMany({
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
  }, tx: LikeDbClient = this.prismaService) {
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
    tx: LikeDbClient = this.prismaService,
  ) {
    return tx.like.deleteMany({
      where: {
        userId: payload.userId,
        postId: payload.postId,
      },
    });
  }

}
