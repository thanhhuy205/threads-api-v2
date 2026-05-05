import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { responseInvitationSchema } from '@/modules/circle/dto/response-invitation.dto';
import { Router } from 'express';
import { circleController } from './controller/circle.controller';
import { createCircleSchema } from './dto/create-circle.dto';
import { sendInvitationSchema } from './dto/send-invitation.dto';

const circleRouter = Router();

circleRouter.get('/', circleController.getCircle);
circleRouter.get('request-invitation', authorization, circleController.getCircle);
circleRouter.post('/', authorization, validate(createCircleSchema), circleController.createCircle);
circleRouter.post('/send-invitation', authorization, validate(sendInvitationSchema), circleController.sendInvitation);
circleRouter.post('/response-invitation', authorization, validate(responseInvitationSchema), circleController.acceptInvitation);

export default circleRouter;