/*
  Warnings:

  - Added the required column `create_by_id` to the `daily_quests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `daily_quests` ADD COLUMN `create_by_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `daily_quests` ADD CONSTRAINT `daily_quests_create_by_id_fkey` FOREIGN KEY (`create_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
