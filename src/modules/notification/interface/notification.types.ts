export type WelcomeNotificationPayload = {
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    createdAt: string;
};
