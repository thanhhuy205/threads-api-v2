import { authorization } from '@/middlewares/auth';
import { Router } from 'express';
import { circleController } from './controller/circle.controller';

const circleRouter = Router();

circleRouter.get('/', circleController.getCircle);
circleRouter.post('/', authorization, circleController.createCircle);
circleRouter.post("/send-invitation", circleController.sendInvitation);


export default circleRouter;