import { UnauthorizedException } from "@/errors/error";
import { CreateMessageGroupDto } from "@/modules/message-group/dto/create-message-group.dto";
import { CreateMessageDto } from "@/modules/message-group/dto/create-message.dto";
import { messageGroupFacadeService } from "@/modules/message-group/service/message-group-facade.service";
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

    const messageGroup = await messageGroupFacadeService.createMessageGroup(
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

    const message = await messageGroupFacadeService.sendMessage(
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
    const messages = await messageGroupFacadeService.getMessages({
      groupPublicId: req.params.publicId,
      messagePublicId: messagePublicId ?? undefined,
      userId,
      take,
    });

    return res.paginate(messages);
  }

  async getMessageGroups(req: Request, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException();
    }

    const { after, take } = getPagination(req);
    const groups = await messageGroupFacadeService.getMessageGroups({
      userId,
      after: after ?? undefined,
      take,
    });

    return res.paginate(groups);
  }

  async getGroupMembers(req: Request<{ publicId: string }>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException();
    }

    const { after, take } = getPagination(req);
    const members = await messageGroupFacadeService.getGroupMembers({
      groupPublicId: req.params.publicId,
      userId,
      after: after ?? undefined,
      take,
    });

    return res.paginate(members);
  }
}

export const messageGroupController = new MessageGroupController();
