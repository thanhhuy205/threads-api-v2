-- CreateTable
CREATE TABLE `relationships` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subject` VARCHAR(255) NOT NULL,
    `subject_type` ENUM('USER', 'ADMIN', 'CIRCLE') NOT NULL,
    `relation` ENUM('MODERATOR', 'MEMBER', 'ADMIN', 'FOLLOWER', 'FOLLOWING', 'FRIEND') NOT NULL,
    `object` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `relationships_subject_relation_idx`(`subject`, `relation`),
    INDEX `relationships_object_relation_idx`(`object`, `relation`),
    UNIQUE INDEX `relationships_subject_relation_object_key`(`subject`, `relation`, `object`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
