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
    NotificationUnreadStatusResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Notification unread status retrieved' },
            data: {
                type: 'object',
                properties: {
                    isNotification: { type: 'boolean', example: true },
                },
                required: ['isNotification'],
            },
        },
        required: ['success', 'message', 'data'],
    },
    NotificationReadResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Notifications marked as read' },
            data: {
                type: 'object',
                properties: {
                    isRead: { type: 'boolean', example: true },
                },
                required: ['isRead'],
            },
        },
        required: ['success', 'message', 'data'],
    },
    NotificationUnreadMessagesResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Unread message groups retrieved' },
            data: {
                type: 'object',
                properties: {
                    unreadGroupCount: { type: 'integer', example: 3 },
                },
                required: ['unreadGroupCount'],
            },
        },
        required: ['success', 'message', 'data'],
    },
    NotificationFriendRequestCountResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Friend request count retrieved' },
            data: {
                type: 'object',
                properties: {
                    friendRequestCount: { type: 'integer', example: 2 },
                },
                required: ['friendRequestCount'],
            },
        },
        required: ['success', 'message', 'data'],
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
    '/notification/unread': {
        get: {
            tags: ['Notification'],
            summary: 'Get unread notification status',
            security: bearerAuthSecurity,
            responses: {
                200: {
                    description: 'Notification unread status retrieved',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/NotificationUnreadStatusResponse' },
                        },
                    },
                },
                401: {
                    description: AUTH_MESSAGE.TOKEN_INVALID,
                },
            },
        },
    },
    '/notification/read': {
        post: {
            tags: ['Notification'],
            summary: 'Mark notifications as read',
            security: bearerAuthSecurity,
            responses: {
                200: {
                    description: 'Notifications marked as read',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/NotificationReadResponse' },
                        },
                    },
                },
                401: {
                    description: AUTH_MESSAGE.TOKEN_INVALID,
                },
            },
        },
    },
    '/notification/message': {
        get: {
            tags: ['Notification'],
            summary: 'Get unread message group count',
            security: bearerAuthSecurity,
            responses: {
                200: {
                    description: 'Unread message groups retrieved',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/NotificationUnreadMessagesResponse' },
                        },
                    },
                },
                401: {
                    description: AUTH_MESSAGE.TOKEN_INVALID,
                },
            },
        },
    },
    '/notification/friend-request': {
        get: {
            tags: ['Notification'],
            summary: 'Get received friend request count',
            security: bearerAuthSecurity,
            responses: {
                200: {
                    description: 'Friend request count retrieved',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/NotificationFriendRequestCountResponse' },
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
