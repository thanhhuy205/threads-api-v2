import { aiService } from "@/modules/ai/service/ai.service";
import { pusherChannel } from "@/modules/pusher/channel/pusher-channel";
import { pusherService } from "@/modules/pusher/service/pusher.service";
import { reportRepository } from "@/modules/report/repository/report.repository";
import { ReportStatus, ReportTargetType } from "@prisma/client";
import { EVALUATION_JOB_NAME, QUEUE_NAME } from "../src/constants/queue";
import { createWorker } from "../src/providers/bullmq.provider";

interface EvaluationReportJob {
  reportId: string;
  type: ReportTargetType;
  targetPublicId: string;
  targetContent: string;
  reason: string;
  reporterId: string;
}

const processEvaluationReport = async (job: EvaluationReportJob) => {
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

export const evaluateWorker = createWorker(QUEUE_NAME.EVALUATION_QUEUE, async (job) => {
  if (job.name === EVALUATION_JOB_NAME.EVALUATION_REPORT) {
    return processEvaluationReport(job.data);
  }
  console.warn(`Unknown job name: ${job.name}`);
  return null;
});
