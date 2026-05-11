import { CreateCircleInput } from "@/modules/circle/interfaces/circle-service.interface";
import { ResponseInvitationInput } from "@/modules/circle/interfaces/response-invitation.dto";
import { SendInvitationInput } from "@/modules/circle/interfaces/send-invitation.interface";
import { circleInvitationRepository } from "@/modules/circle/repository/circle-invation.repository";
import { buildCursorPagination } from "@/shared/pagination/cursor-pagination";
import { RoleMembership, Visibility } from "@prisma/client";
import { circleMemberRepository } from "../repository/circle-member.repository";
import { circleRepository } from "../repository/circle.repository";
import { transactionService } from "@/shared/transaction/transaction.service";

class CircleService {
  async getCircle(publicId?: string, take: number = 10) {
    const circles = await circleRepository.findCircles({
      after: publicId,
      take,
      where: {
        visibility: {
          not: Visibility.CIRCLE,
        },
      },
    });

    return buildCursorPagination({
      rows: circles,
      take,
      getAfter: (item) => item.publicId,
    });
  }

  async createCircle(data: CreateCircleInput) {
    const newCircle = await circleRepository.create({
      name: data.name,
      visibility: data.visibility,
      createById: data.createById,
    });

    return newCircle;
  }

  async sendInvitation(data: SendInvitationInput) {
    const circle = await circleMemberRepository.findByCircleId(
      data.circleId,
      data.userId,
    );
    if (circle.length > 0) {
      throw new Error(
        `User ${data.userId} is already a member of circle ${data.circleId}`,
      );
    }

    const userRole = await circleMemberRepository.findRoleByCircleId(
      data.circleId,
      data.inviterId,
    );
    if (!userRole) {
      throw new Error(
        `User ${data.inviterId} is not a member of circle ${data.circleId}`,
      );
    }
    if (
      userRole.role !== RoleMembership.ADMIN &&
      userRole.role !== RoleMembership.OWNER
    ) {
      throw new Error(
        `User ${data.inviterId} is not an admin or owner of circle ${data.circleId}`,
      );
    }
    const existingInvitation =
      await circleInvitationRepository.findInvitationById(
        data.circleId,
        data.userId,
      );
    if (existingInvitation) {
      throw new Error(
        `User ${data.userId} has already been invited to join circle ${data.circleId}`,
      );
    }

    return transactionService.doInTransaction(async (tx) => {
      await circleInvitationRepository.create(
        {
          circleId: data.circleId,
          userId: data.userId,
          inviterId: data.inviterId,
        },
        tx,
      );
    });
  }

  async acceptInvitation(data: ResponseInvitationInput) {
    const circle = await circleMemberRepository.findByCircleId(
      data.circleId,
      data.userId,
    );
    if (circle.length > 0) {
      throw new Error(
        `User ${data.userId} is already a member of circle ${data.circleId}`,
      );
    }
    const invitation = await circleRepository.findInvitation(
      data.circleId,
      data.userId,
    );
    if (!invitation) {
      throw new Error(
        `No invitation found for user ${data.userId} to join circle ${data.circleId}`,
      );
    }
    return await transactionService.doInTransaction(async (tx) => {
      await circleRepository.acceptInvitation(data.circleId, data.userId, tx);
      return await circleMemberRepository.create(
        {
          circleId: data.circleId,
          userId: data.userId,
        },
        tx,
      );
    });
  }

  async getRequestInvitation(
    userId: string,
    invitationId?: string,
    take: number = 10,
  ) {
    const invitations = await circleInvitationRepository.findInvitations(
      userId,
      invitationId,
      take,
    );

    return buildCursorPagination({
      rows: invitations,
      take,
      getAfter: (item) => String(item.id),
    });
  }
}
export const circleService = new CircleService();
