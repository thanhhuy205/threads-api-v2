/*
  Warnings:

  - You are about to drop the column `knowledgeReasonId` on the `knowledge_posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `knowledge_posts` DROP FOREIGN KEY `knowledge_posts_knowledgeReasonId_fkey`;

-- DropIndex
DROP INDEX `knowledge_posts_knowledgeReasonId_fkey` ON `knowledge_posts`;

-- AlterTable
ALTER TABLE `knowledge_posts` DROP COLUMN `knowledgeReasonId`,
    ADD COLUMN `knowledge_reason_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `knowledge_posts` ADD CONSTRAINT `knowledge_posts_knowledge_reason_id_fkey` FOREIGN KEY (`knowledge_reason_id`) REFERENCES `knowledge_reasons`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
