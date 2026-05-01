import { Request, Response } from 'express';
import { buildHealthPayload } from './health.service';

class HealthController {
    async getHealth(req: Request, res: Response) {
        res.success(200, 'Service is healthy', buildHealthPayload());
    }
}
export const healthController = new HealthController();