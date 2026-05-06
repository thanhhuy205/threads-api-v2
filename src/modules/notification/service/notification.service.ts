import type { WelcomeNotificationPayload } from '@/modules/notification/interface/notification.types';
import { sseService } from '@/modules/sse/service/sse.service';

class NotificationService {
    createWelcome(userId: string) {
        const payload: WelcomeNotificationPayload = {
            title: 'Welcome',
            message: 'Welcome to Threads',
            type: 'success',
            createdAt: new Date().toISOString(),
        };

        const sentCount = sseService.sendNotificationToUser(userId, payload);

        return {
            sentCount,
            payload,
        };
    }
}

export const notificationService = new NotificationService();
