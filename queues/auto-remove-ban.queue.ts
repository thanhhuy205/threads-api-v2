import { QueueEvents } from 'bullmq';
import { QUEUE_NAME } from '../src/constants/queue';

const queueEvents = new QueueEvents(QUEUE_NAME.AUTO_REMOVE_BAN_QUEUE);

queueEvents.on('waiting', ({ jobId }) => {
    console.log(`Auto-remove-ban job with ID ${jobId} is waiting`);
});

queueEvents.on('active', ({ jobId, prev }) => {
    console.log(`Auto-remove-ban job ${jobId} is now active; previous status was ${prev}`);
});

queueEvents.on('completed', ({ jobId, returnvalue }) => {
    console.log(`Auto-remove-ban job ${jobId} has completed and returned ${returnvalue}`);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
    console.log(`Auto-remove-ban job ${jobId} has failed with reason ${failedReason}`);
});

export const autoRemoveBanQueue = queueEvents;
