/*
  Warnings:

  - You are about to alter the column `status` on the `invitation_requests` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Enum(EnumId(18))`.

*/
-- AlterTable
ALTER TABLE `invitation_requests` MODIFY `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING';
