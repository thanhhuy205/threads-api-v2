import { AUTH_MESSAGE, COMMON_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const pollSwaggerSchemas = {
    PollVoteRequest: {
        type: 'object',
        properties: {
            pollOptionId: {
                type: 'integer',
                minimum: 1,
                example: 12,
            },
        },
        required: ['pollOptionId'],
    },
    PollVoteData: {
        type: 'object',
        properties: {
            totalVotes: { type: 'integer', example: 42 },
            votedCount: { type: 'integer', example: 10 },
            totalVotedCount: { type: 'integer', example: 10 },
            isVoted: { type: 'boolean', example: true },
        },
        required: ['totalVotes', 'votedCount', 'totalVotedCount', 'isVoted'],
    },
    PollVoteResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Vote created successfully' },
            data: { $ref: '#/components/schemas/PollVoteData' },
        },
        required: ['success', 'message', 'data'],
    },
};

export const pollSwaggerPaths = {
    '/polls/{pollId}/vote': {
        post: {
            tags: ['Poll'],
            summary: 'Vote for a poll option',
            security: bearerAuthSecurity,
            parameters: [
                {
                    name: 'pollId',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'integer',
                        minimum: 1,
                        example: 7,
                    },
                    description: 'Poll ID',
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/PollVoteRequest' },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Vote created successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/PollVoteResponse' },
                        },
                    },
                },
                400: { description: COMMON_MESSAGE.VALIDATION_FAILED },
                401: { description: AUTH_MESSAGE.TOKEN_INVALID },
                409: { description: 'Vote is being processed' },
            },
        },
    },
};
