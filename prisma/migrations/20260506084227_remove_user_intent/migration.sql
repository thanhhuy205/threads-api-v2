/*
  Warnings:

  - You are about to drop the `user_intents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_intents` DROP FOREIGN KEY `user_intents_user_id_fkey`;

-- DropTable
DROP TABLE `user_intents`;
