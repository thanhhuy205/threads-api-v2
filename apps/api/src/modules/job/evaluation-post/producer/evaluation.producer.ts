import { EVALUATION_JOB_NAME, QUEUE_NAME } from '@/constants/queue';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

interface EvaluationReportPayload {
    reportId: string;
    type: "POST";
    targetPublicId: string;
    targetContent: string;
    reason: string;
    reporterId: string;
    reportedUserId: string;
}

@Injectable()
export class EvaluationProducer {
    constructor(@InjectQueue(QUEUE_NAME.EVALUATION_QUEUE) private readonly queue: Queue) { }

    async enqueueEvaluationReport(payload: EvaluationReportPayload) {
        await this.queue.add(EVALUATION_JOB_NAME.EVALUATION_REPORT, {
            ...payload,
        });
    }
}
