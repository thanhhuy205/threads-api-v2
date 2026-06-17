/*
  Warnings:

  - A unique constraint covering the columns `[post_id]` on the table `polls` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `polls` ADD COLUMN `is_expired` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `uq_polls_post_id` ON `polls`(`post_id`);
