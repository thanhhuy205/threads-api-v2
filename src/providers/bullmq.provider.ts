import { redisWorker } from "@/providers/redis.provider";
import { JobsOptions, Queue, Worker, WorkerOptions } from "bullmq";

export const defaultJobOptions: JobsOptions = {
    attempts: 3,
    backoff: {
        type: "exponential",
        delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
};

export const createQueue = (name: string): Queue => {
    return new Queue(name, {
        connection: redisWorker,
        defaultJobOptions,
    });
};

export const createWorker = (
    name: string,
    process: (job: any) => Promise<any>,
    options?: Omit<WorkerOptions, "connection">,
) => {
    return new Worker(name, process, {
        concurrency: 3,
        connection: redisWorker,
        ...options,
    });
};