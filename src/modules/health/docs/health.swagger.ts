import { HEALTH_MESSAGE } from '@/constants/message';

export const healthSwaggerSchemas = {
    HealthPayload: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            service: {
                type: 'string',
                example: 'threads-api-v2',
            },
            status: {
                type: 'string',
                example: 'ok',
            },
            environment: {
                type: 'string',
                example: 'development',
            },
            timestamp: {
                type: 'string',
                format: 'date-time',
                example: '2026-05-01T00:00:00.000Z',
            },
        },
        required: ['success', 'service', 'status', 'environment', 'timestamp'],
    },
    HealthResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: HEALTH_MESSAGE.SERVICE_IS_HEALTHY,
            },
            data: {
                $ref: '#/components/schemas/HealthPayload',
            },
        },
        required: ['success', 'message', 'data'],
    },
};

export const healthSwaggerPaths = {
    '/health': {
        get: {
            tags: ['Health'],
            summary: 'Check service health',
            security: [],
            responses: {
                200: {
                    description: HEALTH_MESSAGE.SERVICE_IS_HEALTHY,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/HealthResponse',
                            },
                        },
                    },
                },
            },
        },
    },
};