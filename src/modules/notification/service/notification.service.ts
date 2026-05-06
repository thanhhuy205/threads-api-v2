import type { WelcomeNotificationPayload } from '@/modules/notification/interface/notification.types';
import { sseService } from '@/modules/sse/service/sse.service';

class NotificationService {
    async createWelcome(userId: string) {
        const payload: WelcomeNotificationPayload = {
            title: 'Welcome',
            message: 'Welcome to Threads',
            type: 'success',
            createdAt: new Date().toISOString(),
        };

        const subscriberCount = await sseService.sendNotificationToUser(userId, payload);

        return {
            subscriberCount,
            payload,
        };
    }
}

export const notificationService = new NotificationService();
