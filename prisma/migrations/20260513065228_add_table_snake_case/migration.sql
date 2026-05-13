/*
  Warnings:

  - You are about to drop the `circlesoulstone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cprsession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `circlesoulstone` DROP FOREIGN KEY `CircleSoulStone_circleId_fkey`;

-- DropForeignKey
ALTER TABLE `cprsession` DROP FOREIGN KEY `CprSession_circleId_fkey`;

-- DropTable
DROP TABLE `circlesoulstone`;

-- DropTable
DROP TABLE `cprsession`;

-- CreateTable
CREATE TABLE `cpr_sessions` (
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
CREATE TABLE `circle_soul_stones` (
    `id` VARCHAR(191) NOT NULL,
    `circleId` VARCHAR(191) NOT NULL,
    `summary` TEXT NOT NULL,
    `peakHp` INTEGER NOT NULL,
    `livedDays` INTEGER NOT NULL,
    `topPostIds` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `circle_soul_stones_circleId_key`(`circleId`),
    INDEX `circle_soul_stones_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cpr_sessions` ADD CONSTRAINT `cpr_sessions_circleId_fkey` FOREIGN KEY (`circleId`) REFERENCES `circles`(`publicId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_soul_stones` ADD CONSTRAINT `circle_soul_stones_circleId_fkey` FOREIGN KEY (`circleId`) REFERENCES `circles`(`publicId`) ON DELETE RESTRICT ON UPDATE CASCADE;
