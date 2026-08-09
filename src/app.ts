import configService from '@/config/config';
import compression from 'compression';
import express from 'express';
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
app.use(compression());
app.set('trust proxy', 1)
app.use(morgan(configService.IS_DEV ? 'dev' : 'combined'));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(responseHandler);


export default app;
