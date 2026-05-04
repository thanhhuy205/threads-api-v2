import { Router } from 'express';
import { circleController } from './controller/circle.controller';

const circleRouter = Router();

circleRouter.get('/', circleController.getCircle);

export default circleRouter;