import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

class TransactionService {
  async doInTransaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return prisma.$transaction(callback);
  }
}
export const transactionService = new TransactionService();
