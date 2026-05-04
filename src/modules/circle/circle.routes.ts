import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { circleController } from './controller/circle.controller';
import { createCircleSchema } from './dto/create-circle.dto';
import { sendInvitationSchema } from './dto/send-invitation.dto';

const circleRouter = Router();

circleRouter.get('/', circleController.getCircle);
circleRouter.post('/', authorization, validate(createCircleSchema), circleController.createCircle);
circleRouter.post('/send-invitation', authorization, validate(sendInvitationSchema), circleController.sendInvitation);


export default circleRouter;