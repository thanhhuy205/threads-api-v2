-- AlterTable
ALTER TABLE `notification_groups` MODIFY `type` ENUM('POST', 'LIKE', 'FOLLOW', 'QUOTE', 'SHARE', 'MESSAGE', 'REPLY', 'MENTION') NOT NULL;
