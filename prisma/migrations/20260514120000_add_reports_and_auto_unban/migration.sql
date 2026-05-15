-- Add nullable temporary-ban expiry for admin moderation frames.
ALTER TABLE `users` ADD COLUMN `banned_until` DATETIME(3) NULL;

CREATE INDEX `idx_users_banned_until` ON `users`(`banned_until`);
CREATE INDEX `idx_users_status_banned_until` ON `users`(`status`, `banned_until`);

-- Report queue frame for POST/USER moderation targets.
CREATE TABLE `reports` (
    `id` VARCHAR(191) NOT NULL,
    `reporter_id` VARCHAR(191) NOT NULL,
    `target_type` ENUM('POST', 'USER') NOT NULL,
    `target_id` VARCHAR(255) NOT NULL,
    `reason` TEXT NOT NULL,
    `status` ENUM('PENDING', 'RESOLVED', 'DISMISSED') NOT NULL DEFAULT 'PENDING',
    `admin_note` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `idx_reports_reporter_id` ON `reports`(`reporter_id`);
CREATE INDEX `idx_reports_target` ON `reports`(`target_type`, `target_id`);
CREATE INDEX `idx_reports_status_created_at` ON `reports`(`status`, `created_at`);

ALTER TABLE `reports`
    ADD CONSTRAINT `reports_reporter_id_fkey`
    FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;
