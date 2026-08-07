import { pusher } from "@/providers/pusher.provider";
import { Injectable } from '@nestjs/common';

@Injectable()
export class PusherService {
  async trigger(channel: string, event: string, data: any) {
    return pusher.trigger(channel, event, data);
  }

  authorizeChannel(socketId: string, channelName: string) {
    return pusher.authorizeChannel(socketId, channelName);
  }
}

// Compatibility export for background workers outside Nest's DI container.
export const pusherService = new PusherService();
