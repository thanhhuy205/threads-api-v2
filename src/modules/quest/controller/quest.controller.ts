import { AUTH_MESSAGE } from '@/constants/message';
import { Request, Response } from 'express';
import type { ClaimQuestParamsDto } from '../dto/request/claim-quest.params.dto';
import { questService } from '../service/quest.service';

class QuestController {
    async getDailyQuests(req: Request, res: Response) {
        const userId = req.user?.sub;
        if (!userId) {
            return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
        }

        const data = await questService.getDailyQuests(userId);
        return res.success(200, 'Daily quests retrieved successfully', data);
    }

    async claimQuest(req: Request<ClaimQuestParamsDto>, res: Response) {
        const userId = req.user?.sub;
        if (!userId) {
            return res.error(401, AUTH_MESSAGE.TOKEN_INVALID);
        }

        const data = await questService.claimQuest(userId, req.params.questId);
        return res.success(200, 'Quest claimed successfully', data);
    }
}

export const questController = new QuestController();
