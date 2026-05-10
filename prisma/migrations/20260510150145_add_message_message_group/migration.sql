/*
  Warnings:

  - You are about to drop the column `user_id` on the `circles` table. All the data in the column will be lost.
  - You are about to drop the `relationships` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `idx_circles_user_id` ON `circles`;

-- AlterTable
ALTER TABLE `circles` DROP COLUMN `user_id`;

-- AlterTable
ALTER TABLE `follows` ADD COLUMN `is_following` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `reply_permission` ENUM('EVERYONE', 'FOLLOWERS', 'FOLLOWING', 'MENTIONED') NOT NULL DEFAULT 'EVERYONE',
    MODIFY `role` ENUM('USER', 'ADMIN') NULL DEFAULT 'USER';

-- DropTable
DROP TABLE `relationships`;

-- CreateTable
CREATE TABLE `message_groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `message_groups_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `messageGroupId` INTEGER NULL,

    INDEX `idx_messages_sender_id`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `message_groups` ADD CONSTRAINT `message_groups_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_messageGroupId_fkey` FOREIGN KEY (`messageGroupId`) REFERENCES `message_groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `circles` RENAME INDEX `circles_create_by_id_fkey` TO `idx_circles_created_by`;
