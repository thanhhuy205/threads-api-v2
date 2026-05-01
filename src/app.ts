import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import env from '../config/env';
import errorHandler from './middlewares/error-handler';
import notFoundHandler from './middlewares/not-found';
import apiRouter from './routes';

const createApp = () => {
    const app = express();

    const corsOrigin =
        env.CORS_ORIGIN === '*'
            ? '*'
            : env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);

    const apiLimiter = rateLimit({
        windowMs: env.RATE_LIMIT_WINDOW_MS,
        limit: env.RATE_LIMIT_MAX,
    });

    app.disable('x-powered-by');

    app.use(helmet());
    app.use(cors({ origin: corsOrigin }));
    app.use(compression());
    app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true }));

    app.use('/api/v1', apiLimiter, apiRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};

export default createApp;