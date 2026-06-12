import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { sendInvitationManageSchema } from '@/modules/circle/dto/admin-circle.dto';
import {
    resendInvitationSchema,
    respondJoinRequestInvitationSchema,
    respondJoinRequestSchema,
    responseInvitationSchema,
} from '@/modules/circle/dto/response-invitation.dto';
import { Router } from 'express';
import { circleController } from './controller/circle.controller';
import { createCircleSchema } from './dto/create-circle.dto';
import {
    banCircleMemberSchema,
    kickCircleMemberSchema,
    updateCircleMemberRoleSchema,
} from './dto/manage-member.dto';
import {
    circlePostsQuerySchema,
    circlePublicIdParamsSchema,
    circleReplyParamsSchema,
    circleStatsQuerySchema,
    cprBodySchema,
    createCirclePostRuntimeSchema,
    createCircleReplyRuntimeSchema,
    cursorLimitQuerySchema,
    expLogQuerySchema,
    manageMembersQuerySchema,
    offsetLimitQuerySchema,
    sacrificeBodySchema,
} from './dto/runtime.dto';
import { sendInvitationSchema } from './dto/send-invitation.dto';

const circleRouter = Router();

circleRouter.use(authorization);

circleRouter.get('/', circleController.getCircle);
circleRouter.get('/me-join', circleController.getMyJoinedCircles);
circleRouter.get('/me/owner-circle', circleController.getMyOwnerCircles);
circleRouter.get('/request-invitation', circleController.getRequestInvitation);
circleRouter.get(
    '/invitations/me/:publicId',
    validate(circlePublicIdParamsSchema, 'params'),
    circleController.getMyInvitationDetail,
);
circleRouter.post('/', validate(createCircleSchema), circleController.createCircle);
circleRouter.post('/send-invitation', validate(sendInvitationSchema), circleController.sendInvitation);
circleRouter.post('/response-invitation', validate(responseInvitationSchema), circleController.acceptInvitation);
circleRouter.post("/:publicId/level-up", validate(circlePublicIdParamsSchema, 'params'), circleController.levelUpCircle);
circleRouter.get(
    '/:publicId/energy',
    validate(circlePublicIdParamsSchema, 'params'),
    circleController.getCircleEnergy,
);
circleRouter.get(
    '/:publicId/user-quantity-post',
    validate(circlePublicIdParamsSchema, 'params'),
    circleController.getUserQuantityPostInCircle,
);

circleRouter.get(
    '/:publicId/manage/exp-log',
    validate(circlePublicIdParamsSchema, 'params'),
    validate(expLogQuerySchema, 'query'),
    circleController.getCircleExpLog,
);
circleRouter.get(
    '/:publicId/manage/post-quality-log',
    validate(circlePublicIdParamsSchema, 'params'),
    validate(offsetLimitQuerySchema, 'query'),
    circleController.getAllCirclePostQualityLog,
);
circleRouter.get(
    '/:publicId/manage/members',
    validate(circlePublicIdParamsSchema, 'params'),
    validate(manageMembersQuerySchema, 'query'),
    circleController.getManageMembers,
);
circleRouter.patch(
    '/:publicId/manage/members/role',
    validate(circlePublicIdParamsSchema, 'params'),
    validate(updateCircleMemberRoleSchema),
    circleController.updateMemberRole,
);
circleRouter.post(
    '/:publicId/manage/members/ban',
    validate(circlePublicIdParamsSchema, 'params'),
    validate(banCircleMemberSchema),
    circleController.banMember,
);
circleRouter.post(
    '/:publicId/manage/members/kick',
    validate(circlePublicIdParamsSchema, 'params'),
    validate(kickCircleMemberSchema),
    circleController.kickMember,
);
circleRouter.get(
    '/:publicId/manage/invitations/stats',
    validate(circlePublicIdParamsSchema, 'params'),
    circleController.getManageInvitationStats,
);
circleRouter.get(
    '/:publicId/manage/invitations',
    validate(circlePublicIdParamsSchema, 'params'),
    validate(offsetLimitQuerySchema, 'query'),
    circleController.getManageInvitations,
);
circleRouter.get(
    '/:publicId/manage/join-requests',
    validate(circlePublicIdParamsSchema, 'params'),
    validate(offsetLimitQuerySchema, 'query'),
    circleController.getManageJoinRequests,
);

circleRouter.post(
    '/:publicId/manage/resend',
    validate(circlePublicIdParamsSchema, 'params'),
    validate(resendInvitationSchema),
    circleController.resendManageInvitation,
);
circleRouter.post(
    '/:publicId/manage/join-request/respond',
    validate(circlePublicIdParamsSchema, 'params'),
    validate(respondJoinRequestSchema),
    circleController.respondJoinRequest,
);

circleRouter.post("/:publicId/send-invitation/manage",
    validate(sendInvitationManageSchema),
    validate(circlePublicIdParamsSchema, 'params'),
    circleController.sendInvitationByAdmin);
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
    '/:publicId/join-request/respond-invitation',
    validate(circlePublicIdParamsSchema, 'params'),
    validate(respondJoinRequestInvitationSchema),
    circleController.respondJoinRequestInvitation,
);



circleRouter.post(
    '/:publicId/posts/:postPublicId/reply',
    validate(circleReplyParamsSchema, 'params'),
    validate(createCircleReplyRuntimeSchema),
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
    validate(circleStatsQuerySchema, 'query'),
    circleController.getCircleStats,
);

circleRouter.get(
    '/:publicId/members',
    validate(circlePublicIdParamsSchema, 'params'),
    circleController.getMembers,
);
circleRouter.get('/:publicId', validate(circlePublicIdParamsSchema, 'params'), circleController.getCircleDetail);

export default circleRouter;
