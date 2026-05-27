/*
  Warnings:

  - You are about to drop the column `is_read` on the `messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `member_message_groups` ADD COLUMN `unreadCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `messages` DROP COLUMN `is_read`;
