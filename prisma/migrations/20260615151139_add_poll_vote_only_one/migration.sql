/*
  Warnings:

  - A unique constraint covering the columns `[user_id,poll_id]` on the table `votes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `poll_id` to the `votes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `votes` ADD COLUMN `poll_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `uq_votes_user_poll` ON `votes`(`user_id`, `poll_id`);

-- AddForeignKey
ALTER TABLE `votes` ADD CONSTRAINT `votes_poll_id_fkey` FOREIGN KEY (`poll_id`) REFERENCES `polls`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
