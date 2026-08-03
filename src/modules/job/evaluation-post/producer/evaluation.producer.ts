import { EVALUATION_JOB_NAME, QUEUE_NAME } from '@/constants/queue';
import { createQueue } from '@/providers/bullmq.provider';

interface EvaluationReportPayload {
    reportId: string;
    type: "POST";
    targetPublicId: string;
    targetContent: string;
    reason: string;
    reporterId: string;
    reportedUserId: string;
}

class EvaluationProducer {
    private readonly queue = createQueue(QUEUE_NAME.EVALUATION_QUEUE);

    constructor() { }

    async enqueueEvaluationReport(payload: EvaluationReportPayload) {
        await this.queue.add(EVALUATION_JOB_NAME.EVALUATION_REPORT, {
            ...payload,
        });
    }
}

export const evaluationProducer = new EvaluationProducer();
