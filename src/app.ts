import configService from '@/config/config';
import { corsOrigin } from '@/middlewares/cors';
import { errorHandler } from '@/middlewares/error-handler';
import { logger } from '@/middlewares/logger';
import { notFoundHandler } from '@/middlewares/not-found';
import router from '@/routes/index';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { responseHandler } from './middlewares/response-handler';
const app = express();

app.disable('x-powered-by');
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                connectSrc: [
                    "'self'",
                    'https://threads.huydarealest.com',
                ],
            },
        },
    }),
);
app.use(cors({ origin: corsOrigin }));
app.use(compression());
app.set('trust proxy', 1)
app.use(morgan(configService.NODE_ENV === 'development' ? 'dev' : 'combined'));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use(responseHandler);


app.use('/api/v1', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
}), router);

app.use(notFoundHandler);
app.use(errorHandler);


export default app;
