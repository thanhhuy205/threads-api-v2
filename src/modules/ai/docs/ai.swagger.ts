import { COMMON_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const aiSwaggerSchemas = {
    AiGenerateImageRequest: {
        type: 'object',
        properties: {
            content: {
                type: 'string',
                example: 'A dreamy sunset over a calm lake, cinematic lighting',
            },
            draftId: {
                type: 'string',
                example: 'draft_123',
                description: 'Optional draft ID used to persist the preview job record.',
            },
        },
        required: ['content'],
        additionalProperties: true,
    },
    AiGenerateImageData: {
        type: 'object',
        properties: {
            sdGenerationJob: {
                type: 'object',
                additionalProperties: true,
                example: {
                    generationId: '020d4b8f-3a2a-4d36-8121-ad734a979f7a',
                },
            },
        },
        required: ['sdGenerationJob'],
    },
    AiGenerateImageResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Image generation job created' },
            data: { $ref: '#/components/schemas/AiGenerateImageData' },
        },
        required: ['success', 'message', 'data'],
    },
};

export const aiSwaggerPaths = {
    '/ai/generate-image': {
        post: {
            tags: ['AI'],
            summary: 'Submit Leonardo image generation job',
            security: bearerAuthSecurity,
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/AiGenerateImageRequest' },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Image generation job created',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/AiGenerateImageResponse' },
                        },
                    },
                },
                400: { description: COMMON_MESSAGE.BAD_REQUEST },
                401: { description: COMMON_MESSAGE.UNAUTHORIZED },
            },
        },
    },
};
