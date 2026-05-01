export const postSwaggerSchemas = {
    PostRecord: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                example: 1,
            },
            content: {
                type: 'string',
                example: 'Hello Threads',
            },
            authorId: {
                type: 'string',
                example: 'ckv8p4u1q0000x3jz8d2b6g7h',
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2026-05-01T00:00:00.000Z',
            },
        },
        required: ['id', 'content', 'authorId', 'createdAt'],
    },
    CreatePostRequest: {
        type: 'object',
        properties: {
            content: {
                type: 'string',
                example: 'Hello Threads',
            },
            authorId: {
                type: 'string',
                example: 'ckv8p4u1q0000x3jz8d2b6g7h',
            },
        },
        required: ['content', 'authorId'],
    },
    PostListResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Posts retrieved',
            },
            data: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/PostRecord',
                },
            },
        },
        required: ['success', 'message', 'data'],
    },
    PostSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Post created',
            },
            data: {
                $ref: '#/components/schemas/PostRecord',
            },
        },
        required: ['success', 'message', 'data'],
    },
};

export const postSwaggerPaths = {
    '/posts': {
        get: {
            tags: ['Post'],
            summary: 'List posts',
            responses: {
                200: {
                    description: 'Posts retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PostListResponse',
                            },
                        },
                    },
                },
            },
        },
        post: {
            tags: ['Post'],
            summary: 'Create a post',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/CreatePostRequest',
                        },
                        example: {
                            content: 'Hello Threads',
                            authorId: 'ckv8p4u1q0000x3jz8d2b6g7h',
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Post created',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/PostSuccessResponse',
                            },
                        },
                    },
                },
                400: {
                    description: 'Validation failed',
                },
            },
        },
    },
};