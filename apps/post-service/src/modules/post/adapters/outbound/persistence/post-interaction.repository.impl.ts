import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../../../prisma/prisma.service';
import type { PostInteractionCommand } from '../../../application/commands/post-interaction.command';
import type { PostInteractionRepository } from '../../../application/ports/outbound/persistence/interaction.repository.port';

type PostInteractionDbClient = Prisma.TransactionClient | PrismaService;

@Injectable()
export class PostInteractionRepositoryImpl implements PostInteractionRepository {
  constructor(private readonly prisma: PrismaService) { }

  create(command: PostInteractionCommand, tx: PostInteractionDbClient = this.prisma) {
    return tx.postInteraction.createMany({
      data: [command],
      skipDuplicates: true,
    });
  }

  findByStatus(
    command: PostInteractionCommand,
    tx: PostInteractionDbClient = this.prisma,
  ) {
    return tx.postInteraction.findFirst({
      where: command,
      select: {
        id: true,
      },
    });
  }

  deleteByUserPostAndType(
    command: PostInteractionCommand,
    tx: PostInteractionDbClient = this.prisma,
  ) {
    return tx.postInteraction.deleteMany({
      where: command,
    });
  }
}
