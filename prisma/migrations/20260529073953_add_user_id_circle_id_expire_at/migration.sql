/*
  Warnings:

  - A unique constraint covering the columns `[user_id,circle_id]` on the table `hero_badges` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `hero_badges` ADD COLUMN `expire_at` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `uq_hero_badges_user_circle` ON `hero_badges`(`user_id`, `circle_id`);
