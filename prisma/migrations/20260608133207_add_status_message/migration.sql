-- AlterTable
ALTER TABLE `messages` ADD COLUMN `status_message_enum` ENUM('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED') NOT NULL DEFAULT 'PENDING';
