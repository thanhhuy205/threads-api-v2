import { ResponseInvitationDto } from '@/modules/circle/dto/response-invitation.dto';
import type { SendInvitationDto } from '@/modules/circle/dto/send-invitation.dto';
import { getPagination } from '@/shared/pagination/pagination';
import type { Request, Response } from 'express';
import { circleService } from '../service/circle.service';

class CircleController {
    async getCircle(req: Request, res: Response) {
        const { currentPage, perPage } = getPagination(req);
        const circle = await circleService.getCircle(currentPage, perPage);
        return res.paginate({ rows: circle.circles, pagination: circle.pagination });
    }

    async createCircle(req: Request, res: Response) {
        const circle = await circleService.createCircle(req.body);
        return res.success(201, 'Circle created successfully', circle);
    }

    async getRequestInvitation(req: Request, res: Response) {
        const { currentPage, perPage } = getPagination(req);
        if (!req.user) {
            return res.error(401, 'Unauthorized');
        }
        const circle = await circleService.getRequestInvitation(currentPage, perPage, req.user.id);
        return res.paginate({ rows: circle.invitations, pagination: circle.pagination });
    }

    async sendInvitation(req: Request<{}, {}, SendInvitationDto, {}>, res: Response) {
        if (!req.user) {
            return res.error(401, 'Unauthorized');
        }
        const { circleId, userId } = req.body;
        const result = await circleService.sendInvitation({
            circleId,
            userId,
            inviterId: req.user.id,
        });
        return res.success(200, `Invitation sent to user ${userId} for circle ${circleId}`);
    }

    async acceptInvitation(req: Request<{}, {}, ResponseInvitationDto, {}>, res: Response) {
        if (!req.user) {
            return res.error(401, 'Unauthorized');
        }
        const { circleId, status } = req.body;
        await circleService.acceptInvitation({
            circleId,
            userId: req.user.id,
            status: status === 'ACCEPTED' ? 'ACCEPTED' : 'REJECTED',
        });
        return res.success(200, `Invitation ${status} for user ${req.user.id} to join circle ${circleId}`);
    }

}

export const circleController = new CircleController();