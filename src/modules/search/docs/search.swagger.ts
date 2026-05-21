import { AUTH_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const searchSwaggerSchemas = {
    SearchResultItem: {
        type: 'object',
        additionalProperties: true,
    },
    SearchResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Search results' },
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/SearchResultItem' },
            },
        },
        required: ['success', 'message', 'data'],
    },
};

export const searchSwaggerPaths = {
    '/search': {
        get: {
            tags: ['Search'],
            summary: 'Search users, posts, and hashtags',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'q', in: 'query', required: true, schema: { type: 'string', example: 'threads' } },
                { name: 'type', in: 'query', required: false, schema: { type: 'string', example: 'post' } },
            ],
            responses: {
                200: {
                    description: 'Search results',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SearchResponse' },
                        },
                    },
                },
                401: { description: AUTH_MESSAGE.TOKEN_INVALID },
            },
        },
    },
};