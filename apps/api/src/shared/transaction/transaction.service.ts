import { Injectable } from '@nestjs/common';
import { Prisma } from "@prisma/client";
import { PrismaService } from '@libs/database';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async doInTransaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(callback);
  }
}
