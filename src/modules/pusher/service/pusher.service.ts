import { pusher } from "@/providers/pusher.provider";

class PusherService {
  async trigger(channel: string, event: string, data: any) {
    return pusher.trigger(channel, event, data);
  }

  authorizeChannel(socketId: string, channelName: string) {
    return pusher.authorizeChannel(socketId, channelName);
  }
}

export const pusherService = new PusherService();
