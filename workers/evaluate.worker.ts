import {
    mapPostLabelToExpReason,
    mapPostLabelToQualityLabel,
    mapScoreToReward,
} from "@/modules/ai/mapper/nomallize-score";
import { aiService } from "@/modules/ai/service/ai.service";
import { circleExpLogRepository } from "@/modules/circle/repository/circle-exp-log.repository";
import { circleMemberRepository } from "@/modules/circle/repository/circle-member.repository";
import { circlePostQualityLogRepository } from "@/modules/circle/repository/circle-post-quality-log.repository";
import { circleRepository } from "@/modules/circle/repository/circle.repository";
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
        const formatResult = mapScoreToReward(result);
        const expReason = mapPostLabelToExpReason(formatResult.label);
        const qualityLabel = mapPostLabelToQualityLabel(formatResult.label);

        const circle = await circleRepository.findByPublicId(job.circlePublicId);
        if (!circle) {
            throw new Error(`Circle ${job.circlePublicId} not found`);
        }
        const member = await circleMemberRepository.findRoleByCircleId(circle.id, job.userId);
        if (!member) {
            throw new Error(`User ${job.userId} is not a member of circle ${job.circlePublicId}`);
        }

        await Promise.all([
            circleExpLogRepository.upsertPostQualityLog({
                userId: job.userId,
                circleId: circle.id,
                postId: job.postId,
                expReason,
                expDelta: formatResult.expDelta,
                isDelta: false,
            }),
            circlePostQualityLogRepository.saveJudgeResult({
                circleMemberId: member.id,
                userId: job.userId,
                circleId: circle.id,
                postId: job.postId,
                score: formatResult.score,
                label: qualityLabel,
                hpDelta: formatResult.hpDelta,
                expDelta: formatResult.expDelta,
                reason: formatResult.reason,
                confidence: formatResult.confidence,
                isToxic: formatResult.isToxic,
                isSpam: formatResult.isSpam,
            }),
        ]);


        return {
            processed: true,
            postId: job.postId,
            result: formatResult
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
