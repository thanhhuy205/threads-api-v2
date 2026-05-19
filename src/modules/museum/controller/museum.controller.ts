import { AUTH_MESSAGE } from '@/constants/message';
import { Request, Response } from 'express';
import type { MuseumPublicIdParamsDto } from '../dto/request/museum.params.dto';
import type { MuseumQueryDto } from '../dto/request/museum.query.dto';
import { museumService } from '../service/museum.service';

class MuseumController {
    async getMuseumList(req: Request<{}, {}, {}, MuseumQueryDto>, res: Response) {
        const userId = req.user?.sub;
        if (!userId) {
            return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
        }

        const data = await museumService.getMuseumList(req.query_parsed);
        return res.success(200, 'Museum list retrieved successfully', data);
    }

    async getMuseumDetail(req: Request<MuseumPublicIdParamsDto>, res: Response) {
        const userId = req.user?.sub;
        if (!userId) {
            return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
        }

        const data = await museumService.getMuseumDetail(req.params.publicId);
        return res.success(200, 'Museum detail retrieved successfully', data);
    }
}

export const museumController = new MuseumController();
