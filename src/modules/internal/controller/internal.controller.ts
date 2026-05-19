import { AUTH_MESSAGE } from '@/constants/message';
import { Request, Response } from 'express';
import type { JudgeCompleteBodyDto } from '../dto/request/judge-complete.dto';
import { internalService } from '../service/internal.service';

class InternalController {
    async judgeComplete(req: Request<{}, {}, JudgeCompleteBodyDto>, res: Response) {
        const userId = req.user?.sub;
        if (!userId) {
            return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
        }

        const data = await internalService.handleJudgeComplete(req.body);
        return res.success(200, 'Judge complete handled successfully', data);
    }
}

export const internalController = new InternalController();
