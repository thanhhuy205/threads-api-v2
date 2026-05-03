export const QUEUE_NAME = {
    PINECONE_QUEUE: 'pinecone_queue',
    EMAIL_QUEUE: 'email_queue',
    BLOOM_QUEUE: 'bloom_queue',
}


export const WORKER_NAME = {
    PINECONE_WORKER: 'pinecone_worker',
    EMAIL_WORKER: 'email_verification_worker',
    BLOOM_WORKER: 'bloom_worker',
}

export const PINECONE_JOB_NAME = {
    POST_EMBEDDING: 'post_embedding',
}
export const EMAIL_JOB_NAME = {
    SEND_VERIFICATION_EMAIL: 'send_verification_email',
    SEND_FORGOT_PASSWORD_EMAIL: 'send_forgot_password_email',
}

export const BLOOM_JOB_NAME = {
    GENERATE_BLOOM: 'generate_bloom',
}

export const BLOOM_KEY = {
    FILTER_USERNAME: 'filter:usernames  ',
    FILTER_EMAIL: 'filter:emails  ',
}