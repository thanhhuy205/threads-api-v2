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
    adminSwaggerPaths,
    adminSwaggerSchemas,
} from '../modules/admin/docs/admin.swagger';
import {
    aiSwaggerPaths,
    aiSwaggerSchemas,
} from '../modules/ai/docs/ai.swagger';
import {
    circleSwaggerPaths,
    circleSwaggerSchemas,
} from '../modules/circle/docs/circle.swagger';

import {
    jwtSwaggerSchemas,
} from '../modules/jwt/docs/jwt.swagger';
import {
    messageGroupSwaggerPaths,
    messageGroupSwaggerSchemas,
} from '../modules/message-group/docs/message-group.swagger';
import {
    museumSwaggerPaths,
    museumSwaggerSchemas,
} from '../modules/museum/docs/museum.swagger';
import {
    notificationSwaggerPaths,
    notificationSwaggerSchemas,
} from '../modules/notification-group/docs/notification.swagger';
import {
    pusherSwaggerPaths,
    pusherSwaggerSchemas,
} from '../modules/pusher/docs/pusher.swagger';
import {
    questSwaggerPaths,
    questSwaggerSchemas,
} from '../modules/quest/docs/quest.swagger';
import {
    searchSwaggerPaths,
    searchSwaggerSchemas,
} from '../modules/search/docs/search.swagger';
import {
    topicSwaggerPaths,
    topicSwaggerSchemas,
} from '../modules/topic/docs/topic.swagger';
import {
    webhooksSwaggerPaths,
    webhooksSwaggerSchemas,
} from '../modules/webhooks/docs/webhooks.swagger';

export const swaggerDocument = {
    openapi: '3.0.0',

    info: {
        title: 'Threads API',
        version: '1.0.0',
        description: 'API documentation for Threads API',
    },

    servers: [
        {
            url: 'https://threads.huydarealest.com/api/v1',
            description: 'Production server',
        },
        {
            url: 'http://localhost:3302/api/v1',
            description: 'Local server',
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
            name: 'Circle',
            description: 'Circle / community APIs',
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
            name: 'MessageGroup',
            description: 'Message group and message APIs',
        },
        {
            name: 'Topic',
            description: 'Topic APIs',
        },
        {
            name: 'Quest',
            description: 'Quest and reward APIs',
        },
        {
            name: 'Museum',
            description: 'Museum archive APIs',
        },
        {
            name: 'Internal',
            description: 'Internal processing APIs',
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
            name: 'Webhooks',
            description: 'Webhook receiver APIs',
        },
    ],

    paths: {
        ...healthSwaggerPaths,
        ...authSwaggerPaths,
        ...postSwaggerPaths,
        ...userSwaggerPaths,
        ...uploadSwaggerPaths,
        ...circleSwaggerPaths,
        ...notificationSwaggerPaths,
        ...adminSwaggerPaths,
        ...aiSwaggerPaths,
        ...messageGroupSwaggerPaths,
        ...topicSwaggerPaths,
        ...questSwaggerPaths,
        ...museumSwaggerPaths,
        ...searchSwaggerPaths,
        ...pusherSwaggerPaths,
        ...webhooksSwaggerPaths,
    },

    components: {
        schemas: {
            ...healthSwaggerSchemas,
            ...authSwaggerSchemas,
            ...postSwaggerSchemas,
            ...userSwaggerSchemas,
            ...uploadSwaggerSchemas,
            ...circleSwaggerSchemas,
            ...notificationSwaggerSchemas,
            ...jwtSwaggerSchemas,
            ...adminSwaggerSchemas,
            ...aiSwaggerSchemas,
            ...messageGroupSwaggerSchemas,
            ...topicSwaggerSchemas,
            ...questSwaggerSchemas,
            ...museumSwaggerSchemas,
            ...searchSwaggerSchemas,
            ...pusherSwaggerSchemas,
            ...webhooksSwaggerSchemas,
        },

        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
            leonardoWebhookAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'Leonardo webhook callback API key',
                description: 'Leonardo webhook callback authorization header',
            },
        },
    },

    security: [
        {
            bearerAuth: [],
        },
    ],
};
