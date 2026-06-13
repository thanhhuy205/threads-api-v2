-- This is an empty migration.
DROP INDEX idx_users_name_fulltext ON users;

ALTER TABLE users
ADD FULLTEXT INDEX idx_users_name_fulltext (name) WITH PARSER ngram;