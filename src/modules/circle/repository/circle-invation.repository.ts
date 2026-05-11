import prisma from "@/config/prisma";
import { SendInvitationInput } from "@/modules/circle/interfaces/send-invitation.interface";
import { buildPagination } from "@/shared/pagination/cursor-pagination";
import { CircleInvitationStatus, Prisma } from "@prisma/client";

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

  async create(
    data: SendInvitationInput,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.circleInvitation.create({
      data: {
        circleId: data.circleId,
        userId: data.userId,
        inviterId: data.inviterId,
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
}
export const circleInvitationRepository = new CircleInvitationRepository();
