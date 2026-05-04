/*
  Warnings:

  - You are about to drop the column `type` on the `post_media` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `post_media` DROP FOREIGN KEY `post_media_post_id_fkey`;

-- AlterTable
ALTER TABLE `post_media` DROP COLUMN `type`,
    ADD COLUMN `key` VARCHAR(255) NULL,
    ADD COLUMN `status_enum` ENUM('TEMPORARY', 'UPLOADING', 'UPLOADED', 'FAILED') NULL DEFAULT 'TEMPORARY',
    ADD COLUMN `type_enum` ENUM('IMAGE', 'VIDEO', 'GIF', 'OTHER') NULL,
    MODIFY `post_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `post_media` ADD CONSTRAINT `post_media_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
