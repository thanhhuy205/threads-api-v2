import { userKarmaRepository } from "@/modules/circle/repository/user-karma.repository";
import { userActionLogRepository } from "@/modules/user-action-log/repository/user-action-log.repository";
import { transactionService } from "@/shared/transaction/transaction.service";
import { Prisma } from "@prisma/client";
import { ActiveDailyQuest, questRepository } from "../repository/quest.repository";
import { userQuestLogRepository } from "../repository/user-quest-log.repository";

const DAILY_QUEST_LIMIT = 3;
const DAILY_RESET_HOUR_UTC7 = 7;
const UTC7_OFFSET_MS = 7 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type DailyCycleWindow = {
  cycleStartAt: Date;
  cycleEndAt: Date;
  cycleDate: Date;
};

class QuestService {
  async getDailyQuests(userId: string) {
    const cycleWindow = this.resolveDailyCycleWindow(new Date());

    return transactionService.doInTransaction(async (tx) => {
      await userQuestLogRepository.lockUserRow(userId, tx);

      const activeQuestCount = await questRepository.countActiveDailyQuests(tx);
      const maxAssignableQuestCount = Math.min(DAILY_QUEST_LIMIT, activeQuestCount);

      let dailyLogs = await userQuestLogRepository.findLogsByUserAndDate(
        userId,
        cycleWindow.cycleDate,
        tx,
      );

      if (dailyLogs.length < maxAssignableQuestCount) {
        const assignedQuestIds = dailyLogs.map((log) => log.questId);
        const availableQuests = await questRepository.findActiveDailyQuests(
          {
            excludeQuestIds: assignedQuestIds,
          },
          tx,
        );

        const topUpQuests = this.pickRandomQuests(
          availableQuests,
          maxAssignableQuestCount - dailyLogs.length,
        );

        await userQuestLogRepository.createManyLogs(
          topUpQuests.map((quest) => ({
            userId,
            questId: quest.id,
            date: cycleWindow.cycleDate,
          })),
          tx,
        );

        dailyLogs = await userQuestLogRepository.findLogsByUserAndDate(
          userId,
          cycleWindow.cycleDate,
          tx,
        );
      }

      const actionCounts = await userActionLogRepository.countByTypeInWindow(
        {
          userId,
          startAt: cycleWindow.cycleStartAt,
          endAt: cycleWindow.cycleEndAt,
        },
        tx,
      );

      const previousStateByLogId = new Map(
        dailyLogs.map((log) => [log.id, { progress: log.progress, completed: log.completed }]),
      );

      // Lấy ra nhiệm vụ trong ngày bởi map, rồi lấy action xem có dủ so với requirement không, nếu có thì update lại progress và completed
      const logsWithRecountedProgress = dailyLogs.map((log) => {
        const progress = actionCounts.get(log.quest.action) ?? 0;
        const completed = progress >= log.quest.requirement;

        return {
          ...log,
          progress,
          completed,
        };
      });

      const logsNeedingUpdate = logsWithRecountedProgress.filter(
        (log) => {
          const previousState = previousStateByLogId.get(log.id);
          if (!previousState) {
            return false;
          }

          return (
            log.progress !== previousState.progress
            || log.completed !== previousState.completed
          );
        },
      );

      await Promise.all(
        logsNeedingUpdate.map((log) =>
          userQuestLogRepository.updateProgress(
            {
              id: log.id,
              progress: log.progress,
              completed: log.completed,
            },
            tx,
          ),
        ),
      );
      const karma = await this.getOrCreateTotalKarma(userId, tx);

      return {
        userId,
        cycleStartAt: cycleWindow.cycleStartAt.toISOString(),
        cycleEndAt: cycleWindow.cycleEndAt.toISOString(),
        quests: logsWithRecountedProgress.map((log) => ({
          code: log.quest.code,
          description: log.quest.description,
          action: log.quest.action,
          progress: log.progress,
          requirement: log.quest.requirement,
          completed: log.completed,
          claimed: Boolean(log.claimedAt),
          claimedAt: log.claimedAt ? log.claimedAt.toISOString() : null,
          karmaReward: log.quest.karmaReward,
        })),

        totalCompleted: logsWithRecountedProgress.filter((log) => log.completed).length,
        totalKarma: karma,
      };
    });
  }

  async claimQuest(userId: string, codeQuest: string) {
    const cycleWindow = this.resolveDailyCycleWindow(new Date());

    const totalKarma = await transactionService.doInTransaction(async (tx) => {
      const log = await userQuestLogRepository.findLogByUserQuestAndDate(
        userId,
        codeQuest,
        cycleWindow.cycleDate,
        tx,
      );

      if (!log) {
        throw new Error('Quest log not found for the user and quest');
      }

      if (log.claimedAt) {
        throw new Error('Quest already claimed');
      }

      if (!log.completed) {
        throw new Error('Quest not completed yet');
      }

      const result = await userQuestLogRepository.claimQuest(log.id, tx);

      return userKarmaRepository.incrementKarma(userId, result.quest.karmaReward, tx);
    });

    return {
      userId,
      totalKarma,
    };
  }

  private async getOrCreateTotalKarma(
    userId: string,
    tx: Prisma.TransactionClient,
  ) {
    const existingKarma = await userKarmaRepository.getTotalKarmaByUserId(userId, tx);
    if (existingKarma !== null) {
      return existingKarma;
    }

    try {
      return await userKarmaRepository.createDefaultKarmaByUserId(userId, tx);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError
        && error.code === "P2002"
      ) {
        const retryKarma = await userKarmaRepository.getTotalKarmaByUserId(userId, tx);
        if (retryKarma !== null) {
          return retryKarma;
        }
      }

      throw error;
    }
  }

  private pickRandomQuests(quests: ActiveDailyQuest[], take: number) {
    if (take <= 0 || quests.length === 0) {
      return [];
    }

    const shuffled = [...quests];
    for (let idx = shuffled.length - 1; idx > 0; idx -= 1) {
      const randomIdx = Math.floor(Math.random() * (idx + 1));
      [shuffled[idx], shuffled[randomIdx]] = [shuffled[randomIdx], shuffled[idx]];
    }

    return shuffled.slice(0, Math.min(take, shuffled.length));
  }

  private resolveDailyCycleWindow(now: Date): DailyCycleWindow {
    const shiftedNowMs = now.getTime() + UTC7_OFFSET_MS;
    const shiftedNow = new Date(shiftedNowMs);

    let cycleStartShiftedMs = Date.UTC(
      shiftedNow.getUTCFullYear(),
      shiftedNow.getUTCMonth(),
      shiftedNow.getUTCDate(),
      DAILY_RESET_HOUR_UTC7,
      0,
      0,
      0,
    );

    if (shiftedNowMs < cycleStartShiftedMs) {
      cycleStartShiftedMs -= ONE_DAY_MS;
    }

    const cycleEndShiftedMs = cycleStartShiftedMs + ONE_DAY_MS;
    const cycleStartAt = new Date(cycleStartShiftedMs - UTC7_OFFSET_MS);
    const cycleEndAt = new Date(cycleEndShiftedMs - UTC7_OFFSET_MS);

    const cycleStartShiftedDate = new Date(cycleStartShiftedMs);
    const cycleDate = new Date(
      Date.UTC(
        cycleStartShiftedDate.getUTCFullYear(),
        cycleStartShiftedDate.getUTCMonth(),
        cycleStartShiftedDate.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );

    return {
      cycleStartAt,
      cycleEndAt,
      cycleDate,
    };
  }
}

export const questService = new QuestService();
