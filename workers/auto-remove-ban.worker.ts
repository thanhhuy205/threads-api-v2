import { UserStatus } from "@prisma/client";
import { AUTO_REMOVE_BAN_JOB_NAME, QUEUE_NAME } from "../src/constants/queue";
import { baseLogger } from "../src/middlewares/logger";
import { userManagementRepository } from "../src/modules/admin/user-management/user-management.repository";
import type { AutoRemoveBanJobDto } from "../src/modules/job/auto-remove-ban/dto/auto-remove-ban.job.dto";
import type { AutoRemoveBanInput } from "../src/modules/job/auto-remove-ban/interfaces/auto-remove-ban.input";
import { createWorker } from "../src/providers/bullmq.provider";

class AutoRemoveBanWorker {
  private readonly worker = createWorker(QUEUE_NAME.AUTO_REMOVE_BAN_QUEUE, async (job) => {
    switch (job.name) {
      case AUTO_REMOVE_BAN_JOB_NAME.RUN_AUTO_REMOVE_BAN:
        return this.runAutoRemoveBan(job.data as AutoRemoveBanJobDto, job.id);
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  });

  async runAutoRemoveBan(payload: AutoRemoveBanJobDto, jobId?: string) {
    const input: AutoRemoveBanInput = {
      now: new Date(),
      triggeredBy: payload.triggeredBy ?? "scheduler",
      jobId,
    };

    // TODO: move final auto-remove-ban business flow into service when ready.
    const result = await userManagementRepository.updateExpiredBannedUsers({
      now: input.now,
      status: UserStatus.ACTIVE,
      bannedUntil: null,
    });

    baseLogger.info(
      `Auto-remove-ban job ${input.jobId ?? "unknown"} completed with ${result.count} users activated`,
    );

    return {
      ...input,
      removedBanCount: result.count,
    };
  }
}

export const autoRemoveBanWorker = new AutoRemoveBanWorker();
