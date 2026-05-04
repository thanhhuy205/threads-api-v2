-- AlterTable
ALTER TABLE `circle_members` ADD COLUMN `role` ENUM('OWNER', 'ADMIN', 'MEMBER') NOT NULL DEFAULT 'MEMBER';

-- CreateTable
CREATE TABLE `invitation_requests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `circle_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_invitation_requests_circle_id`(`circle_id`),
    INDEX `idx_invitation_requests_user_id`(`user_id`),
    UNIQUE INDEX `uq_invitation_requests_circle_user`(`circle_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `circle_invitations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `circle_id` INTEGER NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `inviter_id` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_circle_invitations_circle_id`(`circle_id`),
    INDEX `idx_circle_invitations_user_id`(`user_id`),
    INDEX `idx_circle_invitations_inviter_id`(`inviter_id`),
    UNIQUE INDEX `uq_circle_invitations_circle_user`(`circle_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `invitation_requests` ADD CONSTRAINT `invitation_requests_circle_id_fkey` FOREIGN KEY (`circle_id`) REFERENCES `circles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitation_requests` ADD CONSTRAINT `invitation_requests_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_invitations` ADD CONSTRAINT `circle_invitations_circle_id_fkey` FOREIGN KEY (`circle_id`) REFERENCES `circles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_invitations` ADD CONSTRAINT `circle_invitations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `circle_invitations` ADD CONSTRAINT `circle_invitations_inviter_id_fkey` FOREIGN KEY (`inviter_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
