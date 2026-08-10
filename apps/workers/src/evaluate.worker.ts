import { aiService } from "@api/modules/ai/service/ai.service";
import { pusherChannel } from "@api/modules/pusher/channel/pusher-channel";
import { pusherService } from "@api/modules/pusher/service/pusher.service";
import { ReportRepository } from "@api/modules/report/repository/report.repository";
import { ReportStatus, ReportTargetType } from "@prisma/client";
import { EVALUATION_JOB_NAME, QUEUE_NAME } from "@libs/core/constants/queue";
import { createWorker } from "@libs/core/providers/bullmq.provider";

interface EvaluationReportJob {
  reportId: string;
  type: ReportTargetType;
  targetPublicId: string;
  targetContent: string;
  reason: string;
  reporterId: string;
}

const processEvaluationReport = async (
  job: EvaluationReportJob,
  reportRepository: ReportRepository,
) => {
  try {
    const report = await reportRepository.findById(job.reportId);
    if (!report) throw new Error(`Report ${job.reportId} not found`);

    const result = await aiService.evaluateReportAI({
      content: job.targetContent,
      reason: job.reason,
      targetType: job.type,
    });
    const confidence = Number(Math.max(0, Math.min(1, result.confidence)).toFixed(2));
    await reportRepository.updateById(job.reportId, {
      assistantNote: result.assistantNote,
      confidence,
      isDisinformation: result.isDisinformation ?? false,
      status: ReportStatus.RESOLVED,
    });

    await pusherService.trigger(pusherChannel.privateNotification(job.reporterId), "report-processed", {
      reportId: job.reportId,
      targetPublicId: job.targetPublicId,
      targetType: job.type,
      message: result.assistantNote,
      action: result.isDisinformation ? "report_flagged" : "none",
    });
  } catch (error) {
    console.error("[EVALUATE] Error processing report:", error);
    throw error;
  }
};

export const createEvaluateWorker = (reportRepository: ReportRepository) =>
  createWorker(QUEUE_NAME.EVALUATION_QUEUE, async (job) => {
    if (job.name === EVALUATION_JOB_NAME.EVALUATION_REPORT) {
      return processEvaluationReport(job.data, reportRepository);
    }
    console.warn(`Unknown job name: ${job.name}`);
    return null;
  });
