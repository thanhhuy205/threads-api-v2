import { AUTH_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const internalSwaggerSchemas = {
    JudgeCompleteRequest: {
        type: 'object',
        properties: {
            postId: { type: 'integer', example: 1001 },
            score: { type: 'number', example: 8.4 },
            category: { type: 'string', example: 'quality' },
            hpDelta: { type: 'integer', example: 20 },
            expDelta: { type: 'integer', example: 15 },
            flags: { type: 'array', items: { type: 'string' }, example: ['spam_check_passed'] },
        },
        required: ['postId', 'score', 'category', 'hpDelta', 'expDelta'],
    },
    JudgeCompleteData: {
        type: 'object',
        properties: {
            processed: { type: 'boolean', example: true },
            postId: { type: 'integer', example: 1001 },
            score: { type: 'number', example: 8.4 },
            category: { type: 'string', example: 'quality' },
            hpDelta: { type: 'integer', example: 20 },
            expDelta: { type: 'integer', example: 15 },
            flags: { type: 'array', items: { type: 'string' } },
            syncedAt: { type: 'string', format: 'date-time' },
        },
        required: ['processed', 'postId', 'score', 'category', 'hpDelta', 'expDelta', 'flags', 'syncedAt'],
    },
    JudgeCompleteResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Judge complete handled successfully' },
            data: { $ref: '#/components/schemas/JudgeCompleteData' },
        },
        required: ['success', 'message', 'data'],
    },
};

export const internalSwaggerPaths = {
    '/internal/judge-complete': {
        post: {
            tags: ['Internal'],
            summary: 'Handle judge-complete callback',
            security: bearerAuthSecurity,
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/JudgeCompleteRequest' },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Judge complete handled successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/JudgeCompleteResponse' },
                        },
                    },
                },
                401: { description: AUTH_MESSAGE.TOKEN_INVALID },
            },
        },
    },
};