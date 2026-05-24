import { AUTH_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const questSwaggerSchemas = {
    QuestItem: {
        type: 'object',
        properties: {
            code: { type: 'string', example: 'DAILY_POST' },
            description: { type: 'string', example: 'Dang 1 bai chat luong trong ngay' },
            action: { type: 'string', example: 'POST_CREATED' },
            karmaReward: { type: 'integer', example: 10 },
            requirement: { type: 'integer', example: 1 },
            progress: { type: 'integer', example: 0 },
            completed: { type: 'boolean', example: false },
            claimed: { type: 'boolean', example: false },
            claimedAt: { type: ['string', 'null'], format: 'date-time', example: null },
        },
    },
    DailyQuestData: {
        type: 'object',
        properties: {
            userId: { type: 'string', example: 'user_123' },
            cycleStartAt: {
                type: 'string',
                format: 'date-time',
                example: '2026-05-24T00:00:00.000Z',
            },
            cycleEndAt: {
                type: 'string',
                format: 'date-time',
                example: '2026-05-25T00:00:00.000Z',
            },
            quests: {
                type: 'array',
                items: { $ref: '#/components/schemas/QuestItem' },
            },
        },
        required: ['userId', 'cycleStartAt', 'cycleEndAt', 'quests'],
    },
    DailyQuestResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Daily quests retrieved successfully' },
            data: { $ref: '#/components/schemas/DailyQuestData' },
        },
        required: ['success', 'message', 'data'],
    },
    ClaimQuestResult: {
        type: 'object',
        properties: {
            userId: { type: 'string', example: 'user_123' },
            questId: { type: 'integer', example: 1 },
            karmaEarned: { type: 'integer', example: 20 },
            newTotal: { type: 'integer', example: 340 },
        },
        required: ['userId', 'questId', 'karmaEarned', 'newTotal'],
    },
    ClaimQuestResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Quest claimed successfully' },
            data: { $ref: '#/components/schemas/ClaimQuestResult' },
        },
        required: ['success', 'message', 'data'],
    },
};

export const questSwaggerPaths = {
    '/quests/daily': {
        get: {
            tags: ['Quest'],
            summary: 'Get daily quests',
            security: bearerAuthSecurity,
            responses: {
                200: {
                    description: 'Daily quests retrieved successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/DailyQuestResponse' },
                        },
                    },
                },
                401: { description: AUTH_MESSAGE.TOKEN_INVALID },
            },
        },
    },
    '/quests/{questId}/claim': {
        post: {
            tags: ['Quest'],
            summary: 'Claim a quest reward',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'questId', in: 'path', required: true, schema: { type: 'integer', example: 1 } },
            ],
            responses: {
                200: {
                    description: 'Quest claimed successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ClaimQuestResponse' },
                        },
                    },
                },
                401: { description: AUTH_MESSAGE.TOKEN_INVALID },
            },
        },
    },
};
