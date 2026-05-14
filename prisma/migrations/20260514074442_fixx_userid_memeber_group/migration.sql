/*
  Warnings:

  - You are about to drop the column `created_by_id` on the `member_message_groups` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `member_message_groups` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `member_message_groups` DROP FOREIGN KEY `member_message_groups_created_by_id_fkey`;

-- DropIndex
DROP INDEX `idx_messages_sender_id` ON `member_message_groups`;

-- AlterTable
ALTER TABLE `member_message_groups` DROP COLUMN `created_by_id`,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `idx_messages_sender_id` ON `member_message_groups`(`user_id`);

-- AddForeignKey
ALTER TABLE `member_message_groups` ADD CONSTRAINT `member_message_groups_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
