import { PUSHER_EVENT } from "@/constants/pusher";
import type { WelcomeNotificationPayload } from "@/modules/notification/interface/notification.types";
import { pusherChannel } from "@/modules/pusher/pusher-channel";
import { pusherService } from "@/modules/pusher/service/pusher.service";

class NotificationService {
  async createWelcome() {
    const payload: WelcomeNotificationPayload = {
      title: "Welcome",
      message: "Welcome to Threads",
      type: "success",
      createdAt: new Date().toISOString(),
    };
    const channel = pusherChannel.user();
    const event = PUSHER_EVENT.NOTIFICATION_NEW;

    try {
      await pusherService.trigger(channel, event, payload);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
    return {
      subscriberCount: 0,
      payload,
    };
  }

  async sendRealtimeNotification(userId: string, type: 'like' | 'comment' | 'mention' | 'invite' | 'message', data: any) {
    // TODO: implement logic to send realtime notification (like, comment, mention, invite, new message)
    return {};
  }
}

export const notificationService = new NotificationService();
