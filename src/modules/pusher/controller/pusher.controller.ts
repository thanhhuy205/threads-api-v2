import { BadRequestException, ForbiddenException, UnauthorizedException } from "@/errors/error";
import { messageGroupService } from "@/modules/message-group/service/message-group.service";
import { PusherAuthDto } from "@/modules/pusher/dto/pusher-auth.dto";
import { pusherService } from "@/modules/pusher/service/pusher.service";
import type { Request, Response } from "express";

class PusherController {
  async authorizeChannel(req: Request<{}, {}, PusherAuthDto>, res: Response) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException();
    }

    const { channel_name: channelName, socket_id: socketId } = req.body;
    console.log({ channel_name: channelName, socket_id: socketId });
    if (!channelName.startsWith("private-")) {
      throw new BadRequestException("Only private channels are supported");
    }

    if (channelName.startsWith("private-chat-")) {
      const groupPublicId = channelName.replace("private-chat-", "").trim();
      const messageGroup = await messageGroupService.findExistingPrivateGroup(groupPublicId, userId);
      console.log("messageGroup", messageGroup);
      if (!messageGroup) throw new ForbiddenException("Không đủ quyền");
      return res.json(pusherService.authorizeChannel(socketId, channelName));

    }

    if (channelName === `private-user-${userId}`) {
      return res.json(pusherService.authorizeChannel(socketId, channelName));
    }

    throw new ForbiddenException("Unsupported private channel");
  }
}

export const pusherController = new PusherController();
