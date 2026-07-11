import { circleJoinRequestRepository } from "@/modules/circle/repository/circle-join.repository";
import { Prisma, RequestStatus } from "@prisma/client";

class CircleJoinRequestService {
  findPendingRequestByCircleId(circleIds: number[], userId: string) {
    return circleJoinRequestRepository.findPendingRequestByCircleId(
      circleIds,
      userId,
    );
  }

  findJoinRequestByCircleIdAndUserId(circleId: number, userId: string) {
    return circleJoinRequestRepository.findJoinRequestByCircleIdAndUserId(
      circleId,
      userId,
    );
  }

  findPendingRequestByCircleIdAndUserId(
    circleId: number,
    userId: string,
    tx?: Prisma.TransactionClient,
  ) {
    return circleJoinRequestRepository.findPendingRequestByCircleIdAndUserId(
      circleId,
      userId,
      tx as Prisma.TransactionClient,
    );
  }

  findByCircleIdPaginated({
    circleId,
    page,
    limit,
    status,
  }: {
    circleId: number;
    page: number;
    limit: number;
    status?: RequestStatus;
  }) {
    return circleJoinRequestRepository.findByCircleIdPaginated({
      circleId,
      page,
      limit,
      status,
    });
  }

  countByCircleId(circleId: number, status?: RequestStatus) {
    return circleJoinRequestRepository.countByCircleId(circleId, status);
  }

  countPendingByCircleIdWithinRange(circleId: number, from: Date) {
    return circleJoinRequestRepository.countPendingByCircleIdWithinRange(
      circleId,
      from,
    );
  }

  updateStatus(
    id: number,
    status: RequestStatus,
    tx?: Prisma.TransactionClient,
  ) {
    return circleJoinRequestRepository.updateStatus(
      id,
      status,
      tx as Prisma.TransactionClient,
    );
  }

  create(
    data: { circleId: number; userId: string; reason?: string },
    tx?: Prisma.TransactionClient,
  ) {
    return circleJoinRequestRepository.create(
      data,
      tx as Prisma.TransactionClient,
    );
  }
}

export const circleJoinRequestService = new CircleJoinRequestService();
