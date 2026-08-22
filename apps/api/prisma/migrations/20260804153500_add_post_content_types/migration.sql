-- Extend the post type enum with the supported content types.
ALTER TABLE `posts`
    MODIFY `type` ENUM('POST', 'REPLY', 'REPOST', 'QUOTE', 'ANNOUNCEMENT', 'DISCUSSION', 'KNOWLEDGE', 'QUESTION', 'INCIDENT', 'FEEDBACK') NOT NULL DEFAULT 'POST';
