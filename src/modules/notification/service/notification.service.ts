import type { WelcomeNotificationPayload } from "@/modules/notification/interface/notification.types";
import { pusherService } from "@/modules/pusher/service/pusher.service";

class NotificationService {
  async createWelcome() {
    const payload: WelcomeNotificationPayload = {
      title: "Welcome",
      message: "Welcome to Threads",
      type: "success",
      createdAt: new Date().toISOString(),
    };
    const channel = `user`;
    const event = "notification:new";

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
}

export const notificationService = new NotificationService();
