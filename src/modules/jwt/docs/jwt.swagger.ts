export const jwtSwaggerSchemas = {
    TokenPair: {
        type: 'object',
        properties: {
            accessToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            refreshToken: {
                type: 'string',
                example: '4f3d2c1b9a8e7d6c5b4a392817162534...',
            },
            sessionId: {
                type: 'string',
                example: '8f7d2b3e-4d5a-6c7f-8a9b-0c1d2e3f4a5b',
            },
        },
        required: ['accessToken', 'refreshToken', 'sessionId'],
    },
};

export const jwtSwaggerPaths = {};