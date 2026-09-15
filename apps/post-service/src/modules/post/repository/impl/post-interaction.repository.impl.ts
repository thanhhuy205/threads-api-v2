import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { InteractionType, Prisma } from '../../../../generated/prisma/client';
import type { PostInteractionPayload, PostInteractionRepository } from '../post-interaction.repository';

type PostInteractionDbClient = Prisma.TransactionClient | PrismaService;

@Injectable()
export class PostInteractionRepositoryImpl implements PostInteractionRepository {
  constructor(private readonly prisma: PrismaService) {}

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

