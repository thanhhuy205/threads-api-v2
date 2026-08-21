import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/database/prisma.service';
import type { RoleRepository } from '../role.repository';

@Injectable()
export class RoleRepositoryImpl implements RoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.role.findMany();
  }
  async findByName(name: string) {
    return this.prismaService.role.findUnique({
      where: { name },
    });
  }
}
