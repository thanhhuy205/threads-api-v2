import {
    authSwaggerPaths,
    authSwaggerSchemas,
} from '../modules/auth/docs/auth.swagger';

import {
    healthSwaggerPaths,
    healthSwaggerSchemas,
} from '../modules/health/docs/health.swagger';

import {
    postSwaggerPaths,
    postSwaggerSchemas,
} from '../modules/post/docs/post.swagger';

import {
    userSwaggerPaths,
    userSwaggerSchemas,
} from '../modules/user/docs/user.swagger';

import {
    uploadSwaggerPaths,
    uploadSwaggerSchemas,
} from '../modules/upload/docs/upload.swagger';

import {
    aiSwaggerPaths,
    aiSwaggerSchemas,
} from '../modules/ai/docs/ai.swagger';
import {
    jwtSwaggerSchemas,
} from '../modules/jwt/docs/jwt.swagger';
import {
    notificationSwaggerPaths,
    notificationSwaggerSchemas,
} from '../modules/notification-group/docs/notification.swagger';
import {
    pusherSwaggerPaths,
    pusherSwaggerSchemas,
} from '../modules/pusher/docs/pusher.swagger';
import {
    pollSwaggerPaths,
    pollSwaggerSchemas,
} from '../modules/poll/docs/poll.swagger';
import {
    searchSwaggerPaths,
    searchSwaggerSchemas,
} from '../modules/search/docs/search.swagger';
import {
    topicSwaggerPaths,
    topicSwaggerSchemas,
} from '../modules/topic/docs/topic.swagger';

export const swaggerDocument = {
    openapi: '3.0.0',

    info: {
        title: 'Threads API',
        version: '1.0.0',
        description: 'API documentation for Threads API',
    },

    servers: [
        {
            url: 'http://localhost:3302/api/v1',
            description: 'Local server',
        },
        {
            url: 'https://threads.huydarealest.com/api/v1',
            description: 'Production server',
        },
    ],

    tags: [
        {
            name: 'Health',
            description: 'Health check APIs',
        },
        {
            name: 'Auth',
            description: 'Authentication APIs',
        },
        {
            name: 'Post',
            description: 'Post APIs',
        },
        {
            name: 'User',
            description: 'User and social APIs',
        },
        {
            name: 'Upload',
            description: 'Upload APIs',
        },
        {
            name: 'Notification',
            description: 'Notification APIs',
        },
        {
            name: 'Admin',
            description: 'Admin APIs',
        },
        {
            name: 'AI',
            description: 'AI generation APIs',
        },
        {
            name: 'Topic',
            description: 'Topic APIs',
        },
        {
            name: 'Search',
            description: 'Search APIs',
        },
        {
            name: 'Pusher',
            description: 'Realtime authorization APIs',
        },
        {
            name: 'Poll',
            description: 'Poll voting APIs',
        },
    ],

    paths: {
        ...healthSwaggerPaths,
        ...authSwaggerPaths,
        ...postSwaggerPaths,
        ...userSwaggerPaths,
        ...uploadSwaggerPaths,
        ...notificationSwaggerPaths,
        ...aiSwaggerPaths,
        ...topicSwaggerPaths,
        ...searchSwaggerPaths,
        ...pusherSwaggerPaths,
        ...pollSwaggerPaths,
    },

    components: {
        schemas: {
            ...healthSwaggerSchemas,
            ...authSwaggerSchemas,
            ...postSwaggerSchemas,
            ...userSwaggerSchemas,
            ...uploadSwaggerSchemas,
            ...notificationSwaggerSchemas,
            ...jwtSwaggerSchemas,
            ...aiSwaggerSchemas,
            ...topicSwaggerSchemas,
            ...searchSwaggerSchemas,
            ...pusherSwaggerSchemas,
            ...pollSwaggerSchemas,
        },

        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },

    security: [
        {
            bearerAuth: [],
        },
    ],
};
