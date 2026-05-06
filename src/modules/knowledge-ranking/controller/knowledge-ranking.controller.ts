import { UnauthorizedException } from '@/errors/error';
import type { Request, Response } from 'express';
import type { CreateKnowledgeRankingRequestDto, KnowledgePostIdParamsDto } from '../dto/request/knowledge-ranking.request';
import { knowledgeRankingService } from '../service/knowledge-ranking.service';

class KnowledgeRankingController {
    async postRanking(req: Request<KnowledgePostIdParamsDto, {}, CreateKnowledgeRankingRequestDto>, res: Response) {
        if (req?.user) throw new UnauthorizedException();
        const ranking = await knowledgeRankingService.create({
            knowledgePostId: req.params.knowledgePostId,
            userId: req.user?.sub!,
            criteria: req.body.criteria,
        });
        return res.success(201, 'Knowledge ranking created', ranking);
    }

    async getRanking(req: Request<KnowledgePostIdParamsDto>, res: Response) {
        const rankings = await knowledgeRankingService.findByKnowledgePostId(req.params.knowledgePostId);
        return res.success(200, 'Knowledge rankings retrieved', rankings);
    }
}

export const knowledgeRankingController = new KnowledgeRankingController();
