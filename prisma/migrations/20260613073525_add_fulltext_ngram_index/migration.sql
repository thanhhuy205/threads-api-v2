-- This is an empty migration.

ALTER TABLE users DROP INDEX idx_users_username_fulltext;
ALTER TABLE users DROP INDEX idx_users_email_fulltext;
ALTER TABLE topics DROP INDEX idx_topics_name_fulltext;

CREATE FULLTEXT INDEX `idx_users_username_fulltext` ON `users`(`username`) WITH PARSER ngram;
CREATE FULLTEXT INDEX `idx_topics_name_fulltext` ON `topics`(`name`) WITH PARSER ngram;