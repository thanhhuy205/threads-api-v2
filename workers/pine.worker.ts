import { PINECONE_JOB_NAME, QUEUE_NAME } from "@/constants/queue";
import { mixedBreadService } from "@/modules/mixed-bread/service/mixed-bread.service";
import { pineconeService } from "@/modules/pinecone/service/pinecone.service";
import { createWorker } from "@/providers/bullmq.provider";


class PineWorker {
    private readonly worker = createWorker(QUEUE_NAME.PINECONE_QUEUE, async (job) => {
        switch (job.name) {
            case PINECONE_JOB_NAME.POST_EMBEDDING:
                return this.process(job.data);

            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    });


    async process(data: any) {
        const embedding = await mixedBreadService.generateEmbedding(data.content, data.topic);
        await pineconeService.savePostEmbeddingToPinecone({
            postId: data.postId,
            userId: data.userId,
            content: data.content,
            topics: data.topic,
            embedding,
        });    }
}

export const pineWorker = new PineWorker();