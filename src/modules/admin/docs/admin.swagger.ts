import { COMMON_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const adminSwaggerSchemas = {
    AdminUserItem: {
        type: 'object',
        properties: {
            id: { type: 'string', example: 'user_123' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            username: { type: 'string', example: 'johndoe' },
            status: { type: 'string', example: 'ACTIVE' },
            verifiedAt: { type: ['string', 'null'], format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            roles: { type: 'array', items: { type: 'string', example: 'USER' } },
            isVerified: { type: 'boolean', example: true },
        },
    },
    AdminUserListResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Users retrieved successfully' },
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/AdminUserItem' },
            },
        },
    },
    AdminBanUserResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'User banned successfully' },
            data: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    status: { type: 'string', example: 'BANNED' },
                },
            },
        },
    },
    AdminModerateReportRequest: {
        type: 'object',
        properties: {
            action: { type: 'string', enum: ['approve', 'hide_post', 'delete_post'], example: 'hide_post' },
        },
        required: ['action'],
    },
    AdminModerateReportResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Admin report moderation route ready' },
            data: { type: 'object' },
        },
    },
    AdminTrendingHashtagsResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Admin trending hashtags route ready' },
            data: { type: 'array', items: { type: 'object' } },
        },
    },
    AdminStatisticsResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Admin statistics route ready' },
            data: { type: 'object' },
        },
    },
};

export const adminSwaggerPaths = {
    '/admin/users': {
        get: {
            tags: ['Admin'],
            summary: 'List all users for admin',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'after', in: 'query', schema: { type: 'string' } },
                { name: 'take', in: 'query', schema: { type: 'number', example: 10 } },
            ],
            responses: {
                200: {
                    description: 'Users retrieved successfully',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminUserListResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                403: { description: COMMON_MESSAGE.FORBIDDEN },
            },
        },
    },
    '/admin/users/{userId}/ban': {
        patch: {
            tags: ['Admin'],
            summary: 'Ban a user',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'userId', in: 'path', required: true, schema: { type: 'string' } },
            ],
            responses: {
                200: {
                    description: 'User banned successfully',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminBanUserResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                403: { description: COMMON_MESSAGE.FORBIDDEN },
            },
        },
    },
    '/admin/reports/{reportId}': {
        patch: {
            tags: ['Admin'],
            summary: 'Moderate a report',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'reportId', in: 'path', required: true, schema: { type: 'string' } },
            ],
            requestBody: {
                content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminModerateReportRequest' } } },
            },
            responses: {
                200: {
                    description: 'Report moderated successfully',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminModerateReportResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                403: { description: COMMON_MESSAGE.FORBIDDEN },
            },
        },
    },
    '/admin/hashtags/trending': {
        get: {
            tags: ['Admin'],
            summary: 'Get trending hashtags for admin',
            security: bearerAuthSecurity,
            responses: {
                200: {
                    description: 'Trending hashtags retrieved',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminTrendingHashtagsResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                403: { description: COMMON_MESSAGE.FORBIDDEN },
            },
        },
    },
    '/admin/stats': {
        get: {
            tags: ['Admin'],
            summary: 'Get system statistics overview',
            security: bearerAuthSecurity,
            responses: {
                200: {
                    description: 'Statistics retrieved',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminStatisticsResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
                403: { description: COMMON_MESSAGE.FORBIDDEN },
            },
        },
    },
};
