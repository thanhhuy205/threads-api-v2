export const QUEUE_NAME = {
  PINECONE_QUEUE: "pinecone_queue",
  EMAIL_QUEUE: "email_queue",
  BLOOM_QUEUE: "bloom_queue",
  LIKE_QUEUE: "like_queue",
  NOTIFICATION_QUEUE: "notification",
  AUTO_REMOVE_BAN_QUEUE: "auto_remove_ban_queue",
  LIKED_ADD_QUEUE: "likes_add",
  LIKED_REMOVE_QUEUE: "likes_remove",
  EVALUATION_QUEUE: "evaluation_queue",
};


export const WORKER_NAME = {
  PINECONE_WORKER: "pinecone_worker",
  EMAIL_WORKER: "email_verification_worker",
  BLOOM_WORKER: "bloom_worker",
  LIKE_WORKER: "like_worker",
  NOTIFICATION_WORKER: "notification_worker",
  AUTO_REMOVE_BAN_WORKER: "auto_remove_ban_worker",
  EVALUATE_WORKER: "evaluate_worker",
};

export const PINECONE_JOB_NAME = {
  POST_EMBEDDING: "post_embedding",
};
export const EMAIL_JOB_NAME = {
  SEND_VERIFICATION_EMAIL: "send_verification_email",
  SEND_FORGOT_PASSWORD_EMAIL: "send_forgot_password_email",
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
};

export const NOTIFICATION_JOB_KEY = {
  BATCH_SYNC_NOTIFICATION: "batch_sync_notification_job",
}

export const BLOOM_KEY = {
  FILTER_USERNAME: "filter:usernames",
  FILTER_EMAIL: "filter:emails",
};

export const EVALUATION_JOB_NAME = {
  EVALUATION_POST: "evaluation-post",
};
