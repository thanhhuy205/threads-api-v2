-- AlterTable
ALTER TABLE `daily_quests` MODIFY `karmaReward` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user_karma` MODIFY `karma` INTEGER NOT NULL DEFAULT 1;
