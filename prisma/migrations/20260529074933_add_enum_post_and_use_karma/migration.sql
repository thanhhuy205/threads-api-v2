-- AlterTable
ALTER TABLE `user_restrictions` MODIFY `type_enum` ENUM('POSTING', 'POST_AND_USE_KARMA') NOT NULL;
