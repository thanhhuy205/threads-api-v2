import { PINECONE_JOB_NAME, QUEUE_NAME } from "@/constants/queue";
import { createQueue } from "@/providers/bullmq.provider";
import { Queue } from "bullmq";
import { PineRequestDto } from '../dto/pine.request.dto';

class PineProducer {
    private readonly pineconeQueue: Queue;

    constructor() {
        this.pineconeQueue = createQueue(QUEUE_NAME.PINECONE_QUEUE);
    }

    async addToPineconeQueue(data: PineRequestDto) {
        await this.pineconeQueue.add(PINECONE_JOB_NAME.POST_EMBEDDING, data);
    }
}

export const pineProducer = new PineProducer();