/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `user_karma` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `uq_user_karma_user_id` ON `user_karma`(`user_id`);
