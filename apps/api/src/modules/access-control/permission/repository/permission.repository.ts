import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/database/prisma.service';
import type { Prisma } from "@prisma/client";

@Injectable()
export class PermissionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByCode(code: string) {
    return this.prismaService.permission.findUnique({
      where: { code },
    });
  }

  async create(data: Prisma.PermissionCreateInput) {
    return this.prismaService.permission.create({
      data,
    });
  }

  async findAll() {
    return this.prismaService.permission.findMany();
  }
}
