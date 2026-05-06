import { AUTH_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const sseSwaggerSchemas = {
    SseSubscriptionResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'SSE connection established',
            },
        },
        required: ['success', 'message'],
    },
};

export const sseSwaggerPaths = {
    '/sse': {
        get: {
            tags: ['SSE'],
            summary: 'Connect to server-sent events stream',
            security: bearerAuthSecurity,
            responses: {
                200: {
                    description: 'SSE stream opened',
                    content: {
                        'text/event-stream': {
                            schema: {
                                type: 'string',
                                example: 'data: event payload',
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
