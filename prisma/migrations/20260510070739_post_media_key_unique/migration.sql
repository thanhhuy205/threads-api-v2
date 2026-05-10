/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `post_media` will be added. If there are existing duplicate values, this will fail.
  - Made the column `key` on table `post_media` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `post_media` MODIFY `key` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `post_media_key_key` ON `post_media`(`key`);
