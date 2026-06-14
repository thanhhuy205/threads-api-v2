export const webhooksSwaggerSchemas = {
    HlsWebhookData: {
        type: 'object',
        properties: {
            status: {
                type: 'string',
                enum: ['ready', 'errored', 'deleted'],
                example: 'ready',
            },
            url: {
                type: 'string',
                format: 'uri',
                example: 'https://cdn.example.com/bucket/hls/video-id/index.m3u8',
            },
            key: { type: 'string', example: 'video-id.mp4' },
        },
        required: ['status', 'url', 'key'],
    },
    HlsWebhookRequest: {
        type: 'object',
        properties: {
            title: { type: 'string', example: 'video-id' },
            outputCloudDir: { type: 'string', example: 'hls/video-id' },
            type: {
                type: 'string',
                enum: ['video.asset.ready', 'video.asset.errored', 'video.asset.deleted'],
                example: 'video.asset.ready',
            },
            data: { $ref: '#/components/schemas/HlsWebhookData' },
        },
        required: ['title', 'outputCloudDir', 'type', 'data'],
    },
    HlsWebhookResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Webhook received' },
            data: {
                type: 'object',
                properties: {
                    received: { type: 'boolean', example: true },
                },
                required: ['received'],
            },
        },
        required: ['success', 'message', 'data'],
    },
    LeonardoWebhookRequest: {
        type: 'object',
        properties: {
            type: { type: 'string', example: 'generation.completed' },
            data: {
                type: 'object',
                additionalProperties: true,
            },
        },
        additionalProperties: true,
    },
    LeonardoWebhookResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Leonardo webhook received' },
            data: {
                type: 'object',
                properties: {
                    received: { type: 'boolean', example: true },
                },
                required: ['received'],
            },
        },
        required: ['success', 'message', 'data'],
    },
};

export const webhooksSwaggerPaths = {
    '/webhooks/hls': {
        post: {
            tags: ['Webhooks'],
            summary: 'Receive local HLS processing events',
            security: [],
            parameters: [
                {
                    in: 'header',
                    name: 'x-webhook-signature',
                    required: true,
                    schema: { type: 'string' },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/HlsWebhookRequest' },
                    },
                },
            },
            responses: {
                200: {
                    description: 'HLS webhook received',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/HlsWebhookResponse' },
                        },
                    },
                },
                400: {
                    description: 'Missing webhook signature',
                },
                401: {
                    description: 'Invalid webhook signature',
                },
            },
        },
    },
    '/webhooks/leonardo': {
        post: {
            tags: ['Webhooks'],
            summary: 'Receive Leonardo webhook events',
            security: [{ leonardoWebhookAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/LeonardoWebhookRequest' },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Leonardo webhook received',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LeonardoWebhookResponse' },
                        },
                    },
                },
            },
        },
    },
};
