import { AUTH_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const knowledgePostCommentSwaggerSchemas = {
    KnowledgePostCommentRequest: {
        type: 'object',
        properties: {
            content: {
                type: 'string',
                example: 'This explanation is very clear, thanks.',
            },
        },
        required: ['content'],
    },
    KnowledgePostCommentItem: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                example: 'cmabc123xyz',
            },
            knowledgePostId: {
                type: 'string',
                example: 'ckv8p4u1q0000x3jz8d2b6g7h',
            },
            userId: {
                type: 'string',
                example: 'ckv8p4u1q0000x3jz8d2b6g7i',
            },
            content: {
                type: 'string',
                example: 'I understand the event loop better now.',
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
            },
        },
        required: ['id', 'knowledgePostId', 'userId', 'content', 'createdAt', 'updatedAt'],
    },
    KnowledgePostCommentCreatedSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Reply created',
            },
            data: {
                $ref: '#/components/schemas/KnowledgePostCommentItem',
            },
        },
        required: ['success', 'message', 'data'],
    },
    KnowledgePostCommentListSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Replies retrieved',
            },
            data: {
                type: 'object',
                properties: {
                    rows: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/KnowledgePostCommentItem',
                        },
                    },
                    pageInfo: {
                        type: 'object',
                        properties: {
                            take: {
                                type: 'number',
                                example: 10,
                            },
                            after: {
                                type: 'string',
                                nullable: true,
                                example: 'cmabc123xyz',
                            },
                            hasMore: {
                                type: 'boolean',
                                example: true,
                            },
                        },
                        required: ['take', 'after', 'hasMore'],
                    },
                },
                required: ['rows', 'pageInfo'],
            },
        },
        required: ['success', 'message', 'data'],
    },
};

const knowledgePostIdPathParameter = [
    {
        name: 'knowledgePostId',
        in: 'path',
        required: true,
        schema: {
            type: 'string',
            example: 'ckv8p4u1q0000x3jz8d2b6g7h',
        },
        description: 'Knowledge post id',
    },
];

const knowledgePostCommentIdPathParameter = [
    ...knowledgePostIdPathParameter,
    {
        name: 'commentId',
        in: 'path',
        required: true,
        schema: {
            type: 'string',
            example: 'cmabc123xyz',
        },
        description: 'Knowledge post comment id',
    },
];

export const knowledgePostCommentSwaggerPaths = {
    '/knowledge-post-comments/{knowledgePostId}/replies': {
        post: {
            tags: ['KnowledgePostComment'],
            summary: 'Create reply for a knowledge post',
            security: bearerAuthSecurity,
            parameters: knowledgePostIdPathParameter,
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/KnowledgePostCommentRequest',
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Reply created',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/KnowledgePostCommentCreatedSuccessResponse',
                            },
                        },
                    },
                },
                401: {
                    description: AUTH_MESSAGE.TOKEN_INVALID,
                },
            },
        },
        get: {
            tags: ['KnowledgePostComment'],
            summary: 'Get replies by knowledge post using cursor pagination',
            security: bearerAuthSecurity,
            parameters: [
                ...knowledgePostIdPathParameter,
                {
                    name: 'after',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                        example: 'cmabc123xyz',
                    },
                    description: 'Cursor id from previous response pageInfo.after',
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
                    description: 'Number of comments to return',
                },
            ],
            responses: {
                200: {
                    description: 'Replies retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/KnowledgePostCommentListSuccessResponse',
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
    '/knowledge-post-comments/{knowledgePostId}/replies/{commentId}': {
        get: {
            tags: ['KnowledgePostComment'],
            summary: 'Get a reply by id',
            security: bearerAuthSecurity,
            parameters: knowledgePostCommentIdPathParameter,
            responses: {
                200: {
                    description: 'Reply retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/KnowledgePostCommentCreatedSuccessResponse',
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
