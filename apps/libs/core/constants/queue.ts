export const QUEUE_NAME = {
  EMAIL_QUEUE: "email_queue",
  BLOOM_QUEUE: "bloom_queue",
  LIKE_QUEUE: "like_queue",
  NOTIFICATION_QUEUE: "notification",
  AUTO_REMOVE_BAN_QUEUE: "auto_remove_ban_queue",
  POST_LIKE_EVENT_QUEUE: "likes_events",
  EVALUATION_QUEUE: "evaluation_queue",
  FRIEND_REQUEST_QUEUE: "friend_request_queue",
  HLS_QUEUE: "hls_queue",
  VIDEO_QUEUE: "video_queue",
  SURVEY_SYNC_QUEUE: "survey_sync_queue",
};


export const WORKER_NAME = {
  EMAIL_WORKER: "email_verification_worker",
  BLOOM_WORKER: "bloom_worker",
  LIKE_WORKER: "like_worker",
  NOTIFICATION_WORKER: "notification_worker",
  AUTO_REMOVE_BAN_WORKER: "auto_remove_ban_worker",
  EVALUATE_WORKER: "evaluate_worker",
  VIDEO_WORKER: "video_worker",
  SURVEY_SYNC_WORKER: "survey_sync_worker",
};

export const EMAIL_JOB_NAME = {
  SEND_VERIFICATION_EMAIL: "send_verification_email",
  SEND_FORGOT_PASSWORD_EMAIL: "send_forgot_password_email",
  SEND_INVITATION_EMAIL: "send_invitation_email",
};

export const BLOOM_JOB_NAME = {
  GENERATE_BLOOM: "generate_bloom",
};

export const LIKE_JOB_NAME = {
  SYNC_POST_LIKE: "sync-post-like",
  INIT_SYNC_JOB: "init-sync-job",
};

export const AUTO_REMOVE_BAN_JOB_NAME = {
};

export const NOTIFICATION_JOB_NAME = {
  INIT_SYNC_NOTIFICATION_BATCH: "initSyncNotificationBatch",
  BATCH_SYNC_NOTIFICATION: "batchSyncNotification",
  REALTIME_FRIEND_REQUEST_NOTIFICATION: "realtimeFriendRequestNotification",
};

export const NOTIFICATION_JOB_KEY = {
  BATCH_SYNC_NOTIFICATION: "batch_sync_notification_job",
}

export const BLOOM_KEY = {
  FILTER_USERNAME: "filter:usernames",
  FILTER_EMAIL: "filter:emails",
};

export const EVALUATION_JOB_NAME = {
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
