import { PINECONE_JOB_NAME, QUEUE_NAME } from "@/constants/queue";
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
        // Implement the logic to process the data and generate embeddings
        console.log('Processing data in PineWorker:', data);
        // Simulate embedding generation
        const embedding = await generateEmbedding(data.content, data.topic);
        console.log('Generated embedding:', embedding);
    }
}

export const pineWorker = new PineWorker();