class QuestService {
    async getDailyQuests(userId: string) {
        return {
            userId,
            quests: [
                {
                    id: 1,
                    code: 'DAILY_POST',
                    description: 'Dang 1 bai chat luong trong ngay',
                    karmaReward: 10,
                    requirement: 1,
                    progress: 0,
                    completed: false,
                    claimedAt: null,
                },
                {
                    id: 2,
                    code: 'DAILY_COMMENT',
                    description: 'Binh luan 3 lan trong circle',
                    karmaReward: 15,
                    requirement: 3,
                    progress: 1,
                    completed: false,
                    claimedAt: null,
                },
                {
                    id: 3,
                    code: 'DAILY_HELP_CIRCLE',
                    description: 'Sacrifice 1 lan de cuu circle',
                    karmaReward: 20,
                    requirement: 1,
                    progress: 1,
                    completed: true,
                    claimedAt: null,
                },
            ],
        };
    }

    async claimQuest(userId: string, questId: number) {
        return {
            userId,
            questId,
            karmaEarned: 20,
            newTotal: 340,
        };
    }
}

export const questService = new QuestService();
