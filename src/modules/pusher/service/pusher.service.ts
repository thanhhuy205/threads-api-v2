import { pusher } from "@/providers/pusher.provider";

class PusherService {
  async trigger(channel: string, event: string, data: any) {
    return pusher.trigger(channel, event, data);
  }
}

export const pusherService = new PusherService();
