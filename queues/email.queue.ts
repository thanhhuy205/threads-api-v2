import { QueueEvents } from 'bullmq';
import { QUEUE_NAME } from '../src/constants/queue';

const queueEvents = new QueueEvents(QUEUE_NAME.EMAIL_QUEUE);

queueEvents.on('waiting', ({ jobId }) => {});

queueEvents.on('active', ({ jobId, prev }) => {});

queueEvents.on('completed', ({ jobId, returnvalue }) => {});

queueEvents.on('failed', ({ jobId, failedReason }) => {});

export const emailQueue = queueEvents;