import { QueueEvents } from 'bullmq';
import { QUEUE_NAME } from '../src/constants/queue';

const queueEvents = new QueueEvents(QUEUE_NAME.EVALUATION_QUEUE);

queueEvents.on('waiting', ({ jobId }) => {});

queueEvents.on('active', ({ jobId }) => {});

queueEvents.on('completed', ({ jobId }) => {});

queueEvents.on('failed', ({ jobId, failedReason }) => {});

export { queueEvents as evaluatePostQueueEvents };

