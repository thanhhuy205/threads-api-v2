import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

type CreateUserKarmaInput = {
  userId: string;
  karma?: number;
};

class UserKarmaRepository {
  async create(
    data: CreateUserKarmaInput,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.userKarma.create({
      data: {
        userId: data.userId,
        karma: data.karma,
      },
    });
  }
}

export const userKarmaRepository = new UserKarmaRepository();
