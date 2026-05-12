/*
  Warnings:

  - You are about to alter the column `type` on the `notifications` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Enum(EnumId(21))`.

*/
-- AlterTable
ALTER TABLE `notifications` MODIFY `type` ENUM('LIKE', 'FOLLOW', 'QUOTE', 'SHARE', 'MESSAGE', 'REPLY') NOT NULL;
