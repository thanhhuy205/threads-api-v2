export const QUEUE_NAME = {
  PINECONE_QUEUE: "pinecone_queue",
  EMAIL_QUEUE: "email_queue",
  BLOOM_QUEUE: "bloom_queue",
  LIKE_QUEUE: "like_queue",
  LIKED_ADD_QUEUE: "likes_add",
  LIKED_REMOVE_QUEUE: "likes_remove",
};


export const WORKER_NAME = {
  PINECONE_WORKER: "pinecone_worker",
  EMAIL_WORKER: "email_verification_worker",
  BLOOM_WORKER: "bloom_worker",
  LIKE_WORKER: "like_worker",
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

export const BLOOM_KEY = {
  FILTER_USERNAME: "filter:usernames  ",
  FILTER_EMAIL: "filter:emails  ",
};
