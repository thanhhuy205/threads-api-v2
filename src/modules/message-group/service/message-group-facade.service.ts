import { PUSHER_EVENT } from "@/constants/pusher";
import { BadRequestException, NotFoundException } from "@/errors/error";
import { baseLogger } from "@/middlewares/logger";
import { CreateMessageGroupInput } from "@/modules/message-group/interfaces/create-message-group-input";
import {
  mapMessageGroupMemberResponse,
  mapMessageGroupResponse,
  mapMessageResponse,
} from "@/modules/message-group/mapper/message-group.mapper";
import { notificationService } from "@/modules/notification-group/service/notification.service";
import { pusherChannel } from "@/modules/pusher/channel/pusher-channel";
import { pusherService } from "@/modules/pusher/service/pusher.service";
import { userService } from "@/modules/user/service/user.service";
import { transactionService } from "@/shared/transaction/transaction.service";
import { GroupType, Prisma } from "@prisma/client";
import { messageGroupService } from "./message-group.service";
import { messageMemberService } from "./message-member.service";
import { messageService } from "./message.service";

class MessageGroupFacadeService {
  async createMessageGroup(data: CreateMessageGroupInput, creatorId: string) {
    const usernames = [...new Set(data.members.map((username) => username.trim()))];
    const users = await userService.findUsersByUsernames(usernames);

    const memberIds = [...new Set([creatorId, ...users.map((user) => user.id)])];

    this.validateMemberCount(data.type, memberIds.length);

    const messageGroup = await transactionService.doInTransaction(async (tx) => {
      const group = await messageGroupService.createGroup(
        {
          groupType: data.type,
          createdById: creatorId,
          lastMessageAt: new Date(),
        },
        tx,
      );

      await messageMemberService.createManyMembers(
        memberIds.map((userId) => ({
          messageGroupId: group.id,
          userId,
        })),
        tx,
      );

      return group;
    });

    const group = await this.findMessageGroupOrThrow(messageGroup.publicId);

    return mapMessageGroupResponse(group, creatorId);
  }

  async createPrivateMessageGroup(
    targetUserId: string,
    creatorId: string,
    tx: Prisma.TransactionClient,
  ) {
    const existingGroup = await messageGroupService.findPrivateGroupByUserIds(
      [creatorId, targetUserId],
      tx,
    );

    if (existingGroup) {
      return existingGroup;
    }

    const group = await messageGroupService.createGroup(
      {
        groupType: GroupType.PRIVATE,
        createdById: creatorId,
        lastMessageAt: new Date(),
      },
      tx,
    );

    await messageMemberService.createManyMembers(
      [
        { messageGroupId: group.id, userId: creatorId },
        { messageGroupId: group.id, userId: targetUserId },
      ],
      tx,
    );

    return group;
  }

  async sendMessage(
    groupPublicId: string,
    senderId: string,
    content: string,
    clientMessageId: string,
  ) {
    const messageGroup = await this.findMessageGroupOrThrow(groupPublicId);
    const sender = await messageMemberService.assertMemberOrThrow(messageGroup.id, senderId);

    const messagePayload = await transactionService.doInTransaction(async (tx) => {
      const message = await messageService.createMessage(
        {
          messageGroupId: messageGroup.id,
          senderId,
          content,
        },
        tx,
      );

      await messageGroupService.updateLastMessageAt(messageGroup.id, new Date(), tx);

      return mapMessageResponse(message);
    });
    const members = await messageMemberService.findMembersByGroupId(messageGroup.id);
    const recipientIds = members.filter((member) => member.user.id !== senderId);

    try {
      await Promise.all([
        pusherService.trigger(
          pusherChannel.privateChat(messageGroup.publicId),
          PUSHER_EVENT.MESSAGE_NEW,
          {
            groupPublicId: messageGroup.publicId,
            message: {
              ...messagePayload,
              clientMessageId,
              createdAt: messagePayload.createdAt.toISOString(),
            },
          },
        ),

        notificationService.sendMessageNotification({
          groupPublicId: messageGroup.publicId,
          senderId,
          recipientId: recipientIds[0].user.id,
          content,
          name: sender.user.username,
          avatar: sender.user.avatar ?? "",
        }),
      ]);
    } catch (error) {
      baseLogger.error("Failed to trigger chat realtime event: %o", JSON.stringify(error));
    }


    return messagePayload;
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
    await messageMemberService.assertMemberOrThrow(messageGroup.id, userId);

    if (messagePublicId) {
      const message = await messageService.findMessageByPublicIdAndGroupId(
        messagePublicId,
        messageGroup.id,
      );

      if (!message) {
        throw new NotFoundException(`Message ${messagePublicId} not found`);
      }
    }

    const messages = await messageService.getMessagesByGroupId({
      messageGroupId: messageGroup.id,
      messagePublicId: messagePublicId ?? undefined,
      take,
    });

    await messageService.markMessagesRead(messageGroup.id, userId);

    return {
      ...messages,
      rows: messages.rows.map((message) => mapMessageResponse(message)),
    };
  }

  async getMessageGroups({
    userId,
    after,
    take,
  }: {
    userId: string;
    after?: string;
    take: number;
  }) {
    const groups = await messageGroupService.getMessageGroupsByUserId({
      userId,
      after,
      take,
    });

    return {
      ...groups,
      rows: groups.rows.map((group) => mapMessageGroupResponse(group, userId)),
    };
  }

  async getGroupMembers({
    groupPublicId,
    userId,
    after,
    take,
  }: {
    groupPublicId: string;
    userId: string;
    after?: string;
    take: number;
  }) {
    const messageGroup = await this.findMessageGroupOrThrow(groupPublicId);
    await messageMemberService.assertMemberOrThrow(messageGroup.id, userId);

    const members = await messageMemberService.getMembersByGroupId({
      messageGroupId: messageGroup.id,
      after,
      take,
    });

    return {
      ...members,
      rows: members.rows.map((member) => mapMessageGroupMemberResponse(member)),
    };
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
    baseLogger.info("Finding message group with publicId: %s", publicId);
    const messageGroup = await messageGroupService.findByPublicId(publicId);
    baseLogger.info("Found message group with publicId: %s, result: %o", publicId, messageGroup);
    if (!messageGroup) {
      throw new NotFoundException(`Message group ${publicId} not found`);
    }

    return messageGroup;
  }
}

export const messageGroupFacadeService = new MessageGroupFacadeService();
