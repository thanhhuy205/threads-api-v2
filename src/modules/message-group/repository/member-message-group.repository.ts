import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

class MemberMessageGroupRepository {
  createMany(
    data: {
      messageGroupId: string;
      userId: string;
    }[],
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.memberMessageGroup.createMany({
      data,
      skipDuplicates: true,
    });
  }

  findByGroupIdAndUserId(messageGroupId: string, userId: string) {
    return prisma.memberMessageGroup.findUnique({
      where: {
        messageGroupId_userId: {
          messageGroupId,
          userId,
        },
      },
    });
  }
}

export const memberMessageGroupRepository =
  new MemberMessageGroupRepository();
