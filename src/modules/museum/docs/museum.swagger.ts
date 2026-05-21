import { AUTH_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const museumSwaggerSchemas = {
    MuseumItem: {
        type: 'object',
        properties: {
            publicId: { type: 'string', example: 'circle_public_stub_1' },
            summary: { type: 'string', example: 'Mot circle da duoc bao ton trong Museum of Echoes' },
            livedDays: { type: 'integer', example: 90 },
            maxLevel: { type: 'integer', example: 4 },
            featured: { type: 'boolean', example: true },
        },
    },
    MuseumListData: {
        type: 'object',
        properties: {
            items: {
                type: 'array',
                items: { $ref: '#/components/schemas/MuseumItem' },
            },
            nextCursor: { type: ['string', 'null'], example: 'museum_cursor_stub' },
            limit: { type: 'integer', example: 20 },
            sort: { type: 'string', example: 'recent' },
        },
        required: ['items', 'nextCursor', 'limit', 'sort'],
    },
    MuseumListResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Museum list retrieved successfully' },
            data: { $ref: '#/components/schemas/MuseumListData' },
        },
        required: ['success', 'message', 'data'],
    },
    MuseumHeroItem: {
        type: 'object',
        properties: {
            userId: { type: 'string', example: 'user_stub_hero_1' },
            badgeType: { type: 'string', example: 'SACRIFICE_HERO' },
        },
    },
    MuseumDetailData: {
        type: 'object',
        properties: {
            publicId: { type: 'string', example: 'circle_public_stub_1' },
            summary: { type: 'string', example: 'Circle nay da tung dat energy rat cao truoc khi tro thanh Soul Stone' },
            peakHp: { type: 'integer', example: 1000 },
            livedDays: { type: 'integer', example: 120 },
            topPostIds: { type: 'array', items: { type: 'integer' }, example: [1001, 1002, 1003] },
            maxLevel: { type: 'integer', example: 5 },
            totalMembers: { type: 'integer', example: 88 },
            heroes: { type: 'array', items: { $ref: '#/components/schemas/MuseumHeroItem' } },
        },
        required: ['publicId', 'summary', 'peakHp', 'livedDays', 'topPostIds', 'maxLevel', 'totalMembers', 'heroes'],
    },
    MuseumDetailResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Museum detail retrieved successfully' },
            data: { $ref: '#/components/schemas/MuseumDetailData' },
        },
        required: ['success', 'message', 'data'],
    },
};

export const museumSwaggerPaths = {
    '/museum': {
        get: {
            tags: ['Museum'],
            summary: 'Get museum archive list',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'limit', in: 'query', required: false, schema: { type: 'integer', example: 20 } },
                { name: 'cursor', in: 'query', required: false, schema: { type: 'string', example: 'museum_cursor_stub' } },
                { name: 'sort', in: 'query', required: false, schema: { type: 'string', enum: ['recent', 'longestLived'] } },
            ],
            responses: {
                200: {
                    description: 'Museum list retrieved successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/MuseumListResponse' },
                        },
                    },
                },
                401: { description: AUTH_MESSAGE.TOKEN_INVALID },
            },
        },
    },
    '/museum/{publicId}': {
        get: {
            tags: ['Museum'],
            summary: 'Get museum archive detail',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'publicId', in: 'path', required: true, schema: { type: 'string', example: 'circle_public_stub_1' } },
            ],
            responses: {
                200: {
                    description: 'Museum detail retrieved successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/MuseumDetailResponse' },
                        },
                    },
                },
                401: { description: AUTH_MESSAGE.TOKEN_INVALID },
            },
        },
    },
};