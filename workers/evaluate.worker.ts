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
        // TODO: Implement post quality evaluation logic
        // For now, generate a random quality score between 0.7 and 0.95
        const qualityScore = Math.round((Math.random() * 0.25 + 0.7) * 100) / 100;
        const category = "general"; // TODO: Implement category detection
        const hpDelta = Math.floor(qualityScore * 10); // Example: quality score * 10 = hp delta
        const expDelta = Math.floor(qualityScore * 5); // Example: quality score * 5 = exp delta

        console.log(
            `[EVALUATE] Post ${job.postId} in circle ${job.circlePublicId} - Score: ${qualityScore}`,
        );

        // TODO: Update database with evaluation results
        // - Update CirclePostQualityLog
        // - Update CircleEnergy
        // - Dispatch completion event to internal webhook

        return {
            processed: true,
            postId: job.postId,
            qualityScore,
            category,
            hpDelta,
            expDelta,
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
