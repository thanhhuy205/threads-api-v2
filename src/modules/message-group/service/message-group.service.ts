import { messageGroupRepository } from "@/modules/message-group/repository/message-group.repository";
import { messageService } from "@/modules/message-group/service/message.service";
import {
  buildCursorPagination,
  type PaginationResponse,
} from "@/shared/pagination/cursor-pagination";
import { GroupType, Prisma } from "@prisma/client";

type MessageGroupListRow = Awaited<
  ReturnType<typeof messageGroupRepository.findByUserId>
>[number];

class MessageGroupService {
  createGroup(
    data: {
      groupType: GroupType;
      createdById: string;
      lastMessageAt: Date;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return messageGroupRepository.create(data, tx);
  }

  findByPublicId(publicId: string, tx?: Prisma.TransactionClient) {
    return messageGroupRepository.findByPublicId(publicId, tx);
  }

  updateLastMessageAt(
    id: number,
    lastMessageAt: Date,
    tx?: Prisma.TransactionClient,
  ) {
    return messageGroupRepository.updateLastMessageAt(id, lastMessageAt, tx);
  }

  findPrivateGroupByUserIds(userIds: string[], tx?: Prisma.TransactionClient) {
    return messageGroupRepository.findPrivateGroupByUserIds(userIds, tx);
  }

  async getMessageGroupsByUserId({
    userId,
    after,
    take,
  }: {
    userId: string;
    after?: string;
    take: number;
  }): Promise<{
    rows: MessageGroupListRow[];
    pagination: PaginationResponse<string | number | null>;
  }> {
    const groups = await messageGroupRepository.findByUserId({
      userId,
      after,
      take,
      groupTypes: [GroupType.PRIVATE, GroupType.CROWD],
    });

    return buildCursorPagination({
      rows: groups,
      take,
      getAfter: (group) => group.publicId,
    });
  }

  async countUnreadGroupsByUserId(userId: string) {
    const count = await messageGroupRepository.countUnreadGroupsByUserId(userId);
    if (count > 0) {
      await messageService.updateReadStatusByUser(userId);
    }
    return count;
  }

  async findExistingPrivateGroup(groupPublicId: string, userId: string, tx?: Prisma.TransactionClient) {
    return messageGroupRepository.findUserExistingPrivateGroup(userId, groupPublicId, tx);
  }


}

export const messageGroupService = new MessageGroupService();
