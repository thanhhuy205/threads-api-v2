import { BadRequestException, ForbiddenException, UnauthorizedException } from "@/errors/error";
import { pusherChannel } from "@/modules/pusher/channel/pusher-channel";
import { PusherAuthDto } from "@/modules/pusher/dto/pusher-auth.dto";
import { pusherService } from "@/modules/pusher/service/pusher.service";
import type { Request, Response } from "express";

class PusherController {
  async authorizeChannel(req: Request<{}, {}, PusherAuthDto>, res: Response) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException();

    const { channel_name: channelName, socket_id: socketId } = req.body;
    if (!channelName.startsWith("private-")) {
      throw new BadRequestException("Only private channels are supported");
    }

    const supportedChannels = [
      pusherChannel.privateNotification(userId),
      pusherChannel.privateReport(userId),
      pusherChannel.privateUser(userId),
    ];
    if (supportedChannels.includes(channelName)) {
      return res.json(pusherService.authorizeChannel(socketId, channelName));
    }
    throw new ForbiddenException("Unsupported private channel");
  }
}

export const pusherController = new PusherController();
