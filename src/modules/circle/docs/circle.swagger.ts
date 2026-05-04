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
    CreateCircleResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Circle created successfully' },
            data: { $ref: '#/components/schemas/CircleItem' },
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
                    pagination: {
                        type: 'object',
                        properties: {
                            currentPage: { type: 'number' },
                            perPage: { type: 'number' },
                            total: { type: 'number' },
                            lastPage: { type: 'number' },
                            from: { type: 'number' },
                            to: { type: 'number' },
                        },
                    },
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
};

export const circleSwaggerPaths = {
    '/circle': {
        get: {
            tags: ['Circle'],
            summary: 'List circles',
            parameters: [
                { name: 'page', in: 'query', schema: { type: 'number' } },
                { name: 'limit', in: 'query', schema: { type: 'number' } },
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
