-- AlterTable
ALTER TABLE `circle_exp_logs`
    ADD COLUMN `post_id` INTEGER NULL,
    ADD COLUMN `is_delta` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `idx_circle_exp_log_post_id` ON `circle_exp_logs`(`post_id`);

-- CreateIndex
CREATE INDEX `idx_circle_exp_log_exp_reason` ON `circle_exp_logs`(`exp_reason_enum`);

-- CreateIndex
CREATE INDEX `idx_circle_exp_log_is_delta` ON `circle_exp_logs`(`is_delta`);

-- CreateIndex
CREATE INDEX `idx_circle_exp_log_created_at` ON `circle_exp_logs`(`created_at`);

-- CreateIndex
CREATE UNIQUE INDEX `uq_circle_exp_logs_circle_post_reason` ON `circle_exp_logs`(`circle_id`, `post_id`, `exp_reason_enum`);

-- AddForeignKey
ALTER TABLE `circle_exp_logs`
    ADD CONSTRAINT `circle_exp_logs_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
