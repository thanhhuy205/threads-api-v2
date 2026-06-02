import { COMMON_MESSAGE } from '@/constants/message';

const bearerAuthSecurity = [{ bearerAuth: [] }];

export const aiSwaggerSchemas = {
    AiGenerateImageRequest: {
        type: 'object',
        properties: {
            textNguoiDung: {
                type: 'string',
                example: 'A dreamy sunset over a calm lake, cinematic lighting',
                description: 'Fallback keys also supported: text, content',
            },
            text: { type: 'string', nullable: true },
            content: { type: 'string', nullable: true },
        },
        required: ['textNguoiDung'],
    },
    AiGenerateImageData: {
        type: 'object',
        properties: {
            fileUrl: {
                type: 'string',
                example: 'https://cdn.example.com/ai/generated/image.png',
            },
        },
        required: ['fileUrl'],
    },
    AiGenerateImageResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Image generated' },
            data: { $ref: '#/components/schemas/AiGenerateImageData' },
        },
        required: ['success', 'message', 'data'],
    },
};

export const aiSwaggerPaths = {
    '/ai/generate-image': {
        post: {
            tags: ['AI'],
            summary: 'Generate image and return file URL',
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
                    description: 'Image generated',
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
