import { redisKey } from "@/constants/resolve-key/redis-key";
import {
    mapPostLabelToExpReason,
    mapPostLabelToQualityLabel,
    mapScoreToReward,
} from "@/modules/ai/mapper/nomallize-score";
import { aiService } from "@/modules/ai/service/ai.service";
import { circleMemberRepository } from "@/modules/circle/repository/circle-member.repository";
import { circleRepository } from "@/modules/circle/repository/circle.repository";
import { circleEnergyService } from "@/modules/circle/service/circle-enery.service";
import { circleExpLogService } from "@/modules/circle/service/circle-exp-log.service";
import { circlePostQualityLogService } from "@/modules/circle/service/circle-post-quality-log.service";
import { mixedBreadService } from "@/modules/mixed-bread/service/mixed-bread.service";
import { pineconeService } from "@/modules/pinecone/service/pinecone.service";
import { postRepository } from "@/modules/post/repository/post.repository";
import { pusherService } from "@/modules/pusher/service/pusher.service";
import { reportRepository } from "@/modules/report/repository/report.repository";
import { pineconeIndex } from "@/providers/pinecone.provider";
import { redisService } from "@/providers/redis.provider";
import { ReportStatus, ReportTargetType } from "@prisma/client";
import { EVALUATION_JOB_NAME, QUEUE_NAME } from "../src/constants/queue";
import { createWorker } from "../src/providers/bullmq.provider";

interface EvaluationPostJob {
    postId: number;
    circlePublicId: string;
    userId: string;
    content: string;
}

interface EvaluationReportJob {
    reportId: string;
    type: ReportTargetType;
    targetPublicId: string;
    targetContent: string;
    reason: string;
    reporterId: string;
    reportedUserId: string;
}

const processEvaluationPost = async (job: EvaluationPostJob) => {
    try {
        const circle = await circleRepository.findByPublicId(job.circlePublicId);
        if (!circle) {
            throw new Error(`Circle ${job.circlePublicId} not found`);
        }
        const member = await circleMemberRepository.findRoleByCircleId(circle.id, job.userId);
        if (!member) {
            throw new Error(`User ${job.userId} is not a member of circle ${job.circlePublicId}`);
        }

        const embedding = await mixedBreadService.generateEmbedding(job.content, [circle.name]);
        // khác nhóm nhưng đang giống nội dung với nhau
        // cùng nhóm và cùng user nhưng đang giống nội dung với nhau
        // cùng nhóm nhưng khác user đang giống nội dung với nhau
        const [sameCircle, sameUserInCircle, sameUser] = await Promise.all([
            pineconeIndex.query({
                vector: embedding,
                topK: 1,
                includeMetadata: true,
                namespace: 'posts',
                filter: {
                    circleId: circle.id,
                },
            }),
            pineconeIndex.query({
                vector: embedding,
                topK: 1,
                includeMetadata: true,
                namespace: 'posts',
                filter: {
                    circleId: circle.id,
                    userId: job.userId,
                },
            }),
            pineconeIndex.query({
                vector: embedding,
                topK: 1,
                includeMetadata: true,
                namespace: 'posts',
                filter: {
                    userId: job.userId,
                },
            }),

        ]);

        const matches = sameCircle.matches ?? [];
        const bestMatch = matches[0];

        if (bestMatch && bestMatch.score && bestMatch.score > 0.9) {
            console.log(`Post ${job.postId} is very similar to a previous post with id ${bestMatch.id} and score ${bestMatch.score}`);
            return {
                processed: false,
                postId: job.postId,
            };
        }

        const result = await aiService.scorePostAI(job.content);

        const formatResult = mapScoreToReward(result);
        const expReason = mapPostLabelToExpReason(formatResult.label);
        const qualityLabel = mapPostLabelToQualityLabel(formatResult.label);



        await Promise.all([
            circleExpLogService.upsertPostQualityLog({
                userId: job.userId,
                circleId: circle.id,
                postId: job.postId,
                expReason,
                expDelta: formatResult.expDelta,
                isDelta: false,
            }),
            circlePostQualityLogService.saveJudgeResult({
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
            pineconeService.saveCirclePostEmbeddingToPinecone({
                postId: job.postId,
                circleId: circle.id,
                userId: job.userId,
                content: job.content,
                topics: [circle.name],
                embedding, // You can choose to generate an embedding for the post content if needed
            }),
        ]);

        await circleEnergyService.addExpAndHp(circle.id, formatResult.expDelta, formatResult.hpDelta);
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

const processEvaluationReport = async (job: EvaluationReportJob) => {
    try {
        const report = await reportRepository.findById(job.reportId);
        if (!report) {
            throw new Error(`Report ${job.reportId} not found`);
        }

        const result = await aiService.evaluateReportAI({
            content: job.targetContent,
            reason: job.reason,
            targetType: job.type,
        });

        const normalizedConfidence = Number(
            Math.max(0, Math.min(1, result.confidence)).toFixed(2),
        );

        await reportRepository.updateById(job.reportId, {
            assistantNote: result.assistantNote,
            confidence: normalizedConfidence,
            isDisinformation: result.isDisinformation ?? false,
            status: ReportStatus.RESOLVED
        });

        if (
            !result.isDisinformation &&
            normalizedConfidence >= 0.96 &&
            [ReportTargetType.POST, ReportTargetType.CIRCLE].includes(job.type as any)
        ) {
            await postRepository.updateIsHidden(job.targetPublicId, true);
            await redisService.incr(redisKey.post.listVersion());
            await pusherService.trigger(`private-report-${job.reporterId}`, 'report-processed', {
                reportId: job.reportId,
                targetPublicId: job.targetPublicId,
                targetType: job.type,
                message: `${result.assistantNote} và chúng tôi sẽ ẩn nội dung này khỏi những người dùng khác.`,
                action: 'hide',
            });
            return {
                processed: true,
                reportId: job.reportId,
                confidence: normalizedConfidence,
                hidden: normalizedConfidence >= 0.96,
            };
        }

        if (result.isDisinformation) {
            await postRepository.updateIsDisinformation(job.targetPublicId, true);
            await redisService.incr(redisKey.post.listVersion());
            await pusherService.trigger(`private-report-${job.reporterId}`, 'report-processed', {
                reportId: job.reportId,
                targetPublicId: job.targetPublicId,
                targetType: job.type,
                message: `${result.assistantNote} và chúng tôi sẽ đánh dấu nội dung này là thông tin sai lệch.`,
                action: 'disinformation',
            });
            return {
                processed: true,
                reportId: job.reportId,
                confidence: normalizedConfidence,
                hidden: normalizedConfidence >= 0.96,
            };
        }


        await pusherService.trigger(`private-report-${job.reporterId}`, 'report-processed', {
            reportId: job.reportId,
            targetPublicId: job.targetPublicId,
            targetType: job.type,
            message: `${result.assistantNote}, cảm ơn bạn đã báo cáo.`,
            action: 'none',
        });

        return {
            processed: true,
            reportId: job.reportId,
            confidence: normalizedConfidence,
            hidden: normalizedConfidence >= 0.96,
        };
    } catch (error) {
        console.error(
            `[EVALUATE] Error processing report ${job.reportId}:`,
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
            case EVALUATION_JOB_NAME.EVALUATION_REPORT:
                return processEvaluationReport(job.data);
            default:
                console.warn(`Unknown job name: ${job.name}`);
                return null;
        }
    },
);
