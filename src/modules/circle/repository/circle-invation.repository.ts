import prisma from "@/config/prisma";
import { SendInvitationInput } from "@/modules/circle/interfaces/send-invitation.interface";
import { buildPagination } from "@/shared/pagination/cursor-pagination";
import { buildPagination as buildOffsetPagination } from "@/shared/pagination/pagination";
import { CircleInvitationStatus, Prisma, RoleMembership } from "@prisma/client";

class CircleInvitationRepository implements ICursorPagination<
  Prisma.CircleInvitationWhereInput,
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
    where?: Prisma.CircleInvitationWhereInput;
    cursor?: Prisma.CircleInvitationWhereUniqueInput;
    select?: Prisma.CircleInvitationSelect;
    orderBy?:
    | Prisma.CircleInvitationOrderByWithRelationInput
    | Prisma.CircleInvitationOrderByWithRelationInput[];
  }): Promise<any[]> {
    const { currentAfter, currentLimit } = buildPagination({ after, take });
    return prisma.circleInvitation.findMany({
      where: where ?? {},
      take: currentLimit + 1,
      skip: currentAfter ? 1 : 0,
      cursor: currentAfter ? cursor : undefined,
      select: select ?? {
        id: true,
        circleId: true,
        userId: true,
        status: true,
        circle: true,
      },
      orderBy: orderBy || { id: "desc" },
    });
  }

  async upsert(
    data: SendInvitationInput,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.circleInvitation.upsert({
      where: {
        circleId_userId: {
          circleId: data.circleId,
          userId: data.userId,
        },
        status: CircleInvitationStatus.REJECTED,
      },
      update: {
        resentCount: {
          increment: 1,
        },
        inviterId: data.inviterId,
        status: CircleInvitationStatus.PENDING,
      },
      create: {
        circleId: data.circleId,
        userId: data.userId,
        inviterId: data.inviterId,
        status: CircleInvitationStatus.PENDING,
      },
    });
  }

  async findInvitationById(circleId: number, userId: string) {
    return prisma.circleInvitation.findFirst({
      where: {
        circleId,
        userId,
        status: CircleInvitationStatus.PENDING,
      },
      select: {
        id: true,
        circleId: true,
        userId: true,
        status: true,
        resentCount: true,
      },
    });
  }

  async findPendingInvitationsByCircleIds(circleIds: number[], userId: string) {
    if (!circleIds.length) {
      return [];
    }

    return prisma.circleInvitation.findMany({
      where: {
        userId,
        status: CircleInvitationStatus.PENDING,
        circleId: {
          in: circleIds,
        },
      },
      select: {
        circleId: true,
      },
    });
  }

  async findInvitations(
    userId: string,
    invitationId?: string,
    take: number = 10,
  ) {
    return this.findAll({
      after: invitationId,
      take,
      where: {
        userId,
      },
    });
  }
  async createInvitation(data: SendInvitationInput, inviterId: string) {
    const invitation = await prisma.circleInvitation.create({
      data: {
        circleId: data.circleId,
        userId: data.userId,
        inviterId,
      },
    });

    return invitation;
  }

  async rejectInvitation(
    circleId: number,
    userId: string,
    tx: Prisma.TransactionClient,
  ) {
    return tx.circleInvitation.update({
      where: {
        circleId_userId: {
          circleId,
          userId,
        },
        status: CircleInvitationStatus.PENDING,
      },
      data: {
        status: CircleInvitationStatus.REJECTED,
      },
    });
  }

  async acceptInvitation(
    circleId: number,
    userId: string,
    tx: Prisma.TransactionClient,
  ) {
    return tx.circleInvitation.update({
      where: {
        circleId_userId: {
          circleId,
          userId,
        },
        status: CircleInvitationStatus.PENDING,
      },
      data: {
        status: CircleInvitationStatus.ACCEPTED,
        resentCount: 0,
      },
    });
  }

  async createJoinRequest(circleId: number, userId: string) {
    return prisma.circleInvitation.create({
      data: {
        circleId,
        userId,
        status: CircleInvitationStatus.PENDING,
        inviterId: userId // For join requests, the inviterId can be set to the userId themselves
      },
    });
  }
  async upsertCircleJoinCancellation(
    circleId: number,
    userId: string,
  ) {
    return prisma.circleInvitation.upsert({
      where: {
        circleId_userId: {
          circleId,
          userId,
        },
        status: CircleInvitationStatus.PENDING,
      },
      update: {
        status: CircleInvitationStatus.CANCELLED,
      },
      create: {
        circleId,
        userId,
        status: CircleInvitationStatus.PENDING,
        inviterId: userId,
      },
    });
  }

  findByCircleIdPaginated({
    circleId,
    page,
    limit,
    type,
  }: {
    circleId: number;
    page: number;
    limit: number;
    type: "invitation" | "join_request";
  }) {
    const { offset, currentLimit } = buildOffsetPagination({ page, limit });
    const where: Prisma.CircleInvitationWhereInput = {
      circleId,
      ...(type === "invitation"
        ? { inviterId: { not: { equals: prisma.circleInvitation.fields.userId } } }
        : { inviterId: { equals: prisma.circleInvitation.fields.userId } }),
    };

    return prisma.circleInvitation.findMany({
      where,
      skip: offset,
      take: currentLimit,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: {
        id: true,
        circleId: true,
        userId: true,
        inviterId: true,
        status: true,
        resentCount: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            username: true,
            avatar: true,
            bio: true,
          },
        },
        inviter: {
          select: {
            name: true,
            username: true,
            avatar: true,
            bio: true,
          },
        },
      },
    });
  }

  countByCircleId({
    circleId,
    type,
  }: {
    circleId: number;
    type: "invitation" | "join_request";
  }) {
    const where: Prisma.CircleInvitationWhereInput = {
      circleId,
      ...(type === "invitation"
        ? { inviterId: { not: { equals: prisma.circleInvitation.fields.userId } } }
        : { inviterId: { equals: prisma.circleInvitation.fields.userId } }),
    };

    return prisma.circleInvitation.count({ where });
  }

  async findInvitationByEmail(circleId: number, email: string) {
    return prisma.circleInvitation.findFirst({
      where: {
        circleId,
        email,
      },
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      select: {
        id: true,
        circleId: true,
        userId: true,
        email: true,
        status: true,
        resentCount: true,
      },
    });
  }

  async findInvitationByUserId(circleId: number, userId: string) {
    return prisma.circleInvitation.findFirst({
      where: {
        circleId,
        userId,
      },
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      select: {
        id: true,
        circleId: true,
        userId: true,
        email: true,
        status: true,
        resentCount: true,
      },
    });
  }

  async upsertAdminInvitation(
    payload: {
      existingInvitationId?: number;
      circleId: number;
      userId?: string;
      email: string;
      inviterId: string;
      isUser: boolean;
      role: RoleMembership;
      description?: string;
      tokenHash: string;
    },
    tx: Prisma.TransactionClient = prisma,
  ) {
    if (payload.existingInvitationId) {
      return tx.circleInvitation.update({
        where: {
          id: payload.existingInvitationId,
        },
        data: {
          userId: payload.userId,
          email: payload.email,
          inviterId: payload.inviterId,
          isUser: payload.isUser,
          role: payload.role,
          description: payload.description,
          tokenHash: payload.tokenHash,
          status: CircleInvitationStatus.PENDING,
          resentCount: {
            increment: 1,
          },
        },
      });
    }

    return tx.circleInvitation.create({
      data: {
        circleId: payload.circleId,
        userId: payload.userId,
        email: payload.email,
        inviterId: payload.inviterId,
        isUser: payload.isUser,
        role: payload.role,
        description: payload.description,
        tokenHash: payload.tokenHash,
        status: CircleInvitationStatus.PENDING,
      },
    });
  }
}

export const circleInvitationRepository = new CircleInvitationRepository();
