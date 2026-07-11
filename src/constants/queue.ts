export const QUEUE_NAME = {
  PINECONE_QUEUE: "pinecone_queue",
  EMAIL_QUEUE: "email_queue",
  BLOOM_QUEUE: "bloom_queue",
  LIKE_QUEUE: "like_queue",
  NOTIFICATION_QUEUE: "notification",
  AUTO_REMOVE_BAN_QUEUE: "auto_remove_ban_queue",
  POST_LIKE_EVENT_QUEUE: "likes_events",
  EVALUATION_QUEUE: "evaluation_queue",
  DELTA_HP_QUEUE: "delta_hp_queue",
  MESSAGE_QUEUE: "message_queue",
  FRIEND_REQUEST_QUEUE: "friend_request_queue",
  HLS_QUEUE: "hls_queue",
  VIDEO_QUEUE: "video_queue",
  SURVEY_SYNC_QUEUE: "survey_sync_queue",
};


export const WORKER_NAME = {
  PINECONE_WORKER: "pinecone_worker",
  EMAIL_WORKER: "email_verification_worker",
  BLOOM_WORKER: "bloom_worker",
  LIKE_WORKER: "like_worker",
  NOTIFICATION_WORKER: "notification_worker",
  AUTO_REMOVE_BAN_WORKER: "auto_remove_ban_worker",
  EVALUATE_WORKER: "evaluate_worker",
  DELTA_HP_WORKER: "delta_hp_worker",
  MESSAGE_WORKER: "message_worker",
  VIDEO_WORKER: "video_worker",
  SURVEY_SYNC_WORKER: "survey_sync_worker",
};

export const PINECONE_JOB_NAME = {
  POST_EMBEDDING: "post_embedding",
};

export const EMAIL_JOB_NAME = {
  SEND_VERIFICATION_EMAIL: "send_verification_email",
  SEND_FORGOT_PASSWORD_EMAIL: "send_forgot_password_email",
  SEND_INVITATION_EMAIL: "send_invitation_email",
};

export const DELTA_HP_JOB_NAME = {
  INCREASE_HP: "increase_hp",
  DECREASE_HP: "decrease_hp",
};

export const BLOOM_JOB_NAME = {
  GENERATE_BLOOM: "generate_bloom",
};

export const LIKE_JOB_NAME = {
  SYNC_POST_LIKE: "sync-post-like",
  INIT_SYNC_JOB: "init-sync-job",
};

export const AUTO_REMOVE_BAN_JOB_NAME = {
  RUN_AUTO_REMOVE_BAN: "run-auto-remove-ban",
};

export const NOTIFICATION_JOB_NAME = {
  INIT_SYNC_NOTIFICATION_BATCH: "initSyncNotificationBatch",
  BATCH_SYNC_NOTIFICATION: "batchSyncNotification",
  REALTIME_CHAT_NOTIFICATION: "realtimeChatNotification",
  REALTIME_FRIEND_REQUEST_NOTIFICATION: "realtimeFriendRequestNotification",
};

export const NOTIFICATION_JOB_KEY = {
  BATCH_SYNC_NOTIFICATION: "batch_sync_notification_job",
  REALTIME_CHAT_NOTIFICATION: "realtime_chat_notification_job",
}

export const BLOOM_KEY = {
  FILTER_USERNAME: "filter:usernames",
  FILTER_EMAIL: "filter:emails",
};

export const EVALUATION_JOB_NAME = {
  EVALUATION_POST: "evaluation-post",
  EVALUATION_REPORT: "evaluation-report",
};

export const HLS_JOB_NAME = {
  HLS_JOB_GENERATE_HLS: "hls_job_generate_hls",
};

export const SURVEY_SYNC_JOB_NAME = {
  SYNC_VOTE_COUNT: "sync_survey_vote_count",
};

export const SURVEY_SYNC = {
  INTERVAL_MS: 60 * 1000,
};
