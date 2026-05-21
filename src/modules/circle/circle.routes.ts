import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { responseInvitationSchema } from '@/modules/circle/dto/response-invitation.dto';
import { Router } from 'express';
import { circleController } from './controller/circle.controller';
import { createCircleSchema } from './dto/create-circle.dto';
import {
    circlePostsQuerySchema,
    circlePublicIdParamsSchema,
    circleReplyParamsSchema,
    cprBodySchema,
    createCirclePostRuntimeSchema,
    cursorLimitQuerySchema,
    expLogQuerySchema,
    sacrificeBodySchema,
} from './dto/runtime.dto';
import { sendInvitationSchema } from './dto/send-invitation.dto';

const circleRouter = Router();

circleRouter.use(authorization);

circleRouter.get('/', circleController.getCircle);
circleRouter.get('/me-join', circleController.getMyJoinedCircles);
circleRouter.get('/request-invitation', circleController.getRequestInvitation);
circleRouter.post('/', validate(createCircleSchema), circleController.createCircle);
circleRouter.post('/send-invitation', validate(sendInvitationSchema), circleController.sendInvitation);
circleRouter.post('/response-invitation', validate(responseInvitationSchema), circleController.acceptInvitation);

circleRouter.get(
    '/:publicId/energy',
    validate(circlePublicIdParamsSchema, 'params'),
    circleController.getCircleEnergy,
);
circleRouter.get(
    '/:publicId/exp-log',
    validate(circlePublicIdParamsSchema, 'params'),
    validate(expLogQuerySchema, 'query'),
    circleController.getCircleExpLog,
);
circleRouter.post(
    '/:publicId/posts',
    validate(circlePublicIdParamsSchema, 'params'),
    validate(createCirclePostRuntimeSchema),
    circleController.createCirclePost,
);
circleRouter.get(
    '/:publicId/posts',
    validate(circlePublicIdParamsSchema, 'params'),
    validate(circlePostsQuerySchema, 'query'),
    circleController.getCirclePosts,
);
circleRouter.post(
    '/:publicId/join-request',
    validate(circlePublicIdParamsSchema, 'params'),
    circleController.sendJoinRequest,
);
circleRouter.post(
    '/:publicId/posts/:postPublicId/reply',
    validate(circleReplyParamsSchema, 'params'),
    validate(createCirclePostRuntimeSchema),
    circleController.createCircleReply,
);
circleRouter.get(
    '/:publicId/posts/:postPublicId/replies',
    validate(circleReplyParamsSchema, 'params'),
    validate(cursorLimitQuerySchema, 'query'),
    circleController.getCircleReplies,
);
circleRouter.post(
    '/:publicId/cpr',
    validate(circlePublicIdParamsSchema, 'params'),
    validate(cprBodySchema),
    circleController.createCprSession,
);
circleRouter.get(
    '/:publicId/cpr/status',
    validate(circlePublicIdParamsSchema, 'params'),
    circleController.getCprStatus,
);
circleRouter.post(
    '/:publicId/sacrifice',
    validate(circlePublicIdParamsSchema, 'params'),
    validate(sacrificeBodySchema),
    circleController.sacrificeKarma,
);
circleRouter.get(
    '/:publicId/stats',
    validate(circlePublicIdParamsSchema, 'params'),
    circleController.getCircleStats,
);

circleRouter.get(
    '/:publicId/members',
    validate(circlePublicIdParamsSchema, 'params'),
    circleController.getMembers,
);
circleRouter.get('/:publicId', validate(circlePublicIdParamsSchema, 'params'), circleController.getCircleDetail);

export default circleRouter;
