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
    KnowledgePostItem: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                example: 'ckv8p4u1q0000x3jz8d2b6g7h',
            },
            userId: {
                type: 'string',
                example: 'ckv8p4u1q0000x3jz8d2b6g7i',
            },
            knowledgeReasonId: {
                type: 'integer',
                nullable: true,
                example: null,
            },
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
            status: {
                type: 'string',
                enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
                example: 'DRAFT',
            },
            approvalStatus: {
                type: 'string',
                enum: ['PENDING', 'APPROVED', 'REJECTED'],
                example: 'PENDING',
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
            },
            user: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    username: { type: 'string' },
                    name: { type: 'string', nullable: true },
                    avatar: { type: 'string', nullable: true },
                },
                required: ['id', 'username'],
            },
        },
        required: [
            'id',
            'userId',
            'knowledgeReasonId',
            'learningGoal',
            'commonConfusion',
            'coreExplanation',
            'understandingCheck',
            'status',
            'approvalStatus',
            'createdAt',
            'updatedAt',
            'user',
        ],
    },
    KnowledgePostPagination: {
        type: 'object',
        properties: {
            take: {
                type: 'number',
                example: 10,
            },
            after: {
                type: 'string',
                nullable: true,
                example: 'ckv8p4u1q0000x3jz8d2b6g7h',
            },
            hasMore: {
                type: 'boolean',
                example: true,
            },
        },
        required: ['take', 'after', 'hasMore'],
    },
    KnowledgePostListSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            data: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/KnowledgePostItem',
                },
            },
            pagination: {
                $ref: '#/components/schemas/KnowledgePostPagination',
            },
        },
        required: ['success', 'data', 'pagination'],
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
    KnowledgePostDetailSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Knowledge post fetched',
            },
            data: {
                $ref: '#/components/schemas/KnowledgePostItem',
            },
        },
        required: ['success', 'message', 'data'],
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
        get: {
            tags: ['KnowledgePost'],
            summary: 'Get knowledge posts using cursor pagination',
            parameters: [
                {
                    name: 'after',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                        example: 'ckv8p4u1q0000x3jz8d2b6g7h',
                    },
                    description: 'Cursor id from previous response pagination.after',
                },
                {
                    name: 'take',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'number',
                        example: 10,
                        minimum: 1,
                        maximum: 100,
                    },
                    description: 'Number of knowledge posts to return',
                },
            ],
            responses: {
                200: {
                    description: 'Knowledge posts retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/KnowledgePostListSuccessResponse',
                            },
                        },
                    },
                },
            },
        },
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
        get: {
            tags: ['KnowledgePost'],
            summary: 'Get knowledge post detail',
            parameters: knowledgePostIdPathParameter,
            responses: {
                200: {
                    description: 'Knowledge post fetched',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/KnowledgePostDetailSuccessResponse',
                            },
                        },
                    },
                },
                404: {
                    description: 'Knowledge post not found',
                },
            },
        },
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
