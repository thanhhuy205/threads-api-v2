import { AUTH_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const aiSwaggerSchemas = {
    AiModerateRequest: {
        type: 'object',
        properties: {
            content: { type: 'string', example: 'This is a sample post content.' },
        },
        required: ['content'],
    },
    AiModerateData: {
        type: 'object',
        properties: {
            isSafe: { type: 'boolean', example: true },
            confidence: { type: 'number', example: 0.99 },
        },
        required: ['isSafe', 'confidence'],
    },
    AiModerateResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Content moderated' },
            data: { $ref: '#/components/schemas/AiModerateData' },
        },
        required: ['success', 'message', 'data'],
    },
    AiCaptionRequest: {
        type: 'object',
        properties: {
            imageUrl: { type: 'string', format: 'uri', example: 'https://cdn.example.com/image.jpg' },
        },
        required: ['imageUrl'],
    },
    AiCaptionData: {
        type: 'object',
        properties: {
            captions: { type: 'array', items: { type: 'string' } },
            hashtags: { type: 'array', items: { type: 'string' } },
        },
        required: ['captions', 'hashtags'],
    },
    AiCaptionResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Caption generated' },
            data: { $ref: '#/components/schemas/AiCaptionData' },
        },
        required: ['success', 'message', 'data'],
    },
    AiSmartReplyRequest: {
        type: 'object',
        properties: {
            context: { type: 'string', example: 'Hey, how are you doing?' },
        },
        required: ['context'],
    },
    AiSmartReplyData: {
        type: 'object',
        properties: {
            replies: { type: 'array', items: { type: 'string' } },
        },
        required: ['replies'],
    },
    AiSmartReplyResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Smart replies generated' },
            data: { $ref: '#/components/schemas/AiSmartReplyData' },
        },
        required: ['success', 'message', 'data'],
    },
    AiRecommendationData: {
        type: 'object',
        properties: {
            friends: { type: 'array', items: { type: 'object', additionalProperties: true } },
            posts: { type: 'array', items: { type: 'object', additionalProperties: true } },
        },
        required: ['friends', 'posts'],
    },
    AiRecommendationResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Recommendations generated' },
            data: { $ref: '#/components/schemas/AiRecommendationData' },
        },
        required: ['success', 'message', 'data'],
    },
};

export const aiSwaggerPaths = {
    '/ai/moderate': {
        post: {
            tags: ['AI'],
            summary: 'Moderate post content with AI',
            security: bearerAuthSecurity,
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/AiModerateRequest' },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Content moderated',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AiModerateResponse' } } },
                },
                401: { description: AUTH_MESSAGE.TOKEN_INVALID },
            },
        },
    },
    '/ai/caption': {
        post: {
            tags: ['AI'],
            summary: 'Generate caption suggestions from image',
            security: bearerAuthSecurity,
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/AiCaptionRequest' },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Caption generated',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AiCaptionResponse' } } },
                },
                401: { description: AUTH_MESSAGE.TOKEN_INVALID },
            },
        },
    },
    '/ai/smart-reply': {
        post: {
            tags: ['AI'],
            summary: 'Generate smart replies for chat context',
            security: bearerAuthSecurity,
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/AiSmartReplyRequest' },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Smart replies generated',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AiSmartReplyResponse' } } },
                },
                401: { description: AUTH_MESSAGE.TOKEN_INVALID },
            },
        },
    },
    '/ai/recommendations': {
        get: {
            tags: ['AI'],
            summary: 'Get AI recommendations for current user',
            security: bearerAuthSecurity,
            responses: {
                200: {
                    description: 'Recommendations generated',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AiRecommendationResponse' } } },
                },
                401: { description: AUTH_MESSAGE.TOKEN_INVALID },
            },
        },
    },
};