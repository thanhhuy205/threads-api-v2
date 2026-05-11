import prisma from "@/config/prisma";
import { CreateCircleInput } from "@/modules/circle/interfaces/circle-service.interface";
import { ResponseInvitationInput } from "@/modules/circle/interfaces/response-invitation.dto";
import { SendInvitationInput } from "@/modules/circle/interfaces/send-invitation.interface";
import { circleInvitationRepository } from "@/modules/circle/repository/circle-invation.repository";
import { buildCursorPagination } from "@/shared/pagination/cursor-pagination";
import { RoleMembership, Visibility } from "@prisma/client";
import { circleMemberRepository } from "../repository/circle-member.repository";
import { circleRepository } from "../repository/circle.repository";

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
    if (
      userRole &&
      (userRole.role === RoleMembership.ADMIN ||
        userRole.role === RoleMembership.OWNER)
    ) {
    } else {
      throw new Error(
        `User ${data.inviterId} is not an admin or owner of circle ${data.circleId}`,
      );
    }
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
    return prisma.$transaction(async (prisma) => {
      await circleRepository.acceptInvitation(
        data.circleId,
        data.userId,
        prisma,
      );
      await circleMemberRepository.create(
        {
          circleId: data.circleId,
          userId: data.userId,
        },
        prisma,
      );
    });
  }

  async getRequestInvitation(
    userId: string,
    invitationId?: string,
    take: number = 10,
  ) {
    const invitations = await circleInvitationRepository.findInvitations({
      after: invitationId,
      take,
      where: {
        userId,
      },
    });

    return buildCursorPagination({
      rows: invitations,
      take,
      getAfter: (item) => String(item.id),
    });
  }
}
export const circleService = new CircleService();
