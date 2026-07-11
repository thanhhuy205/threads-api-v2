import { circleInvitationRepository } from "@/modules/circle/repository/circle-invation.repository";
import { Prisma, RoleMembership } from "@prisma/client";

class CircleInvitationService {
  findPendingInvitationByCircleIdAndUserId(circleId: number, userId: string) {
    return circleInvitationRepository.findInvitationById(circleId, userId);
  }

  findPendingInvitationsByCircleIds(circleIds: number[], userId: string) {
    return circleInvitationRepository.findPendingInvitationsByCircleIds(
      circleIds,
      userId,
    );
  }

  findByCircleIdPaginated({
    circleId,
    page,
    limit,
  }: {
    circleId: number;
    page: number;
    limit: number;
  }) {
    return circleInvitationRepository.findByCircleIdPaginated({
      circleId,
      page,
      limit,
    });
  }

  countByCircleId(circleId: number) {
    return circleInvitationRepository.countByCircleId(circleId);
  }

  countManageInvitationStatsByCircleId(circleId: number) {
    return circleInvitationRepository.countManageInvitationStatsByCircleId(
      circleId,
    );
  }

  findManageInvitationByIdAndCircleId(id: number, circleId: number) {
    return circleInvitationRepository.findManageInvitationByIdAndCircleId(
      id,
      circleId,
    );
  }

  updateResendById(
    {
      id,
      inviterId,
      tokenHash,
    }: {
      id: number;
      inviterId: string;
      tokenHash?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return circleInvitationRepository.updateResendById(
      {
        id,
        inviterId,
        tokenHash,
      },
      tx as Prisma.TransactionClient,
    );
  }

  findInvitationById(circleId: number, userId: string) {
    return circleInvitationRepository.findInvitationById(circleId, userId);
  }

  upsert(
    data: {
      circleId: number;
      userId: string;
      inviterId: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return circleInvitationRepository.upsert(
      data,
      tx as Prisma.TransactionClient,
    );
  }

  rejectInvitation(
    circleId: number,
    userId: string,
    tx?: Prisma.TransactionClient,
  ) {
    return circleInvitationRepository.rejectInvitation(
      circleId,
      userId,
      tx as Prisma.TransactionClient,
    );
  }

  acceptInvitation(
    circleId: number,
    userId: string,
    tx?: Prisma.TransactionClient,
  ) {
    return circleInvitationRepository.acceptInvitation(
      circleId,
      userId,
      tx as Prisma.TransactionClient,
    );
  }

  findInvitations(userId: string, invitationId?: string, take: number = 10) {
    return circleInvitationRepository.findInvitations(
      userId,
      invitationId,
      take,
    );
  }

  findLatestInvitationByCircleIdAndUserId(circleId: number, userId: string) {
    return circleInvitationRepository.findLatestInvitationByCircleIdAndUserId(
      circleId,
      userId,
    );
  }

  upsertAdminInvitation(
    payload: {
      existingInvitationId?: number;
      circleId: number;
      userId: string;
      inviterId: string;
      isUser: boolean;
      role: RoleMembership;
      description?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return circleInvitationRepository.upsertAdminInvitation(
      payload,
      tx as Prisma.TransactionClient,
    );
  }

  countPendingInvitationsByCircleIdWithinRange(circleId: number, from: Date) {
    return circleInvitationRepository.countPendingInvitationsByCircleIdWithinRange(
      circleId,
      from,
    );
  }
}

export const circleInvitationService = new CircleInvitationService();
