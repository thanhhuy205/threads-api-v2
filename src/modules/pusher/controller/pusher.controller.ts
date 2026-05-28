import { BadRequestException, ForbiddenException, UnauthorizedException } from "@/errors/error";
import { messageGroupService } from "@/modules/message-group/service/message-group.service";
import { messageMemberService } from "@/modules/message-group/service/message-member.service";
import { pusherChannel } from "@/modules/pusher/channel/pusher-channel";
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

    if (!channelName.startsWith("private-")) {
      throw new BadRequestException("Only private channels are supported");
    }

    if (pusherChannel.isPrivateChatChannel(channelName)) {
      const groupPublicId = pusherChannel.extractPrivateChatPublicId(channelName);

      if (!groupPublicId) {
        throw new BadRequestException("Invalid private chat channel");
      }

      const messageGroup = await messageGroupService.findByPublicId(groupPublicId);

      if (!messageGroup) {
        throw new ForbiddenException("Channel is not accessible");
      }

      await messageMemberService.assertMemberOrThrow(messageGroup.id, userId);
      return res.json(pusherService.authorizeChannel(socketId, channelName));
    }

    if (channelName === pusherChannel.privateNotification(userId)) {
      return res.json(pusherService.authorizeChannel(socketId, channelName));
    }

    if (channelName === pusherChannel.privateNotificationMessage(userId)) {
      return res.json(pusherService.authorizeChannel(socketId, channelName));
    }

    if (channelName === pusherChannel.privateReport(userId)) {
      return res.json(pusherService.authorizeChannel(socketId, channelName));
    }


    if (channelName === pusherChannel.privateUser(userId)) {
      return res.json(pusherService.authorizeChannel(socketId, channelName));
    }

    throw new ForbiddenException("Unsupported private channel");
  }
}

export const pusherController = new PusherController();
