import { apiLimiter } from '@/middlewares/ratelimit';
import router from '@/routes/index';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import pino from 'pino';
import env from './config/env';
import errorHandler from './middlewares/error-handler';
import notFoundHandler from './middlewares/not-found';

const app = express();
app.use(pino)

const corsOrigin =
    env.CORS_ORIGIN === '*'
        ? '*'
        : env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);


app.disable('x-powered-by');

app.use(helmet());
app.use(cors({ origin: corsOrigin }));
app.use(compression());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', apiLimiter, router);

app.use(notFoundHandler);
app.use(errorHandler);


export default app;