import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

type CreateCprSessionInput = {
  circleId: string;
  activatedBy: string;
  expiresAt: Date;
  resolved?: boolean;
  success?: boolean | null;
};

class CprSessionRepository {
  async create(
    data: CreateCprSessionInput,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.cprSession.create({
      data: {
        circleId: data.circleId,
        activatedBy: data.activatedBy,
        expiresAt: data.expiresAt,
        resolved: data.resolved,
        success: data.success,
      },
    });
  }
}

export const cprSessionRepository = new CprSessionRepository();
