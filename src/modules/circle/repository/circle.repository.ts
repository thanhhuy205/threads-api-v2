import prisma from "@/config/prisma";
import { CreateCircleInput } from "@/modules/circle/interfaces/circle-service.interface";
import { buildPagination } from "@/shared/pagination/cursor-pagination";
import {
  $Enums,
  Circle,
  CircleInvitationStatus,
  Prisma,
  RoleMembership,
} from "@prisma/client";

class CircleRepository implements ICursorPagination<
  Prisma.CircleWhereInput,
  any
> {
  async findAll({
    after,
    take,
    where,
    cursor,
    select,
    orderBy,
  }: {
    after?: string;
    take?: number;
    where?: Prisma.CircleWhereInput;
    cursor?: Prisma.CircleWhereUniqueInput;
    select?: Prisma.CircleSelect;
    orderBy?:
      | Prisma.CircleOrderByWithRelationInput
      | Prisma.CircleOrderByWithRelationInput[];
  }): Promise<any[]> {
    const { currentAfter, currentLimit } = buildPagination({ after, take });

    return prisma.circle.findMany({
      where,
      take: currentLimit + 1,
      skip: currentAfter ? 1 : 0,
      cursor: currentAfter ? cursor : undefined,
      select,
      orderBy: orderBy || { id: "desc" },
    });
  }

  async findCircles({
    after,
    take,
    where,
  }: {
    after?: string;
    take?: number;
    where?: Prisma.CircleWhereInput;
  }) {
    const circles = await this.findAll({
      after,
      take,
      where,
      cursor: after ? { publicId: after } : undefined,
      select: {
        id: true,
        publicId: true,
        name: true,
        createById: true,
        createdAt: true,
        updatedAt: true,
        visibility: true,
        _count: {
          select: { circleMembers: true },
        },
      },
    });

    return circles.map((c) => ({
      id: c.id,
      publicId: c.publicId,
      name: c.name,
      userId: c.createById, // Kept for compatibility if used
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      visibility: c.visibility,
      createById: c.createById,
      memberCount: c._count.circleMembers,
    }));
  }

  async create(data: CreateCircleInput): Promise<Circle> {
    const result = await prisma.circle.create({
      data: {
        name: data.name,
        visibility: data.visibility,
        createById: data.createById,
        circleMembers: {
          create: {
            userId: data.createById,
            role: RoleMembership.ADMIN,
          },
        },
      },
    });

    return result;
  }
}

export const circleRepository = new CircleRepository();
