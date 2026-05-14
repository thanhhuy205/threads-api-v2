/*
  Warnings:

  - The primary key for the `message_groups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `messageGroupId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `messages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[public_id]` on the table `messages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `last_message_at` to the `message_groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message_group_id` to the `messages` table without a default value. This is not possible if the table is not empty.
  - The required column `public_id` was added to the `messages` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `sender_id` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_messageGroupId_fkey`;

-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_userId_fkey`;

-- DropIndex
DROP INDEX `idx_messages_sender_id` ON `messages`;

-- DropIndex
DROP INDEX `messages_messageGroupId_fkey` ON `messages`;

-- AlterTable
ALTER TABLE `message_groups` DROP PRIMARY KEY,
    ADD COLUMN `last_message_at` DATETIME(3) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `messages` DROP COLUMN `messageGroupId`,
    DROP COLUMN `userId`,
    ADD COLUMN `message_group_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `public_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `sender_id` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `member_message_groups` (
    `id` VARCHAR(191) NOT NULL,
    `created_by_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `messageGroupId` VARCHAR(191) NULL,

    INDEX `idx_messages_sender_id`(`created_by_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `messages_public_id_key` ON `messages`(`public_id`);

-- CreateIndex
CREATE INDEX `idx_messages_sender_id` ON `messages`(`sender_id`);

-- AddForeignKey
ALTER TABLE `member_message_groups` ADD CONSTRAINT `member_message_groups_messageGroupId_fkey` FOREIGN KEY (`messageGroupId`) REFERENCES `message_groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_message_groups` ADD CONSTRAINT `member_message_groups_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_message_group_id_fkey` FOREIGN KEY (`message_group_id`) REFERENCES `message_groups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
