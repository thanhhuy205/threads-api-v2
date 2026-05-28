import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

type UserKarmaDbClient = Prisma.TransactionClient | typeof prisma;

class UserKarmaRepository {
  async getTotalKarmaByUserId(
    userId: string,
    tx: UserKarmaDbClient = prisma,
  ) {
    const existing = await tx.userKarma.findUnique({
      where: {
        userId,
      },
      select: {
        karma: true,
      },
    });
    return existing?.karma ?? null;
  }

  async createDefaultKarmaByUserId(
    userId: string,
    tx: UserKarmaDbClient = prisma,
  ) {
    const created = await tx.userKarma.create({
      data: {
        userId,
        karma: 1,
      },
      select: {
        karma: true,
      },
    });

    return created.karma;
  }

  async incrementKarma(
    userId: string,
    amount: number,
    tx: UserKarmaDbClient = prisma,
  ) {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error("Karma increment amount must be a positive integer");
    }

    const result = await tx.userKarma.upsert({
      where: {
        userId,
      },
      update: {
        karma: {
          increment: amount,
        },
      },
      create: {
        userId,
        karma: 1 + amount,
      },
      select: {
        karma: true,
      },
    });

    return result.karma;
  }

  async decrementKarma(
    userId: string,
    amount: number,
    tx: UserKarmaDbClient = prisma,
  ) {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error("Karma decrement amount must be a positive integer");
    }

    const updated = await tx.userKarma.updateMany({
      where: {
        userId,
        karma: {
          gte: amount,
        },
      },
      data: {
        karma: {
          decrement: amount,
        },
      },
    });

    if (updated.count === 0) {
      return null;
    }

    const row = await tx.userKarma.findUnique({
      where: {
        userId,
      },
      select: {
        karma: true,
      },
    });

    return row?.karma ?? null;
  }
}

export const userKarmaRepository = new UserKarmaRepository();
