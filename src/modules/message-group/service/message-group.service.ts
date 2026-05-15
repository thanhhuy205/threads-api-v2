import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@/errors/error";
import { CreateMessageGroupInput } from "@/modules/message-group/interfaces/create-message-group-input";
import { memberMessageGroupRepository } from "@/modules/message-group/repository/member-message-group.repository";
import { messageGroupRepository } from "@/modules/message-group/repository/message-group.repository";
import { messageRepository } from "@/modules/message-group/repository/message.repository";
import { userService } from "@/modules/user/service/user.service";
import { buildCursorPagination } from "@/shared/pagination/cursor-pagination";
import { transactionService } from "@/shared/transaction/transaction.service";
import { GroupType } from "@prisma/client";

class MessageGroupService {
  async createMessageGroup(data: CreateMessageGroupInput, creatorId: string) {
    const usernames = [...new Set(data.members.map((username) => username.trim()))];
    const users = await userService.findUsersByUsernames(usernames);

    const memberIds = [...new Set([creatorId, ...users.map((user) => user.id)])];

    this.validateMemberCount(data.type, memberIds.length);

    const messageGroup = await transactionService.doInTransaction(async (tx) => {
      const group = await messageGroupRepository.create(
        {
          groupType: data.type,
          createdById: creatorId,
          lastMessageAt: new Date(),
        },
        tx,
      );

      await memberMessageGroupRepository.createMany(
        memberIds.map((userId) => ({
          messageGroupId: group.id,
          userId,
        })),
        tx,
      );

      return group;
    });

    return messageGroupRepository.findByPublicId(messageGroup.publicId);
  }


  async sendMessage(
    groupPublicId: string,
    senderId: string,
    content: string,
  ) {
    const messageGroup = await this.findMessageGroupOrThrow(groupPublicId);
    await this.assertMember(messageGroup.id, senderId);

    return transactionService.doInTransaction(async (tx) => {
      const message = await messageRepository.create(
        {
          messageGroupId: messageGroup.id,
          senderId,
          content,
        },
        tx,
      );

      await messageGroupRepository.updateLastMessageAt(
        messageGroup.id,
        new Date(),
        tx,
      );

      return message;
    });
  }

  async getMessages({
    groupPublicId,
    messagePublicId,
    userId,
    take,
  }: {
    groupPublicId: string;
    messagePublicId?: string;
    userId: string;
    take: number;
  }) {
    const messageGroup = await this.findMessageGroupOrThrow(groupPublicId);
    await this.assertMember(messageGroup.id, userId);

    if (messagePublicId) {
      const message = await messageRepository.findByPublicIdAndGroupId(
        messagePublicId,
        messageGroup.id,
      );

      if (!message) {
        throw new NotFoundException(`Message ${messagePublicId} not found`);
      }
    }

    const messages = await messageRepository.findMessagesByGroupIdAndPublicId(
      messageGroup.id,
      messagePublicId,
      take,
    );

    return buildCursorPagination({
      rows: messages,
      take,
      getAfter: (item) => item.publicId,
    });
  }

  private validateMemberCount(type: GroupType, memberCount: number) {
    if (type === GroupType.PRIVATE && memberCount !== 2) {
      throw new BadRequestException("PRIVATE message group must have 2 members");
    }

    if (type === GroupType.CROWD && memberCount < 3) {
      throw new BadRequestException(
        "CROWD message group must have at least 3 members",
      );
    }
  }

  private async findMessageGroupOrThrow(publicId: string) {
    const messageGroup = await messageGroupRepository.findByPublicId(publicId);

    if (!messageGroup) {
      throw new NotFoundException(`Message group ${publicId} not found`);
    }

    return messageGroup;
  }

  private async assertMember(messageGroupId: string, userId: string) {
    const member = await memberMessageGroupRepository.findByGroupIdAndUserId(
      messageGroupId,
      userId,
    );

    if (!member) {
      throw new ForbiddenException("You are not a member of this message group");
    }
  }
}

export const messageGroupService = new MessageGroupService();
