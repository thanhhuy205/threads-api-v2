import { COMMON_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const circleSwaggerSchemas = {
    CreateCircleRequest: {
        type: 'object',
        properties: {
            name: { type: 'string', example: 'my-circle' },
            visibility: { type: 'string', example: 'PUBLIC' },
        },
        required: ['name'],
    },
    CircleItem: {
        type: 'object',
        properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'my-circle' },
            userId: { type: 'string', example: 'user_123' },
            visibility: { type: 'string', example: 'PUBLIC' },
            createById: { type: 'string', example: 'user_123' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name', 'userId', 'visibility', 'createById', 'createdAt', 'updatedAt'],
    },
    CircleEnergyItem: {
        type: 'object',
        properties: {
            current: { type: 'number', example: 500 },
            max: { type: 'number', example: 1000 },
            peak: { type: 'number', example: 500 },
            createdAt: { type: 'string', format: 'date-time' },
        },
        required: ['current', 'max', 'peak', 'createdAt'],
    },
    CircleDetailItem: {
        type: 'object',
        properties: {
            id: { type: 'number', example: 1 },
            publicId: { type: 'string', example: 'clr_123' },
            name: { type: 'string', example: 'Vòng tròn' },
            description: { type: 'string', example: 'Một circle mẫu để xem chi tiết' },
            visibility: { type: 'string', example: 'PUBLIC' },
            memberCount: { type: 'number', example: 0 },
            energy: { $ref: '#/components/schemas/CircleEnergyItem' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'publicId', 'name', 'description', 'visibility', 'memberCount', 'energy', 'createdAt', 'updatedAt'],
    },
    CircleInvitationItem: {
        type: 'object',
        properties: {
            userId: { type: 'string', example: 'user_456' },
            id: { type: 'number', example: 12 },
            status: { type: 'string', enum: ['PENDING', 'ACCEPTED', 'REJECTED'], example: 'PENDING' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            circleId: { type: 'number', example: 1 },
            inviterId: { type: 'string', example: 'user_123' },
        },
        required: ['userId', 'id', 'status', 'createdAt', 'updatedAt', 'circleId', 'inviterId'],
    },
    CursorPagination: {
        type: 'object',
        properties: {
            take: { type: 'number', example: 10 },
            after: { type: ['string', 'number', 'null'], example: 'cuid_string_here' },
            hasMore: { type: 'boolean', example: true },
        },
        required: ['take', 'hasMore'],
    },
    CreateCircleResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Circle created successfully' },
            data: { $ref: '#/components/schemas/CircleItem' },
        },
        required: ['success', 'message', 'data'],
    },
    CircleDetailResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Circle detail retrieved successfully' },
            data: { $ref: '#/components/schemas/CircleDetailItem' },
        },
        required: ['success', 'message', 'data'],
    },
    CircleListResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Circles retrieved' },
            data: {
                type: 'object',
                properties: {
                    items: { type: 'array', items: { $ref: '#/components/schemas/CircleItem' } },
                    pagination: { $ref: '#/components/schemas/CursorPagination' },
                },
            },
        },
        required: ['success', 'message', 'data'],
    },
    SendInvitationRequest: {
        type: 'object',
        properties: {
            circleId: { type: 'number', example: 1 },
            userId: { type: 'string', example: 'user_456' },
        },
        required: ['circleId', 'userId'],
    },
    SendInvitationResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Invitation sent' },
        },
        required: ['success', 'message'],
    },
    ResponseInvitationRequest: {
        type: 'object',
        properties: {
            circleId: { type: 'number', example: 1 },
            status: { type: 'string', enum: ['ACCEPTED', 'REJECTED'] },
        },
        required: ['circleId', 'status'],
    },
    ResponseInvitationResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Invitation response recorded' },
        },
        required: ['success', 'message'],
    },
    RequestInvitationResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/CircleInvitationItem' },
            },
            pagination: { $ref: '#/components/schemas/CursorPagination' },
        },
        required: ['success', 'data', 'pagination'],
    },
};

export const circleSwaggerPaths = {
    '/circle': {
        get: {
            tags: ['Circle'],
            summary: 'List circles',
            parameters: [
                { name: 'after', in: 'query', schema: { type: 'string' } },
                { name: 'take', in: 'query', schema: { type: 'number' } },
            ],
            responses: {
                200: {
                    description: 'Circles retrieved',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CircleListResponse' } } },
                },
            },
        },
        post: {
            tags: ['Circle'],
            summary: 'Create a circle',
            security: bearerAuthSecurity,
            requestBody: {
                content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCircleRequest' } } },
            },
            responses: {
                201: {
                    description: 'Circle created',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCircleResponse' } } },
                },
                400: { description: COMMON_MESSAGE.BAD_REQUEST },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
            },
        },
    },
    '/circle/{publicId}': {
        get: {
            tags: ['Circle'],
            summary: 'Get circle detail by publicId',
            parameters: [
                { name: 'publicId', in: 'path', required: true, schema: { type: 'string' } },
            ],
            responses: {
                200: {
                    description: 'Circle detail retrieved',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CircleDetailResponse' } } },
                },
                404: { description: COMMON_MESSAGE.NOT_FOUND },
            },
        },
    },
    '/circle/send-invitation': {
        post: {
            tags: ['Circle'],
            summary: 'Send invitation to join a circle',
            security: bearerAuthSecurity,
            requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/SendInvitationRequest' } } } },
            responses: {
                200: { description: 'Invitation sent', content: { 'application/json': { schema: { $ref: '#/components/schemas/SendInvitationResponse' } } } },
                400: { description: COMMON_MESSAGE.BAD_REQUEST },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
            },
        },
    },
    '/circle/request-invitation': {
        get: {
            tags: ['Circle'],
            summary: 'Get current user circle invitations',
            security: bearerAuthSecurity,
            parameters: [
                { name: 'after', in: 'query', schema: { type: 'string', example: '1' } },
                { name: 'take', in: 'query', schema: { type: 'number', example: 10 } },
            ],
            responses: {
                200: {
                    description: 'Circle invitations retrieved',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/RequestInvitationResponse' } } },
                },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
            },
        },
    },
    '/circle/response-invitation': {
        post: {
            tags: ['Circle'],
            summary: 'Respond to a circle invitation',
            security: bearerAuthSecurity,
            requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ResponseInvitationRequest' } } } },
            responses: {
                200: { description: 'Invitation response recorded', content: { 'application/json': { schema: { $ref: '#/components/schemas/ResponseInvitationResponse' } } } },
                400: { description: COMMON_MESSAGE.BAD_REQUEST },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
            },
        },
    },
};
