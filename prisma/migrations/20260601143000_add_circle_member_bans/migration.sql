-- CreateTable
CREATE TABLE `circle_member_bans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `circle_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `banned_by_id` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(255) NULL,
    `expires_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `uq_circle_member_bans_circle_user`(`circle_id`, `user_id`),
    INDEX `idx_circle_member_bans_circle_id`(`circle_id`),
    INDEX `idx_circle_member_bans_user_id`(`user_id`),
    INDEX `idx_circle_member_bans_banned_by_id`(`banned_by_id`),
    INDEX `idx_circle_member_bans_expires_at`(`expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `circle_member_bans` ADD CONSTRAINT `circle_member_bans_circle_id_fkey` FOREIGN KEY (`circle_id`) REFERENCES `circles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_member_bans` ADD CONSTRAINT `circle_member_bans_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_member_bans` ADD CONSTRAINT `circle_member_bans_banned_by_id_fkey` FOREIGN KEY (`banned_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
