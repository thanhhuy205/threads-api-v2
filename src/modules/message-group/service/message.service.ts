import { messageRepository } from "@/modules/message-group/repository/message.repository";
import {
  buildCursorPagination,
  type PaginationResponse,
} from "@/shared/pagination/cursor-pagination";
import { Prisma } from "@prisma/client";

type MessageListRow = Awaited<
  ReturnType<typeof messageRepository.findMessagesByGroupIdAndPublicId>
>[number];

class MessageService {
  createMessage(
    data: {
      messageGroupId: number;
      senderId: string;
      content: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return messageRepository.create(data, tx);
  }

  findMessageByPublicIdAndGroupId(publicId: string, messageGroupId: number) {
    return messageRepository.findByPublicIdAndGroupId(publicId, messageGroupId);
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
      before : true 
    });
  }
}

export const messageService = new MessageService();
