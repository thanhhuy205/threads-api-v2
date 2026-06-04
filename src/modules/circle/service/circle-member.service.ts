import { circleMemberRepository } from "@/modules/circle/repository/circle-member.repository";
import { Prisma } from "@prisma/client";

class CircleMemberService {
  findByCircleId(circleId: number, userId: string) {
    return circleMemberRepository.findByCircleId(circleId, userId);
  }

  findRoleByCircleId(circleId: number, userId: string) {
    return circleMemberRepository.findRoleByCircleId(circleId, userId);
  }

  findMembershipsByCircleIds(circleIds: number[], userId: string) {
    return circleMemberRepository.findMembershipsByCircleIds(circleIds, userId);
  }

  findMembersByCircleIdAndUserId(
    circleId: number,
    userId: string | undefined,
    take: number,
  ) {
    return circleMemberRepository.findMembersByCircleIdAndUserId(
      circleId,
      userId,
      take,
    );
  }

  findMembersByCircleIdPaginated({
    circleId,
    page,
    limit,
  }: {
    circleId: number;
    page: number;
    limit: number;
  }) {
    return circleMemberRepository.findMembersByCircleIdPaginated({
      circleId,
      page,
      limit,
    });
  }

  countMembersByCircleId(circleId: number) {
    return circleMemberRepository.countMembersByCircleId(circleId);
  }

  countMembersByCircleIdWithinRange(circleId: number, from: Date) {
    return circleMemberRepository.countMembersByCircleIdWithinRange(
      circleId,
      from,
    );
  }

  create(
    data: { circleId: number; userId: string },
    tx?: Prisma.TransactionClient,
  ) {
    return circleMemberRepository.create(data, tx as Prisma.TransactionClient);
  }

  kickMemberByCircleIdAndUserId(
    circleId: number,
    userId: string,
    tx?: Prisma.TransactionClient,
  ) {
    return circleMemberRepository.kickMemberByCircleIdAndUserId(
      circleId,
      userId,
      tx as Prisma.TransactionClient,
    );
  }
}

export const circleMemberService = new CircleMemberService();
