DROP INDEX `idx_users_username_fulltext` ON `users`;
DROP INDEX `idx_users_name_fulltext` ON `users`;

CREATE FULLTEXT INDEX `idx_users_username_name_fulltext`
ON `users`(`username`, `name`) WITH PARSER ngram;
