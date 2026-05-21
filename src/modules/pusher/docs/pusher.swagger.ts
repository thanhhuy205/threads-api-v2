import { AUTH_MESSAGE, COMMON_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const pusherSwaggerSchemas = {
    PusherAuthRequest: {
        type: 'object',
        properties: {
            socket_id: { type: 'string', example: '1234.5678' },
            channel_name: { type: 'string', example: 'private-chat-abc123' },
        },
        required: ['socket_id', 'channel_name'],
    },
    PusherAuthResponse: {
        type: 'object',
        additionalProperties: true,
        properties: {
            auth: { type: 'string', example: '12345:abcdef1234567890' },
            channel_data: { type: 'string', example: '{"user_id":"user_123"}' },
        },
        required: ['auth'],
    },
};

export const pusherSwaggerPaths = {
    '/pusher/auth': {
        post: {
            tags: ['Pusher'],
            summary: 'Authorize a private Pusher channel',
            security: bearerAuthSecurity,
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/PusherAuthRequest' },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Channel authorized',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/PusherAuthResponse' },
                        },
                    },
                },
                400: { description: COMMON_MESSAGE.BAD_REQUEST },
                401: { description: AUTH_MESSAGE.TOKEN_INVALID },
                403: { description: COMMON_MESSAGE.FORBIDDEN },
            },
        },
    },
};