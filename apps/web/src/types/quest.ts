import type { BaseResponse } from "./api";

export type DailyQuestItem = {
  code: string;
  description: string;
  action: string;
  progress: number;
  requirement: number;
  completed: boolean;
  claimed: boolean;
  claimedAt: string | null;
  karmaReward: number;
};

export type DailyQuestsData = {
  userId: string;
  cycleStartAt: string;
  cycleEndAt: string;
  quests: DailyQuestItem[];
  totalCompleted: number;
  totalKarma: number;
};

export type GetDailyQuestsResponse = BaseResponse<DailyQuestsData> & {
  success: true;
  message: "Daily quests retrieved successfully";
};

export type GetDailyQuestsUnauthorizedResponse = {
  success: false;
  message: string;
};

export type ClaimQuestData = {
  userId: string;
  totalKarma: number;
};

export type ClaimQuestResponse = BaseResponse<ClaimQuestData>;
