/*
  Warnings:

  - You are about to drop the column `expires_at` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `posts` DROP COLUMN `expires_at`,
    ADD COLUMN `date_range_from` DATETIME(3) NULL,
    ADD COLUMN `date_range_to` DATETIME(3) NULL,
    ADD COLUMN `scheduled_time_from` DATETIME(3) NULL,
    ADD COLUMN `scheduled_time_to` DATETIME(3) NULL;
