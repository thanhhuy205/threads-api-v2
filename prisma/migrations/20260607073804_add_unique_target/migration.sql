/*
  Warnings:

  - A unique constraint covering the columns `[user_id,type_enum,targetId]` on the table `user_action_logs` will be added. If there are existing duplicate values, this will fail.
  - Made the column `targetId` on table `user_action_logs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user_action_logs` MODIFY `targetId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `uq_user_action_logs_user_type_target` ON `user_action_logs`(`user_id`, `type_enum`, `targetId`);
