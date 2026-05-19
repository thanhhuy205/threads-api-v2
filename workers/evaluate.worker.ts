import { aiService } from "@/modules/ai/service/ai.service";
import { EVALUATION_JOB_NAME, QUEUE_NAME } from "../src/constants/queue";
import { createWorker } from "../src/providers/bullmq.provider";

interface EvaluationPostJob {
    postId: number;
    circlePublicId: string;
    userId: string;
    content: string;
}

const processEvaluationPost = async (job: EvaluationPostJob) => {
    try {

        const result = await aiService.scorePostAI(job.content);

        console.log(result);
        return {
            processed: true,
            postId: job.postId,
            result
        };
    } catch (error) {
        console.error(
            `[EVALUATE] Error processing post ${job.postId}:`,
            error,
        );
        throw error;
    }
};

export const evaluateWorker = createWorker(
    QUEUE_NAME.EVALUATION_QUEUE,
    async (job) => {
        switch (job.name) {
            case EVALUATION_JOB_NAME.EVALUATION_POST:
                return processEvaluationPost(job.data);
            default:
                console.warn(`Unknown job name: ${job.name}`);
                return null;
        }
    },
);
