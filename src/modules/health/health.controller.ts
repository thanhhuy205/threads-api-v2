import { HEALTH_MESSAGE } from '@/constants/message';
import { Request, Response } from 'express';
import { buildHealthPayload } from './health.service';

class HealthController {
    async getHealth(req: Request, res: Response) {
        res.success(200, HEALTH_MESSAGE.SERVICE_IS_HEALTHY, buildHealthPayload());
    }
}
export const healthController = new HealthController();