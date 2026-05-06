import { AUTH_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const notificationSwaggerSchemas = {
    NotificationCreatedSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Welcome notification sent',
            },
            data: {
                type: 'object',
                nullable: true,
                example: {
                    id: 'ckv8p4u1q0000x3jz8d2b6g7h',
                },
            },
        },
        required: ['success', 'message'],
    },
};

export const notificationSwaggerPaths = {
    '/notification/welcome': {
        get: {
            tags: ['Notification'],
            summary: 'Send a welcome notification',
            security: bearerAuthSecurity,
            responses: {
                200: {
                    description: 'Welcome notification sent',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/NotificationCreatedSuccessResponse',
                            },
                        },
                    },
                },
                401: {
                    description: AUTH_MESSAGE.TOKEN_INVALID,
                },
            },
        },
    },
};
