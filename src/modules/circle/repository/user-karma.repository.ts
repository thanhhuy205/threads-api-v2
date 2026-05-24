import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

type CreateUserKarmaInput = {
  userId: string;
  karma?: number;
};

class UserKarmaRepository {
  async create(
    data: CreateUserKarmaInput,
    tx: Prisma.TransactionClient | typeof prisma = prisma,
  ) {
    return tx.userKarma.create({
      data: {
        userId: data.userId,
        karma: data.karma,
      },
      select: {
        karma: true,
      },
    });
  }
}

export const userKarmaRepository = new UserKarmaRepository();
