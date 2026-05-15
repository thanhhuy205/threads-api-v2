import { messageRepository } from "@/modules/message-group/repository/message.repository";
import {
  buildCursorPagination,
  type PaginationResponse,
} from "@/shared/pagination/cursor-pagination";
import { Prisma } from "@prisma/client";

class MessageService {
  createMessage(
    data: {
      messageGroupId: string;
      senderId: string;
      content: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return messageRepository.create(data, tx);
  }

  findMessageByPublicIdAndGroupId(publicId: string, messageGroupId: string) {
    return messageRepository.findByPublicIdAndGroupId(publicId, messageGroupId);
  }

  async getMessagesByGroupId({
    messageGroupId,
    messagePublicId,
    take,
  }: {
    messageGroupId: string;
    messagePublicId?: string;
    take: number;
  }): Promise<{
    rows: unknown[];
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
}

export const messageService = new MessageService();

