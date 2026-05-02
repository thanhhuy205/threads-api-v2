export const AUTH_MESSAGE = {
    REGISTER_SUCCESS: 'Register success',
    LOGIN_SUCCESS: 'Login success',
    FORGOT_PASSWORD_SUCCESS: 'Forgot password success',
    UPDATE_USER_SUCCESS: 'Update user success',
    REFRESH_TOKEN_SUCCESS: 'Refresh token success',
    RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email success',
    VERIFY_EMAIL_SUCCESS: 'Verify email success',
    VALIDATE_EMAIL_SUCCESS: 'Validate email success',
    VALIDATE_USERNAME_SUCCESS: 'Validate username success',
    VALIDATE_RESET_PASSWORD_TOKEN_SUCCESS: 'Validate reset password token success',
    RESET_PASSWORD_SUCCESS: 'Reset password success',
    GET_ME_SUCCESS: 'Get me success',
    LOGOUT_SUCCESS: 'Logout success',
    INVALID_CREDENTIALS: 'Invalid credentials',
    TOKEN_INVALID: 'TOKEN_INVALID',
    USER_NOT_FOUND: 'User not found',
    USER_BANNED: 'USER_BANNED',
} as const;

export const AUTH_ERROR_MESSAGE = {
    USERNAME_INVALID: 'auth.error.usernameInvalid',
    USERNAME_RULE: 'auth.error.usernameRule',
    USERNAME_EXISTS: 'auth.error.usernameExists',
    EMAIL_INVALID: 'auth.error.emailInvalid',
    EMAIL_EXISTS: 'auth.error.emailExists',
    PASSWORD_INVALID: 'auth.error.passwordInvalid',
    PASSWORD_MIN: 'auth.error.passwordMin',
    PASSWORD_CONFIRM_NOT_MATCH: 'auth.error.passwordConfirmNotMatch',
} as const;

export const COMMON_MESSAGE = {
    BAD_REQUEST: 'Bad request',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    CONFLICT: 'Conflict',
    VALIDATION_FAILED: 'Validation failed',
    RESOURCE_ALREADY_EXISTS: 'Resource already exists',
    RESOURCE_NOT_FOUND: 'Resource not found',
    INVALID_RELATION_REFERENCE: 'Invalid relation reference',
    MISSING_REQUIRED_DATA: 'Missing required data',
    DATABASE_REQUEST_ERROR: 'Database request error',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    NOT_FOUND: 'Not found',
} as const;

export const HEALTH_MESSAGE = {
    SERVICE_IS_HEALTHY: 'Service is healthy',
} as const;

export const USER_MESSAGE = {
    GET_FOLLOWERS_SUCCESS: 'Get followers success',
    FOLLOW_SUCCESS: 'Follow success',
    UNFOLLOW_SUCCESS: 'Unfollow success',
} as const;

export const USER_INTENT_MESSAGE = {
    RETRIEVED: 'Feed intent retrieved',
    CREATED: 'Feed intent created',
    UPDATED: 'Feed intent updated',
    DELETED: 'Feed intent deleted',
    AT_LEAST_ONE_TEXT_REQUIRED: 'At least one of positiveText or negativeText is required',
} as const;

export const POST_MESSAGE = {
    NEWS_FEED_RETRIEVED: 'News feed retrieved',
    REPLIES_RETRIEVED: 'Replies retrieved',
    REPOSTS_RETRIEVED: 'Reposts retrieved',
    QUOTES_RETRIEVED: 'Quotes retrieved',
    CREATED: 'Post created',
    RETRIEVED: 'Posts retrieved',
    SEARCH_SUCCESS: 'Post search success',
} as const;

export const UPLOAD_MESSAGE = {
    UPLOAD_AVATAR_SUCCESS: 'Upload avatar success',
    UPLOAD_MEDIA_SUCCESS: 'Upload media success',
} as const;

export const JWT_MESSAGE = {
    INVALID_TOKEN: 'Invalid token',
} as const;

export const ENV_MESSAGE = {
    INVALID_ENVIRONMENT_VARIABLES: 'Invalid environment variables',
} as const;