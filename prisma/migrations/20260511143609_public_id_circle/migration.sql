/*
  Warnings:

  - You are about to alter the column `name` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(20)`.
  - A unique constraint covering the columns `[publicId]` on the table `circles` will be added. If there are existing duplicate values, this will fail.
  - The required column `publicId` was added to the `circles` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `circles` ADD COLUMN `publicId` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `roles` MODIFY `name` VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `circles_publicId_key` ON `circles`(`publicId`);
