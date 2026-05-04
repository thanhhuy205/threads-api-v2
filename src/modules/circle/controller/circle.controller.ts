import { Request, Response } from 'express';
import { circleService } from '../service/circle.service';

class CircleController {
    async getCircle(req: Request, res: Response) {
        const circle = await circleService.getCircle();
        return res.success(200, 'Circle module ready', circle);
    }

    async createCircle(req: Request, res: Response) {
        const circle = await circleService.createCircle(req.body);
        return res.success(201, 'Circle created successfully', circle);
    }

    async sendInvitation(req: Request, res: Response) {
        // Implement logic to send an invitation to join a circle using the data provided in req.body
        // This is a placeholder implementation and should be replaced with actual logic
        const { circleId, userId } = req.body;
        // Here you would typically implement the logic to send an invitation, such as saving it to the database or sending a notification
        return res.success(200, `Invitation sent to user ${userId} for circle ${circleId}`);
    }
}

export const circleController = new CircleController();