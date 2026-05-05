
export type SseEventName = 'connected' | 'notification' | 'heartbeat';

export interface SsePayload {
    userId: string;
    event: SseEventName;
    data: any;
}