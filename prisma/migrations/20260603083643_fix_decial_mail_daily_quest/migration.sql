/*
  Warnings:

  - You are about to alter the column `karmaReward` on the `daily_quests` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(3,2)`.

*/
-- AlterTable
ALTER TABLE `daily_quests` MODIFY `karmaReward` DECIMAL(3, 2) NOT NULL;
