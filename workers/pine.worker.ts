import { PINECONE_JOB_NAME, QUEUE_NAME } from "@/constants/queue";
import { pineconeService } from "@/modules/pinecone/service/pinecone.service";
import { createWorker } from "@/providers/bullmq.provider";
import { generateEmbedding } from "@/providers/mixedbread.provider";


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
        console.log('Processing data in PineWorker:', data);
        const embedding = await generateEmbedding(data.content, data.topic);
        await pineconeService.savePostEmbeddingToPinecone({
            postId: data.postId,
            userId: data.userId,
            content: data.content,
            topics: data.topic,
            embedding,
        });
    }
}

export const pineWorker = new PineWorker();