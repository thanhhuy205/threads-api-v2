import { Request, Response } from 'express';
import { circleService } from '../service/circle.service';

class CircleController {
    async getCircle(req: Request, res: Response) {
        const circle = await circleService.getCircle();
        return res.success(200, 'Circle module ready', circle);
    }
}

export const circleController = new CircleController();