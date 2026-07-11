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
    TopicSearchPagination: {
        type: 'object',
        properties: {
            take: {
                type: 'integer',
                example: 10,
            },
            after: {
                type: ['string', 'null'],
                example: 'nestjs',
            },
            hasMore: {
                type: 'boolean',
                example: true,
            },
        },
        required: ['take', 'after', 'hasMore'],
    },
    TopicSearchData: {
        type: 'object',
        properties: {
            rows: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/TopicItem',
                },
            },
            pagination: {
                $ref: '#/components/schemas/TopicSearchPagination',
            },
        },
        required: ['rows', 'pagination'],
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
    TopicSearchResponse: {
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
                $ref: '#/components/schemas/TopicSearchData',
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

const topicSearchQueryParameters = [
    {
        name: 'q',
        in: 'query',
        required: true,
        schema: {
            type: 'string',
            example: 'nestjs',
        },
        description: 'Topic search keyword',
    },
    {
        name: 'after',
        in: 'query',
        required: false,
        schema: {
            type: 'string',
            example: 'nestjs',
        },
        description: 'Cursor from previous response pagination.after',
    },
    {
        name: 'take',
        in: 'query',
        required: false,
        schema: {
            type: 'integer',
            example: 10,
        },
        description: 'Number of items to return',
    },
];

export const topicSwaggerPaths = {
    '/topic': {
        get: {
            tags: ['Topic'],
            summary: 'Search topics by query',
            parameters: topicSearchQueryParameters,
            responses: {
                200: {
                    description: 'Topic retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/TopicSearchResponse',
                            },
                        },
                    },
                },
                400: {
                    description: COMMON_MESSAGE.VALIDATION_FAILED,
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
};
