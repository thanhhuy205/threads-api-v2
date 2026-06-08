import { memberMessageGroupRepository } from "@/modules/message-group/repository/member-message-group.repository";
import { messageRepository } from "@/modules/message-group/repository/message.repository";
import {
  buildCursorPagination,
  type PaginationResponse,
} from "@/shared/pagination/cursor-pagination";
import { transactionService } from "@/shared/transaction/transaction.service";
import { Prisma, StatusMessage } from "@prisma/client";

type MessageListRow = Awaited<
  ReturnType<typeof messageRepository.findMessagesByGroupIdAndPublicId>
>[number];

class MessageService {
  async createMessage(
    data: {
      messageGroupId: number;
      senderId: string;
      content: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const createMessage = async (tx: Prisma.TransactionClient) => {
      const result = await messageRepository.create(
        {
          ...data,
          statusMessage: StatusMessage.SENT,
        },
        tx,
      );

      await memberMessageGroupRepository.incrementUnreadCountByGroupId(
        data.messageGroupId,
        data.senderId,
        tx,
      );

      return result;
    };

    const message = tx
      ? await createMessage(tx)
      : await transactionService.doInTransaction(createMessage);

    return message;
  }

  findMessageByPublicIdAndGroupId(publicId: string, messageGroupId: number) {
    return messageRepository.findByPublicIdAndGroupId(publicId, messageGroupId);
  }

  updateMessageStatus({
    messageGroupId,
    messagePublicId,
    statusMessage,
  }: {
    messageGroupId: number;
    messagePublicId: string;
    statusMessage: StatusMessage;
  }) {
    return messageRepository.updateStatusByPublicIdAndGroupId(
      messagePublicId,
      messageGroupId,
      statusMessage,
    );
  }

  async getMessagesByGroupId({
    messageGroupId,
    messagePublicId,
    take,
  }: {
    messageGroupId: number;
    messagePublicId?: string;
    take: number;
  }): Promise<{
    rows: MessageListRow[];
    pagination: PaginationResponse<string | number | null>;
  }> {
    const messages = await messageRepository.findMessagesByGroupIdAndPublicId(
      messageGroupId,
      messagePublicId,
      take,
    );

    return buildCursorPagination({
      rows: messages,
      take,
      getAfter: (item) => item.publicId,
    });
  }

  markMessagesRead(messageGroupId: number, recipientId: string) {
    return memberMessageGroupRepository.updateUnreadCountToZeroByGroupIdAndUserId(
      messageGroupId,
      recipientId,
    )
  }
  updateReadStatus(messageGroupId: number, recipientId: string) {
    return memberMessageGroupRepository.updateMessageStatusReadAll(
      messageGroupId,
      recipientId,
    )
  }

  updateReadStatusByUser(userId: string) {
    return messageRepository.updateMessageStatusByUserId(userId, StatusMessage.READ);
  }
}

export const messageService = new MessageService();
