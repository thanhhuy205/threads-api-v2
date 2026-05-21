export const webhooksSwaggerSchemas = {
    MuxWebhookPlaybackId: {
        type: 'object',
        properties: {
            id: { type: 'string', example: 'playback-123' },
            policy: { type: 'string', example: 'public' },
        },
    },
    MuxWebhookObject: {
        type: 'object',
        properties: {
            type: { type: 'string', example: 'asset' },
            id: { type: 'string', example: 'asset-123' },
        },
    },
    MuxWebhookData: {
        type: 'object',
        properties: {
            status: { type: 'string', example: 'ready' },
            playback_ids: {
                type: 'array',
                items: { $ref: '#/components/schemas/MuxWebhookPlaybackId' },
            },
            duration: { type: 'number', example: 120.4 },
            id: { type: 'string', example: 'asset-123' },
        },
    },
    MuxWebhookRequest: {
        type: 'object',
        properties: {
            type: { type: 'string', example: 'video.asset.ready' },
            created_at: { type: 'string', example: '2026-05-21T00:00:00Z' },
            object: { $ref: '#/components/schemas/MuxWebhookObject' },
            data: { $ref: '#/components/schemas/MuxWebhookData' },
            accessor_source: { type: ['string', 'null'], example: null },
            request_id: { type: 'string', example: 'req_123' },
        },
        required: ['type', 'created_at', 'object', 'data', 'request_id'],
    },
    MuxWebhookResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Mux webhook received' },
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
    '/webhooks/mux': {
        post: {
            tags: ['Webhooks'],
            summary: 'Receive Mux webhook events',
            security: [],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/MuxWebhookRequest' },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Mux webhook received',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/MuxWebhookResponse' },
                        },
                    },
                },
            },
        },
    },
};