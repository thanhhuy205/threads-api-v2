import { AUTH_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const notificationSwaggerSchemas = {
    NotificationGroupItem: {
        type: 'object',
        properties: {
            id: { type: 'number', example: 1 },
            publicId: { type: 'string', example: 'ntf_123' },
            recipientId: { type: 'string', example: 'user_123' },
            type: { type: 'string', example: 'LIKE' },
            targetType: { type: 'string', example: 'POST' },
            targetId: { type: 'string', example: 'post_123' },
            count: { type: 'number', example: 1 },
            isRead: { type: 'boolean', example: false },
            lastActorId: { type: 'string', example: 'user_456' },
            lastEventAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'publicId', 'recipientId', 'type', 'targetType', 'targetId', 'count', 'isRead', 'lastActorId', 'lastEventAt', 'createdAt', 'updatedAt'],
    },
    NotificationListResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/NotificationGroupItem' },
            },
            pagination: { $ref: '#/components/schemas/CursorPagination' },
        },
        required: ['success', 'data', 'pagination'],
    },
};

export const notificationSwaggerPaths = {
    '/notification': {
        get: {
            tags: ['Notification'],
            summary: 'Get notifications',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'after', in: 'query', schema: { type: 'string' } },
                { name: 'take', in: 'query', schema: { type: 'number' } },
            ],
            responses: {
                200: {
                    description: 'Notifications retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/NotificationListResponse',
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
