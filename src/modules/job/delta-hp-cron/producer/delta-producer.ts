import { DELTA_HP_JOB_NAME, QUEUE_NAME } from "@/constants/queue";
import { baseLogger } from "@/middlewares/logger";
import { createQueue } from "@/providers/bullmq.provider";

class DeltaProducer {
    private readonly deltaQueue = createQueue(QUEUE_NAME.DELTA_HP_QUEUE);

    constructor() {
        baseLogger.info("DeltaProducer initialized");
    }

    async initSyncBatchJob() {
        const repeatableJobs = await this.deltaQueue.getRepeatableJobs();
        const deltaJobs = repeatableJobs.filter(
            (job) => job.name === DELTA_HP_JOB_NAME.DECREASE_HP,
        );

        if (deltaJobs.length > 0) {
            await Promise.all(
                deltaJobs.map((job) =>
                    this.deltaQueue.removeRepeatableByKey(job.key),
                ),
            );
            baseLogger.warn(
                `Removed ${deltaJobs.length} existing delta HP repeat jobs before re-initializing scheduler`,
            );
        }


        await this.deltaQueue.add(
            DELTA_HP_JOB_NAME.DECREASE_HP,
            {},
            {
                jobId: DELTA_HP_JOB_NAME.DECREASE_HP,
                repeat: { every: 5_000 },
                attempts: 1,
            },
        );
    }

    get queue() {
        return this.deltaQueue;
    }
}

export const deltaProducer = new DeltaProducer();
