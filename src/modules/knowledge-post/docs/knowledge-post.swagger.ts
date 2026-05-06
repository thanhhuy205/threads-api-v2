import { AUTH_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const knowledgePostSwaggerSchemas = {
    KnowledgePostRequest: {
        type: 'object',
        properties: {
            learningGoal: {
                type: 'string',
                example: 'Understand how the event loop works',
            },
            commonConfusion: {
                type: 'string',
                example: 'Why callbacks are executed after IO operations',
            },
            coreExplanation: {
                type: 'string',
                example: 'The event loop processes tasks from the callback queue after the current stack clears.',
            },
            understandingCheck: {
                type: 'string',
                example: 'What happens when setTimeout is called with 0ms?',
            },
        },
        required: ['learningGoal', 'commonConfusion', 'coreExplanation', 'understandingCheck'],
    },
    KnowledgePostCreatedSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Knowledge post created',
            },
            data: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        example: 'ckv8p4u1q0000x3jz8d2b6g7h',
                    },
                },
            },
        },
        required: ['success', 'message', 'data'],
    },
    KnowledgePostDeletedSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Knowledge post deleted',
            },
        },
        required: ['success', 'message'],
    },
};

const knowledgePostIdPathParameter = [
    {
        name: 'id',
        in: 'path',
        required: true,
        schema: {
            type: 'string',
            example: 'ckv8p4u1q0000x3jz8d2b6g7h',
        },
        description: 'Knowledge post id',
    },
];

export const knowledgePostSwaggerPaths = {
    '/knowledge-posts': {
        post: {
            tags: ['KnowledgePost'],
            summary: 'Create a knowledge post',
            security: bearerAuthSecurity,
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/KnowledgePostRequest',
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Knowledge post created',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/KnowledgePostCreatedSuccessResponse',
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
    '/knowledge-posts/{id}': {
        delete: {
            tags: ['KnowledgePost'],
            summary: 'Delete a knowledge post',
            security: bearerAuthSecurity,
            parameters: knowledgePostIdPathParameter,
            responses: {
                200: {
                    description: 'Knowledge post deleted',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/KnowledgePostDeletedSuccessResponse',
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
