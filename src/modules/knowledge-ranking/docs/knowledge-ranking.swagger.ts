import { AUTH_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const knowledgeRankingSwaggerSchemas = {
    KnowledgeRankingRequest: {
        type: 'object',
        properties: {
            criteria: {
                type: 'string',
                enum: ['CORRECTNESS', 'USEFULNESS', 'EXCELLENCE', 'INCOMPREHENSIBILITY', 'SUSPICIOUSNESS'],
                example: 'USEFULNESS',
            },
        },
        required: ['criteria'],
    },
    KnowledgeRankingCreatedSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Knowledge ranking created',
            },
            data: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        example: 'ckv8p4u1q0000x3jz8d2b6g7h',
                    },
                    criteria: {
                        type: 'string',
                        example: 'USEFULNESS',
                    },
                },
            },
        },
        required: ['success', 'message', 'data'],
    },
    KnowledgeRankingsRetrievedSuccessResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Knowledge rankings retrieved',
            },
            data: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: 'ckv8p4u1q0000x3jz8d2b6g7h',
                        },
                        criteria: {
                            type: 'string',
                            example: 'CORRECTNESS',
                        },
                    },
                },
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

export const knowledgeRankingSwaggerPaths = {
    '/knowledge-rankings/postRanking': {
        post: {
            tags: ['KnowledgeRanking'],
            summary: 'Create a knowledge ranking',
            security: bearerAuthSecurity,
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/KnowledgeRankingRequest',
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: 'Knowledge ranking created',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/KnowledgeRankingCreatedSuccessResponse',
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
    '/knowledge-rankings/{knowledgePostId}': {
        get: {
            tags: ['KnowledgeRanking'],
            summary: 'Get rankings for a knowledge post',
            security: bearerAuthSecurity,
            parameters: knowledgePostIdPathParameter,
            responses: {
                200: {
                    description: 'Knowledge rankings retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/KnowledgeRankingsRetrievedSuccessResponse',
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
