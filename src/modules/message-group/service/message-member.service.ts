import { ForbiddenException } from "@/errors/error";
import { memberMessageGroupRepository } from "@/modules/message-group/repository/member-message-group.repository";
import {
  buildCursorPagination,
  type PaginationResponse,
} from "@/shared/pagination/cursor-pagination";
import { Prisma } from "@prisma/client";

class MessageMemberService {
  createManyMembers(
    data: {
      messageGroupId: string;
      userId: string;
    }[],
    tx?: Prisma.TransactionClient,
  ) {
    return memberMessageGroupRepository.createMany(data, tx);
  }

  findMemberByGroupAndUser(messageGroupId: string, userId: string) {
    return memberMessageGroupRepository.findByGroupIdAndUserId(
      messageGroupId,
      userId,
    );
  }

  async assertMemberOrThrow(messageGroupId: string, userId: string) {
    const member = await this.findMemberByGroupAndUser(messageGroupId, userId);

    if (!member) {
      throw new ForbiddenException("You are not a member of this message group");
    }
  }

  async getMembersByGroupId({
    messageGroupId,
    after,
    take,
  }: {
    messageGroupId: string;
    after?: string;
    take: number;
  }): Promise<{
    rows: unknown[];
    pagination: PaginationResponse<string | number | null>;
  }> {
    const members = await memberMessageGroupRepository.findByGroupId({
      messageGroupId,
      after,
      take,
    });

    return buildCursorPagination({
      rows: members,
      take,
      getAfter: (member) => member.id,
    });
  }
}

export const messageMemberService = new MessageMemberService();

