import { redisQueue, redisWorker } from "@/providers/redis.provider";
import { JobsOptions, Queue, Worker } from "bullmq";

export const defaultJobOptions: JobsOptions = {
    attempts: 3,
    backoff: {
        type: 'exponential',
        delay: 1000, // 1 second
    },
    removeOnComplete: true,
    removeOnFail: false,
}

export const createQueue = (name: string): Queue => {
    const queue = new Queue(name, {
        connection: redisQueue,
        defaultJobOptions
    });
    return queue;
}

export const createWorker = (name: string, process: (job: any) => Promise<any>, options?: Omit<WorkerOptions, 'connection'>,) => {
    const worker = new Worker(name, process, {
        concurrency: 3,
        connection: redisWorker,
        ...options,
    });
    return worker;
}