/*
  Warnings:

  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_user_id_fkey`;

-- DropTable
DROP TABLE `notifications`;

-- CreateTable
CREATE TABLE `notification_groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `recipient_id` VARCHAR(191) NOT NULL,
    `type` ENUM('LIKE', 'FOLLOW', 'QUOTE', 'SHARE', 'MESSAGE', 'REPLY') NOT NULL,
    `target_type` VARCHAR(191) NOT NULL,
    `target_id` VARCHAR(191) NOT NULL,
    `actor_ids` JSON NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 1,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `last_actor_id` VARCHAR(191) NOT NULL,
    `last_event_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `notification_groups_public_id_key`(`public_id`),
    INDEX `notification_groups_recipient_id_is_read_last_event_at_idx`(`recipient_id`, `is_read`, `last_event_at`),
    INDEX `notification_groups_recipient_id_type_target_type_target_id_idx`(`recipient_id`, `type`, `target_type`, `target_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notification_groups` ADD CONSTRAINT `notification_groups_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
