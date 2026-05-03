-- AlterTable
ALTER TABLE `posts` ADD COLUMN `origin_public_id` VARCHAR(191) NULL,
    ADD COLUMN `parent_public_id` VARCHAR(191) NULL,
    ADD COLUMN `root_public_id` VARCHAR(191) NULL;
