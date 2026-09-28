import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import type { CreateOrganizationCommand } from '../../../application/commands';
import type { OrganizationRepository } from '../../../application/port/outbound/organization.repository.port';

const organizationSelect = {
  id: true,
  name: true,
  billingId: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class OrganizationRepositoryImpl implements OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.organization.findMany({
      select: organizationSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  create(command: CreateOrganizationCommand) {
    return this.prisma.organization.create({
      data: {
        name: command.name,
        billingId: command.billingId,
      },
      select: organizationSelect,
    });
  }
}
