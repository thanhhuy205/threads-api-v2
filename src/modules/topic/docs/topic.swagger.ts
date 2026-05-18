import { COMMON_MESSAGE } from '@/constants/message';

export const topicSwaggerSchemas = {
    TopicItem: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                example: 'nestjs',
            },
            count: {
                type: 'integer',
                example: 42,
            },
        },
        required: ['name', 'count'],
    },
    TopicNamesResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Topics retrieved',
            },
            data: {
                type: 'array',
                items: {
                    type: 'string',
                    example: 'nestjs',
                },
            },
        },
        required: ['success', 'message', 'data'],
    },
    TopicByNameResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Topic retrieved',
            },
            data: {
                $ref: '#/components/schemas/TopicItem',
            },
        },
        required: ['success', 'message', 'data'],
    },
    CreateTopicRequest: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                example: 'NestJS  ',
            },
        },
        required: ['name'],
    },
    TopicUpsertResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Topic upserted',
            },
            data: {
                $ref: '#/components/schemas/TopicItem',
            },
        },
        required: ['success', 'message', 'data'],
    },
};

export const topicSwaggerPaths = {
    '/topic': {
        get: {
            tags: ['Topic'],
            summary: 'Get topic names',
            responses: {
                200: {
                    description: 'Topics retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/TopicNamesResponse',
                            },
                        },
                    },
                },
            },
        },
        post: {
            tags: ['Topic'],
            summary: 'Create topic or increment count if exists',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/CreateTopicRequest',
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Topic upserted',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/TopicUpsertResponse',
                            },
                        },
                    },
                },
                400: {
                    description: COMMON_MESSAGE.VALIDATION_FAILED,
                },
            },
        },
    },
    '/topic/{name}': {
        get: {
            tags: ['Topic'],
            summary: 'Get topic by name',
            parameters: [
                {
                    name: 'name',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string',
                        example: 'nestjs',
                    },
                    description: 'Topic name',
                },
            ],
            responses: {
                200: {
                    description: 'Topic retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/TopicByNameResponse',
                            },
                        },
                    },
                },
                400: {
                    description: COMMON_MESSAGE.VALIDATION_FAILED,
                },
                404: {
                    description: 'Topic not found',
                },
            },
        },
    },
};
