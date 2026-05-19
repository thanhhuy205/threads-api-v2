import { authorization } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { Router } from 'express';
import { museumController } from './controller/museum.controller';
import { museumPublicIdParamsSchema } from './dto/request/museum.params.dto';
import { museumQuerySchema } from './dto/request/museum.query.dto';

const museumRouter = Router();

museumRouter.use(authorization);

museumRouter.get('/', validate(museumQuerySchema, 'query'), museumController.getMuseumList);
museumRouter.get('/:publicId', validate(museumPublicIdParamsSchema, 'params'), museumController.getMuseumDetail);

export default museumRouter;
