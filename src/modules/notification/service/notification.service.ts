import type { WelcomeNotificationPayload } from '@/modules/notification/interface/notification.types';


class NotificationService {
    async createWelcome(userId: string) {
        const payload: WelcomeNotificationPayload = {
            title: 'Welcome',
            message: 'Welcome to Threads',
            type: 'success',
            createdAt: new Date().toISOString(),
        };

        // TODO: Implement Pusher trigger here

        return {
            subscriberCount: 0,
            payload,
        };
    }
}

export const notificationService = new NotificationService();
