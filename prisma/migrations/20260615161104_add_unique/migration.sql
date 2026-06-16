/*
  Warnings:

  - A unique constraint covering the columns `[id,poll_id]` on the table `poll_options` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `polls` ADD COLUMN `vote_count` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `uq_poll_options_id_poll_id` ON `poll_options`(`id`, `poll_id`);
