import { pusherService } from "@/modules/pusher/service/pusher.service";
import { redisService } from "@/providers/redis.provider";
import { NOTIFICATION_JOB_KEY, NOTIFICATION_JOB_NAME, QUEUE_NAME } from "../src/constants/queue";
import { baseLogger } from "../src/middlewares/logger";
import { createWorker } from "../src/providers/bullmq.provider";

class MessageWorker {
    private readonly worker = createWorker(QUEUE_NAME.MESSAGE_QUEUE, async (job) => {
        switch (job.name) {
            case NOTIFICATION_JOB_NAME.REALTIME_CHAT_NOTIFICATION:
                return this.batchMessageNotification();
            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    });


    async batchMessageNotification() {
        const now = Date.now();
        const dueItems = await redisService.zRangeByScore(
            NOTIFICATION_JOB_KEY.REALTIME_CHAT_NOTIFICATION,
            "-inf",
            now
        );

        console.log("Due items:", dueItems);
        if (!dueItems.length) return;
        const notificationMessage: {
            avatar: string,
            senderId: string,
            content: string,
            count: string,
            groupPublicId: string,
            recipientId: string,
            name: string,
            type: string,
            targetType: string
        }[] = [];


        for (const messageKey of dueItems) {
            baseLogger.info(`[REALTIME_CHAT_NOTIFICATION_QUEUE_ITEM] ${messageKey}`);

            const notificationData = await redisService.hGetAll(messageKey);

            console.log(notificationData);

            notificationMessage.push({ ...notificationData } as any);



            await redisService
                .multi()
                .del(messageKey)
                .zRem(NOTIFICATION_JOB_KEY.REALTIME_CHAT_NOTIFICATION, messageKey)
                .exec();


            await this.pusherNotificationMessage({
                avatar: notificationData.avatar,
                content: notificationData.content,
                count: notificationData.count,
                groupPublicId: notificationData.groupPublicId,
                recipientId: notificationData.recipientId,
                name: notificationData.name,
            });
        }
    }


    buildMessageNotificationPayload(payload: {
        count: string,
        name: string,
        content: string
    }) {
        const count = parseInt(payload.count, 10);
        if (count > 1) {
            return `${payload.name} đã gửi ${count} tin nhắn mới tới bạn`;
        }

        return `${payload.name} đã gửi tin nhắn '${payload.content.length >= 50 ? `${payload.content.slice(0, 50)}...` : payload.content}'`;
    }


    async pusherNotificationMessage(payload: {
        avatar: string,
        content: string,
        count: string,
        groupPublicId: string,
        recipientId: string,
        name: string
    }) {
        const { recipientId, content, avatar, name, groupPublicId } = payload;
        const message = this.buildMessageNotificationPayload(payload);
        console.log(message);
        console.log(`private-notification-message-${recipientId}`)
        await pusherService.trigger(`private-notification-message-${recipientId}`, "message-notification:new", {
            groupPublicId,
            name,
            avatar: avatar ?? "",
            recipientId,
            message
        });
    }
}

export const messageWorker = new MessageWorker();
