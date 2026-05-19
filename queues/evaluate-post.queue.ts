import { QueueEvents } from 'bullmq';
import { QUEUE_NAME } from '../src/constants/queue';

const queueEvents = new QueueEvents(QUEUE_NAME.EVALUATION_QUEUE);

queueEvents.on('waiting', ({ jobId }) => {
    console.log(`[EVALUATE] Job ${jobId} is waiting`);
});

queueEvents.on('active', ({ jobId }) => {
    console.log(`[EVALUATE] Job ${jobId} is active`);
});

queueEvents.on('completed', ({ jobId }) => {
    console.log(`[EVALUATE] Job ${jobId} completed`);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
    console.log(`[EVALUATE] Job ${jobId} failed: ${failedReason}`);
});

export { queueEvents as evaluatePostQueueEvents };

