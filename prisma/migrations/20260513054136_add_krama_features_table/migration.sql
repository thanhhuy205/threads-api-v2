/*
  Warnings:

  - Added the required column `description` to the `circles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `circles` ADD COLUMN `description` TEXT NOT NULL,
    ADD COLUMN `status_peak` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `circle_energy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `circle_id` INTEGER NOT NULL,
    `current` INTEGER NOT NULL DEFAULT 500,
    `max` INTEGER NOT NULL DEFAULT 1000,
    `peak` INTEGER NOT NULL DEFAULT 500,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_circle_energy_circle_id`(`circle_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `circle_post_quality_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `circle_id` INTEGER NOT NULL,
    `post_id` INTEGER NOT NULL,
    `score` INTEGER NOT NULL DEFAULT 0,
    `hp_delta` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_circle_post_quality_log_circle_id`(`circle_id`),
    INDEX `idx_circle_post_quality_log_post_id`(`post_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_karma` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `karma` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_user_karma_user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_restrictions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `type_enum` ENUM('POSTING') NOT NULL,
    `reason` VARCHAR(255) NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_user_restrictions_user_id`(`user_id`),
    INDEX `idx_user_restrictions_type`(`type_enum`),
    INDEX `idx_user_restrictions_expires_at`(`expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CprSession` (
    `id` VARCHAR(191) NOT NULL,
    `circleId` VARCHAR(191) NOT NULL,
    `activatedBy` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `resolved` BOOLEAN NOT NULL DEFAULT false,
    `success` BOOLEAN NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CircleSoulStone` (
    `id` VARCHAR(191) NOT NULL,
    `circleId` VARCHAR(191) NOT NULL,
    `summary` TEXT NOT NULL,
    `peakHp` INTEGER NOT NULL,
    `livedDays` INTEGER NOT NULL,
    `topPostIds` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CircleSoulStone_circleId_key`(`circleId`),
    INDEX `CircleSoulStone_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `circle_energy` ADD CONSTRAINT `circle_energy_circle_id_fkey` FOREIGN KEY (`circle_id`) REFERENCES `circles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_post_quality_logs` ADD CONSTRAINT `circle_post_quality_logs_circle_id_fkey` FOREIGN KEY (`circle_id`) REFERENCES `circles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_post_quality_logs` ADD CONSTRAINT `circle_post_quality_logs_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_karma` ADD CONSTRAINT `user_karma_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_restrictions` ADD CONSTRAINT `user_restrictions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CprSession` ADD CONSTRAINT `CprSession_circleId_fkey` FOREIGN KEY (`circleId`) REFERENCES `circles`(`publicId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CircleSoulStone` ADD CONSTRAINT `CircleSoulStone_circleId_fkey` FOREIGN KEY (`circleId`) REFERENCES `circles`(`publicId`) ON DELETE RESTRICT ON UPDATE CASCADE;
