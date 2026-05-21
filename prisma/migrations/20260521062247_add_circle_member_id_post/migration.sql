/*
  Warnings:

  - Added the required column `circle_member_id` to the `circle_post_quality_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `circle_post_quality_logs` ADD COLUMN `circle_member_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `circle_post_quality_logs` ADD CONSTRAINT `circle_post_quality_logs_circle_member_id_fkey` FOREIGN KEY (`circle_member_id`) REFERENCES `circle_members`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
