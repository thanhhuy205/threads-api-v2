import prisma from "@/config/prisma";
import { CreateCircleInput } from "@/modules/circle/interfaces/circle-service.interface";
import { buildPagination } from "@/shared/pagination/cursor-pagination";
import {
  Prisma,
  RoleMembership
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
      select: {
        id: true,
        publicId: true,
        description: true,
        name: true,
        createById: true,
        createdAt: true,
        visibility: true,
        _count: {
          select: { circleMembers: true },
        },
        createdBy: {
          select: {
            name: true,
            username: true,
            avatar: true,
          },
        }
      },
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
    });

    return circles;
  }

  async create(data: CreateCircleInput) {
    const result = await prisma.circle.create({
      data: {
        name: data.name,
        description: data.description,
        visibility: data.visibility,
        createById: data.createById,
        circleMembers: {
          create: {
            userId: data.createById,
            role: RoleMembership.OWNER,
          },
        },
        circleEnergies: {
          create: {
            current: 500,
            max: 1000,
            peak: 500,
          },
        },
      },
      select: {
        id: true,
        publicId: true,
        name: true,
        description: true,
        visibility: true,
        createdAt: true,
        updatedAt: true,
        statusPeak: true,
        _count: {
          select: {
            circleMembers: true,

          },
        },
        createdBy: {
          select: {
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return result;
  }

  async findByPublicId(publicId: string) {
    return prisma.circle.findUnique({
      where: {
        publicId,
      },
      select: {
        id: true,
        publicId: true,
        name: true,
        description: true,
        visibility: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            circleMembers: true,
          },
        },
        circleEnergies: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            current: true,
            max: true,
            peak: true,
            exp: true,
            level: true,
            createdAt: true,
          },
        },

      },
    });
  }
}

export const circleRepository = new CircleRepository();
