import { UnauthorizedException } from "@/errors/error";
import { CreateMessageDto } from "@/modules/message-group/dto/create-message.dto";
import { CreateMessageGroupDto } from "@/modules/message-group/dto/create-message-group.dto";
import { messageGroupService } from "@/modules/message-group/service/message-group.service";
import { getPagination } from "@/shared/pagination/cursor-pagination";
import type { Request, Response } from "express";

class MessageGroupController {
  async createMessageGroup(
    req: Request<{}, {}, CreateMessageGroupDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException();
    }

    const messageGroup = await messageGroupService.createMessageGroup(
      req.body,
      userId,
    );

    return res.success(201, "Message group created successfully", messageGroup);
  }

  async sendMessage(
    req: Request<{ publicId: string }, {}, CreateMessageDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException();
    }

    const message = await messageGroupService.sendMessage(
      req.params.publicId,
      userId,
      req.body.content,
    );

    return res.success(201, "Message sent successfully", message);
  }

  async getMessages(req: Request<{ publicId: string }>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException();
    }

    const { after: messagePublicId, take } = getPagination(req);
    const messages = await messageGroupService.getMessages({
      groupPublicId: req.params.publicId,
      messagePublicId: messagePublicId ?? undefined,
      userId,
      take,
    });

    return res.paginate(messages);
  }
}

export const messageGroupController = new MessageGroupController();
