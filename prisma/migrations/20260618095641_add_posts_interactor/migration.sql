-- CreateTable
CREATE TABLE `post_interactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `post_id` INTEGER NOT NULL,
    `type_enum` ENUM('HIDE', 'SAVE') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_saves_user_id`(`user_id`),
    INDEX `idx_saves_post_id`(`post_id`),
    UNIQUE INDEX `uq_saves_user_post_type`(`user_id`, `post_id`, `type_enum`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `post_interactions` ADD CONSTRAINT `post_interactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_interactions` ADD CONSTRAINT `post_interactions_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
