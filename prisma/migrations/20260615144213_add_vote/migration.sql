-- CreateTable
CREATE TABLE `votes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `poll_id` INTEGER NOT NULL,
    `poll_option_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_votes_user_id`(`user_id`),
    INDEX `idx_votes_poll_option_id`(`poll_option_id`),
    UNIQUE INDEX `uq_votes_user_poll_option`(`user_id`, `poll_option_id`),
    UNIQUE INDEX `uq_votes_user_poll`(`user_id`, `poll_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `votes` ADD CONSTRAINT `votes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `votes` ADD CONSTRAINT `votes_poll_id_fkey` FOREIGN KEY (`poll_id`) REFERENCES `polls`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `votes` ADD CONSTRAINT `votes_poll_option_id_fkey` FOREIGN KEY (`poll_option_id`) REFERENCES `poll_options`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
