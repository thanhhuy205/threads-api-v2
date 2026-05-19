import { EVALUATION_JOB_NAME, QUEUE_NAME } from '@/constants/queue';
import { createQueue } from '@/providers/bullmq.provider';

interface EvaluationPostPayload {
    postId: number;
    circlePublicId: string;
    userId: string;
    content: string;
}

class EvaluationProducer {
    private readonly queue = createQueue(QUEUE_NAME.EVALUATION_QUEUE);

    constructor() { }

    async enqueueEvaluationPost(payload: EvaluationPostPayload) {
        await this.queue.add(EVALUATION_JOB_NAME.EVALUATION_POST, {
            ...payload,
        });
    }
}

export const evaluationProducer = new EvaluationProducer();
