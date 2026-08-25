import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/database/prisma.service';
import type { UserRoleRepository } from '../user-role.repository';

@Injectable()
export class UserRoleRepositoryImpl implements UserRoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByUserId(userId: string) {
    return this.prismaService.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
  }

  async assignRole(userId: string, roleId: string) {
    return this.prismaService.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  async removeRole(userId: string, roleId: string) {
    return this.prismaService.userRole.deleteMany({
      where: {
        userId,
        roleId,
      },
    });
  }
}
