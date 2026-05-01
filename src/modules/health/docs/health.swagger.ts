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
                example: 'Service is healthy',
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
            responses: {
                200: {
                    description: 'Service is healthy',
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