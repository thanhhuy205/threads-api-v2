import prisma from "@/config/prisma";
import { InteractionType, Prisma } from "@prisma/client";

type PostInteractionDbClient = Prisma.TransactionClient | typeof prisma;

type PostInteractionPayload = {
  userId: string;
  postId: number;
  type: InteractionType;
};

class PostInteractionRepository {
  create(payload: PostInteractionPayload, tx: PostInteractionDbClient = prisma) {
    return tx.postInteraction.createMany({
      data: [payload],
      skipDuplicates: true,
    });
  }

  findByStatus(
    payload: PostInteractionPayload,
    tx: PostInteractionDbClient = prisma,
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
    tx: PostInteractionDbClient = prisma,
  ) {
    return tx.postInteraction.deleteMany({
      where: payload,
    });
  }
}

export const postInteractionRepository = new PostInteractionRepository();
