import legacyPrisma from "@/config/prisma";
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/database/prisma.service';
import { InteractionType, Prisma } from "@prisma/client";

type PostInteractionDbClient = Prisma.TransactionClient | PrismaService;

type PostInteractionPayload = {
  userId: string;
  postId: number;
  type: InteractionType;
};

@Injectable()
export class PostInteractionRepository {
  constructor(private readonly prisma: PrismaService = legacyPrisma as unknown as PrismaService) {}

  create(payload: PostInteractionPayload, tx: PostInteractionDbClient = this.prisma) {
    return tx.postInteraction.createMany({
      data: [payload],
      skipDuplicates: true,
    });
  }

  findByStatus(
    payload: PostInteractionPayload,
    tx: PostInteractionDbClient = this.prisma,
  ) {
    return tx.postInteraction.findFirst({
      where: payload,
      select: {
        id: true,
      },
    });
  }

  deleteByUserPostAndType(
    payload: PostInteractionPayload,
    tx: PostInteractionDbClient = this.prisma,
  ) {
    return tx.postInteraction.deleteMany({
      where: payload,
    });
  }
}

